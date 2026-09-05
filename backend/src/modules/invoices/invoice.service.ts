import { prisma, isDatabaseAvailable } from '../../config/db.js';
import { contactService } from '../contacts/contact.service.js';
import { productService } from '../products/product.service.js';
import { accountingService } from '../accounting/accounting.service.js';
import { NotFoundError, BadRequestError, ForbiddenError } from '../../utils/errors.js';
import type { CreateInvoiceInput, ListInvoicesQuery } from './invoice.schema.js';
import type { AuthUserPayload } from '../../middleware/auth.middleware.js';

export interface InvoiceLineRecord {
  id: string;
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
  tax: number;
  total: number;
}

export interface InvoiceRecord {
  id: string;
  invoiceNumber: string;
  customerId: string;
  customerName: string;
  customerEmail?: string;
  salesOrderId?: string;
  issueDate: string;
  dueDate: string;
  status: 'DRAFT' | 'POSTED' | 'PAID' | 'OVERDUE' | 'CANCELLED';
  lines: InvoiceLineRecord[];
  subtotal: number;
  taxTotal: number;
  grandTotal: number;
  amountPaid: number;
  balanceDue: number;
  journalEntryId?: string;
  createdAt: Date;
}

const memoryInvoices = new Map<string, InvoiceRecord>();

// Seed canonical invoice (INV-2026-0042)
const seedInvoice: InvoiceRecord = {
  id: 'inv_seed_001',
  invoiceNumber: 'INV-2026-0042',
  customerId: 'c1111111-1111-1111-1111-111111111111', // Nimesh Pathak
  customerName: 'Nimesh Pathak',
  customerEmail: 'nimesh@pathak.com',
  issueDate: '2026-09-02',
  dueDate: '2026-09-16',
  status: 'POSTED',
  lines: [
    {
      id: 'invl_001',
      productId: 'p1111111-1111-1111-1111-111111111111',
      productName: 'Office Chair',
      quantity: 10,
      unitPrice: 4500,
      subtotal: 45000,
      tax: 8100,
      total: 53100,
    },
    {
      id: 'invl_002',
      productId: 'p2222222-2222-2222-2222-222222222222',
      productName: 'Wooden Table',
      quantity: 5,
      unitPrice: 12000,
      subtotal: 60000,
      tax: 10800,
      total: 70800,
    },
  ],
  subtotal: 105000,
  taxTotal: 18900,
  grandTotal: 123900,
  amountPaid: 45000,
  balanceDue: 78900,
  journalEntryId: 'ent_seed_001',
  createdAt: new Date('2026-09-02T10:00:00Z'),
};

memoryInvoices.set(seedInvoice.id, seedInvoice);

let invoiceCounter = 43;

export class InvoiceService {
  public async listInvoices(
    query: ListInvoicesQuery,
    user?: AuthUserPayload
  ): Promise<{ items: InvoiceRecord[]; total: number }> {
    const { page, limit, search, status, customerId } = query;

    let all = Array.from(memoryInvoices.values());

    // Contact role restriction: CONTACT users only see invoices for their own account
    if (user && user.role === 'CONTACT') {
      all = all.filter(
        (inv) =>
          inv.customerId === user.userId ||
          (user.email && inv.customerEmail?.toLowerCase() === user.email.toLowerCase()) ||
          inv.customerName.toLowerCase().includes(user.name ? user.name.toLowerCase() : '')
      );
    } else if (customerId) {
      all = all.filter((inv) => inv.customerId === customerId);
    }

    if (status) all = all.filter((inv) => inv.status === status);
    if (search) {
      const s = search.toLowerCase();
      all = all.filter(
        (inv) =>
          inv.invoiceNumber.toLowerCase().includes(s) ||
          inv.customerName.toLowerCase().includes(s)
      );
    }

    const total = all.length;
    const start = (page - 1) * limit;
    const items = all
      .sort((a, b) => new Date(b.issueDate).getTime() - new Date(a.issueDate).getTime())
      .slice(start, start + limit);

    return { items, total };
  }

  public async getInvoiceById(id: string, user?: AuthUserPayload): Promise<InvoiceRecord> {
    const inv = memoryInvoices.get(id);
    if (!inv) {
      throw new NotFoundError('Invoice not found');
    }

    // Role check for CONTACT users
    if (user && user.role === 'CONTACT') {
      const isOwner =
        inv.customerId === user.userId ||
        (user.email && inv.customerEmail?.toLowerCase() === user.email.toLowerCase());
      if (!isOwner) {
        throw new ForbiddenError('You do not have permission to view this invoice');
      }
    }

    return inv;
  }

  public async createInvoice(input: CreateInvoiceInput): Promise<InvoiceRecord> {
    const customer = await contactService.getContactById(input.customerId);

    // Recalculate line items on backend
    let subtotal = 0;
    let taxTotal = 0;

    const lines: InvoiceLineRecord[] = [];
    for (let i = 0; i < input.lines.length; i++) {
      const item = input.lines[i];
      const product = await productService.getProductById(item.productId);
      const unitPrice = item.unitPrice !== undefined ? item.unitPrice : product.salesPrice;
      const lineSubtotal = Number((unitPrice * item.quantity).toFixed(2));
      const lineTax = Number((lineSubtotal * 0.18).toFixed(2));
      const lineTotal = Number((lineSubtotal + lineTax).toFixed(2));

      subtotal += lineSubtotal;
      taxTotal += lineTax;

      lines.push({
        id: `invl_${Date.now()}_${i}`,
        productId: product.id,
        productName: product.name,
        quantity: item.quantity,
        unitPrice,
        subtotal: lineSubtotal,
        tax: lineTax,
        total: lineTotal,
      });
    }

    const grandTotal = Number((subtotal + taxTotal).toFixed(2));
    const invoiceNumber = `INV-2026-${String(invoiceCounter++).padStart(4, '0')}`;
    const id = `inv_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    const issueDate = input.issueDate || new Date().toISOString().split('T')[0];
    const dueDate =
      input.dueDate ||
      new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0];

    // Automatically post balanced Double-Entry journal entry to General Ledger
    const entry = await accountingService.createInvoiceEntry({
      id,
      invoiceNumber,
      customerName: customer.name,
      subtotal,
      taxTotal,
      grandTotal,
      issueDate,
    });

    const newInvoice: InvoiceRecord = {
      id,
      invoiceNumber,
      customerId: customer.id,
      customerName: customer.name,
      customerEmail: customer.email || undefined,
      salesOrderId: input.salesOrderId,
      issueDate,
      dueDate,
      status: 'POSTED',
      lines,
      subtotal: Number(subtotal.toFixed(2)),
      taxTotal: Number(taxTotal.toFixed(2)),
      grandTotal,
      amountPaid: 0,
      balanceDue: grandTotal,
      journalEntryId: entry.reference,
      createdAt: new Date(),
    };

    memoryInvoices.set(id, newInvoice);
    return newInvoice;
  }

  public async recordPaymentSettlement(
    invoiceId: string,
    amount: number
  ): Promise<InvoiceRecord> {
    const inv = memoryInvoices.get(invoiceId);
    if (!inv) throw new NotFoundError('Invoice not found');

    if (amount <= 0) throw new BadRequestError('Payment amount must be greater than 0');
    if (amount > inv.balanceDue + 0.01) {
      throw new BadRequestError(
        `Payment (₹${amount.toLocaleString('en-IN')}) exceeds remaining balance (₹${inv.balanceDue.toLocaleString('en-IN')}).`
      );
    }

    inv.amountPaid = Number((inv.amountPaid + amount).toFixed(2));
    inv.balanceDue = Number((inv.grandTotal - inv.amountPaid).toFixed(2));
    if (inv.balanceDue <= 0.01) {
      inv.balanceDue = 0;
      inv.status = 'PAID';
    }

    memoryInvoices.set(invoiceId, inv);
    return inv;
  }
}

export const invoiceService = new InvoiceService();
export { memoryInvoices };
