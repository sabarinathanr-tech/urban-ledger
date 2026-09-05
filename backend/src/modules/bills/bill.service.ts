import { contactService } from '../contacts/contact.service.js';
import { productService } from '../products/product.service.js';
import { accountingService } from '../accounting/accounting.service.js';
import { NotFoundError, BadRequestError, ForbiddenError } from '../../utils/errors.js';
import type { CreateBillInput, ListBillsQuery } from './bill.schema.js';
import type { AuthUserPayload } from '../../middleware/auth.middleware.js';

export interface BillLineRecord {
  id: string;
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
  tax: number;
  total: number;
}

export interface BillRecord {
  id: string;
  billNumber: string;
  vendorId: string;
  vendorName: string;
  vendorEmail?: string;
  purchaseOrderId?: string;
  billDate: string;
  dueDate: string;
  status: 'DRAFT' | 'POSTED' | 'PAID' | 'OVERDUE' | 'CANCELLED';
  lines: BillLineRecord[];
  subtotal: number;
  taxTotal: number;
  grandTotal: number;
  amountPaid: number;
  balanceDue: number;
  journalEntryId?: string;
  createdAt: Date;
}

const memoryBills = new Map<string, BillRecord>();

// Seed canonical vendor bill (BILL-2026-0019)
const seedBill: BillRecord = {
  id: 'bill_seed_001',
  billNumber: 'BILL-2026-0019',
  vendorId: 'c2222222-2222-2222-2222-222222222222', // Azure Furniture
  vendorName: 'Azure Furniture',
  vendorEmail: 'orders@azurefurniture.com',
  billDate: '2026-09-03',
  dueDate: '2026-09-20',
  status: 'POSTED',
  lines: [
    {
      id: 'bl_001',
      productId: 'p2222222-2222-2222-2222-222222222222',
      productName: 'Wooden Table',
      quantity: 5,
      unitPrice: 7500,
      subtotal: 37500,
      tax: 6750,
      total: 44250,
    },
    {
      id: 'bl_002',
      productId: 'p1111111-1111-1111-1111-111111111111',
      productName: 'Office Chair',
      quantity: 5,
      unitPrice: 2800,
      subtotal: 14000,
      tax: 2520,
      total: 16520,
    },
  ],
  subtotal: 51500,
  taxTotal: 9270,
  grandTotal: 60770,
  amountPaid: 0,
  balanceDue: 60770,
  journalEntryId: 'BILL-POST-BILL-2026-0019',
  createdAt: new Date('2026-09-03T11:00:00Z'),
};

memoryBills.set(seedBill.id, seedBill);

let billCounter = 20;

export class BillService {
  public async listBills(
    query: ListBillsQuery,
    user?: AuthUserPayload
  ): Promise<{ items: BillRecord[]; total: number }> {
    const { page, limit, search, status, vendorId } = query;

    let all = Array.from(memoryBills.values());

    // Role check for CONTACT (vendor)
    if (user && user.role === 'CONTACT') {
      all = all.filter(
        (b) =>
          b.vendorId === user.userId ||
          (user.email && b.vendorEmail?.toLowerCase() === user.email.toLowerCase()) ||
          b.vendorName.toLowerCase().includes(user.name ? user.name.toLowerCase() : '')
      );
    } else if (vendorId) {
      all = all.filter((b) => b.vendorId === vendorId);
    }

    if (status) all = all.filter((b) => b.status === status);
    if (search) {
      const s = search.toLowerCase();
      all = all.filter(
        (b) =>
          b.billNumber.toLowerCase().includes(s) ||
          b.vendorName.toLowerCase().includes(s)
      );
    }

    const total = all.length;
    const start = (page - 1) * limit;
    const items = all
      .sort((a, b) => new Date(b.billDate).getTime() - new Date(a.billDate).getTime())
      .slice(start, start + limit);

    return { items, total };
  }

  public async getBillById(id: string, user?: AuthUserPayload): Promise<BillRecord> {
    const bill = memoryBills.get(id);
    if (!bill) {
      throw new NotFoundError('Vendor bill not found');
    }

    if (user && user.role === 'CONTACT') {
      const isOwner =
        bill.vendorId === user.userId ||
        (user.email && bill.vendorEmail?.toLowerCase() === user.email.toLowerCase());
      if (!isOwner) {
        throw new ForbiddenError('You do not have permission to view this vendor bill');
      }
    }

    return bill;
  }

  public async createBill(input: CreateBillInput): Promise<BillRecord> {
    const vendor = await contactService.getContactById(input.vendorId);

    let subtotal = 0;
    let taxTotal = 0;

    const lines: BillLineRecord[] = [];
    for (let i = 0; i < input.lines.length; i++) {
      const item = input.lines[i];
      const product = await productService.getProductById(item.productId);
      const unitPrice = item.unitPrice !== undefined ? item.unitPrice : product.purchasePrice;
      const lineSubtotal = Number((unitPrice * item.quantity).toFixed(2));
      const lineTax = Number((lineSubtotal * 0.18).toFixed(2));
      const lineTotal = Number((lineSubtotal + lineTax).toFixed(2));

      subtotal += lineSubtotal;
      taxTotal += lineTax;

      lines.push({
        id: `billl_${Date.now()}_${i}`,
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
    const billNumber = `BILL-2026-${String(billCounter++).padStart(4, '0')}`;
    const id = `bill_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    const billDate = input.billDate || new Date().toISOString().split('T')[0];
    const dueDate =
      input.dueDate ||
      new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0];

    // Automatically post balanced Double-Entry journal entry to General Ledger
    const entry = await accountingService.createBillEntry({
      id,
      billNumber,
      vendorName: vendor.name,
      subtotal,
      taxTotal,
      grandTotal,
      billDate,
    });

    const newBill: BillRecord = {
      id,
      billNumber,
      vendorId: vendor.id,
      vendorName: vendor.name,
      vendorEmail: vendor.email || undefined,
      purchaseOrderId: input.purchaseOrderId,
      billDate,
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

    memoryBills.set(id, newBill);
    return newBill;
  }

  public async recordPaymentSettlement(
    billId: string,
    amount: number
  ): Promise<BillRecord> {
    const bill = memoryBills.get(billId);
    if (!bill) throw new NotFoundError('Vendor bill not found');

    if (amount <= 0) throw new BadRequestError('Payment amount must be greater than 0');
    if (amount > bill.balanceDue + 0.01) {
      throw new BadRequestError(
        `Payment (₹${amount.toLocaleString('en-IN')}) exceeds remaining balance (₹${bill.balanceDue.toLocaleString('en-IN')}).`
      );
    }

    bill.amountPaid = Number((bill.amountPaid + amount).toFixed(2));
    bill.balanceDue = Number((bill.grandTotal - bill.amountPaid).toFixed(2));
    if (bill.balanceDue <= 0.01) {
      bill.balanceDue = 0;
      bill.status = 'PAID';
    }

    memoryBills.set(billId, bill);
    return bill;
  }
}

export const billService = new BillService();
export { memoryBills };
