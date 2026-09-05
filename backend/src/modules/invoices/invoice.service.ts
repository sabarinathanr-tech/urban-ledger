import { Prisma } from '@prisma/client';
import { prisma, isDatabaseAvailable } from '../../config/db.js';
import { contactService } from '../contacts/contact.service.js';
import { productService } from '../products/product.service.js';
import { accountingService } from '../accounting/accounting.service.js';
import { NotFoundError, BadRequestError, ForbiddenError } from '../../utils/errors.js';
import { logger } from '../../utils/logger.js';
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
  status: 'DRAFT' | 'POSTED' | 'PARTIALLY_PAID' | 'PAID' | 'OVERDUE' | 'CANCELLED';
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

function mapPrismaInvoiceToRecord(inv: any): InvoiceRecord {
  let displayStatus: 'DRAFT' | 'POSTED' | 'PARTIALLY_PAID' | 'PAID' | 'OVERDUE' | 'CANCELLED' = 'POSTED';
  if (inv.status === 'DRAFT') {
    displayStatus = 'DRAFT';
  } else if (inv.status === 'CANCELLED') {
    displayStatus = 'CANCELLED';
  } else if (inv.paymentStatus === 'PAID' || Number(inv.outstandingAmount) <= 0.01) {
    displayStatus = 'PAID';
  } else if (inv.paymentStatus === 'PARTIALLY_PAID' || (Number(inv.paidAmount) > 0 && Number(inv.outstandingAmount) > 0.01)) {
    displayStatus = 'PARTIALLY_PAID';
  } else if (new Date() > new Date(inv.dueDate)) {
    displayStatus = 'OVERDUE';
  } else {
    displayStatus = 'POSTED';
  }

  return {
    id: inv.id,
    invoiceNumber: inv.reference,
    customerId: inv.customerId,
    customerName: inv.customer?.name || 'Customer',
    customerEmail: inv.customer?.email || undefined,
    salesOrderId: inv.salesOrderId || undefined,
    issueDate: inv.invoiceDate instanceof Date ? inv.invoiceDate.toISOString().split('T')[0] : String(inv.invoiceDate).split('T')[0],
    dueDate: inv.dueDate instanceof Date ? inv.dueDate.toISOString().split('T')[0] : String(inv.dueDate).split('T')[0],
    status: displayStatus,
    lines: (inv.lines || []).map((l: any) => ({
      id: l.id,
      productId: l.productId,
      productName: l.product?.name || l.description || 'Product',
      quantity: Number(l.quantity),
      unitPrice: Number(l.unitPrice),
      subtotal: Number(l.lineSubtotal),
      tax: Number(l.lineTax),
      total: Number(l.lineTotal),
    })),
    subtotal: Number(inv.subtotal),
    taxTotal: Number(inv.taxAmount),
    grandTotal: Number(inv.totalAmount),
    amountPaid: Number(inv.paidAmount || 0),
    balanceDue: Number(inv.outstandingAmount),
    journalEntryId: inv.journalEntryId || undefined,
    createdAt: inv.createdAt,
  };
}

export class InvoiceService {
  public async listInvoices(
    query: ListInvoicesQuery,
    user?: AuthUserPayload
  ): Promise<{ items: InvoiceRecord[]; total: number }> {
    const { page, limit, search, status, customerId } = query;

    if (isDatabaseAvailable()) {
      try {
        const where: any = {};

        if (user && user.role === 'CONTACT') {
          where.OR = [
            { customerId: user.userId },
            { customer: { email: { equals: user.email, mode: 'insensitive' } } },
          ];
        } else if (customerId) {
          where.customerId = customerId;
        }

        if (status) {
          if (status === 'PAID') {
            where.paymentStatus = 'PAID';
          } else if (status === 'OVERDUE') {
            where.paymentStatus = { not: 'PAID' };
            where.dueDate = { lt: new Date() };
            where.status = 'POSTED';
          } else if (status === 'POSTED') {
            where.status = 'POSTED';
          } else if (status === 'DRAFT') {
            where.status = 'DRAFT';
          } else if (status === 'CANCELLED') {
            where.status = 'CANCELLED';
          }
        }

        if (search) {
          where.OR = [
            { reference: { contains: search, mode: 'insensitive' } },
            { customer: { name: { contains: search, mode: 'insensitive' } } },
          ];
        }

        const [items, total] = await Promise.all([
          prisma.invoice.findMany({
            where,
            include: {
              customer: true,
              lines: { include: { product: true } },
            },
            skip: (page - 1) * limit,
            take: limit,
            orderBy: { invoiceDate: 'desc' },
          }),
          prisma.invoice.count({ where }),
        ]);

        return {
          items: items.map(mapPrismaInvoiceToRecord),
          total,
        };
      } catch (err) {
        logger.warn('Failed to query invoices from Prisma, falling back to memory', err);
      }
    }

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
    if (isDatabaseAvailable()) {
      try {
        const inv = await prisma.invoice.findFirst({
          where: {
            OR: [
              { id },
              { reference: { equals: id, mode: 'insensitive' } },
            ],
          },
          include: {
            customer: true,
            lines: { include: { product: true } },
          },
        });

        if (inv) {
          if (user && user.role === 'CONTACT') {
            const isOwner =
              inv.customerId === user.userId ||
              (user.email && inv.customer?.email?.toLowerCase() === user.email.toLowerCase());
            if (!isOwner) {
              throw new ForbiddenError('You do not have permission to view this invoice');
            }
          }
          return mapPrismaInvoiceToRecord(inv);
        }
      } catch (err) {
        if (err instanceof ForbiddenError) throw err;
        logger.warn('Failed to get invoice from Prisma, falling back to memory', err);
      }
    }

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

    if (isDatabaseAvailable()) {
      try {
        const createdInv = await prisma.invoice.create({
          data: {
            reference: invoiceNumber,
            customerId: customer.id,
            salesOrderId: input.salesOrderId || undefined,
            journalEntryId: entry.id,
            invoiceDate: new Date(issueDate),
            dueDate: new Date(dueDate),
            status: 'POSTED',
            paymentStatus: 'UNPAID',
            subtotal: new Prisma.Decimal(subtotal),
            taxAmount: new Prisma.Decimal(taxTotal),
            totalAmount: new Prisma.Decimal(grandTotal),
            paidAmount: new Prisma.Decimal(0),
            outstandingAmount: new Prisma.Decimal(grandTotal),
            lines: {
              create: lines.map((l) => ({
                productId: l.productId,
                description: l.productName,
                quantity: new Prisma.Decimal(l.quantity),
                unitPrice: new Prisma.Decimal(l.unitPrice),
                taxRate: new Prisma.Decimal(18),
                lineSubtotal: new Prisma.Decimal(l.subtotal),
                lineTax: new Prisma.Decimal(l.tax),
                lineTotal: new Prisma.Decimal(l.total),
              })),
            },
          },
          include: { customer: true, lines: { include: { product: true } } },
        });

        const mapped = mapPrismaInvoiceToRecord(createdInv);
        memoryInvoices.set(createdInv.id, mapped);
        return mapped;
      } catch (err) {
        logger.warn('Failed to persist invoice to Prisma, falling back to memory', err);
      }
    }

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
    if (amount <= 0) throw new BadRequestError('Payment amount must be greater than 0');

    if (isDatabaseAvailable()) {
      try {
        const inv = await prisma.invoice.findFirst({
          where: { OR: [{ id: invoiceId }, { reference: { equals: invoiceId, mode: 'insensitive' } }] },
          include: { customer: true, lines: { include: { product: true } } },
        });

        if (inv) {
          if (inv.status === 'CANCELLED') {
            throw new BadRequestError('Cannot process payment against a cancelled invoice');
          }
          if (inv.status === 'DRAFT') {
            throw new BadRequestError('Cannot process payment against a draft invoice. Please post the invoice first.');
          }

          const balanceDue = Number(inv.outstandingAmount);
          if (amount > balanceDue + 0.01) {
            throw new BadRequestError(
              `Payment (₹${amount.toLocaleString('en-IN')}) exceeds remaining balance (₹${balanceDue.toLocaleString('en-IN')}).`
            );
          }

          const newPaid = Number((Number(inv.paidAmount) + amount).toFixed(2));
          const newBalance = Math.max(0, Number((Number(inv.totalAmount) - newPaid).toFixed(2)));
          const newStatus = newBalance <= 0.01 ? 'PAID' : 'PARTIALLY_PAID';

          const updated = await prisma.invoice.update({
            where: { id: inv.id },
            data: {
              paidAmount: new Prisma.Decimal(newPaid),
              outstandingAmount: new Prisma.Decimal(newBalance),
              paymentStatus: newStatus,
            },
            include: { customer: true, lines: { include: { product: true } } },
          });

          const mapped = mapPrismaInvoiceToRecord(updated);
          memoryInvoices.set(updated.id, mapped);
          return mapped;
        }
      } catch (err) {
        if (err instanceof BadRequestError) throw err;
        logger.warn('Failed to settle invoice in Prisma, falling back to memory', err);
      }
    }

    const inv = memoryInvoices.get(invoiceId);
    if (!inv) throw new NotFoundError('Invoice not found');

    if (inv.status === 'CANCELLED') {
      throw new BadRequestError('Cannot process payment against a cancelled invoice');
    }
    if (inv.status === 'DRAFT') {
      throw new BadRequestError('Cannot process payment against a draft invoice. Please post the invoice first.');
    }

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
