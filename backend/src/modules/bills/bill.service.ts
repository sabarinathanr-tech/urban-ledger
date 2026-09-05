import { Prisma } from '@prisma/client';
import { prisma, isDatabaseAvailable } from '../../config/db.js';
import { contactService } from '../contacts/contact.service.js';
import { productService } from '../products/product.service.js';
import { accountingService } from '../accounting/accounting.service.js';
import { NotFoundError, BadRequestError, ForbiddenError } from '../../utils/errors.js';
import { logger } from '../../utils/logger.js';
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

function mapPrismaBillToRecord(b: any): BillRecord {
  let displayStatus: 'DRAFT' | 'POSTED' | 'PAID' | 'OVERDUE' | 'CANCELLED' = 'POSTED';
  if (b.status === 'DRAFT') {
    displayStatus = 'DRAFT';
  } else if (b.status === 'CANCELLED') {
    displayStatus = 'CANCELLED';
  } else if (b.paymentStatus === 'PAID' || Number(b.outstandingAmount) <= 0.01) {
    displayStatus = 'PAID';
  } else if (new Date() > new Date(b.dueDate)) {
    displayStatus = 'OVERDUE';
  } else {
    displayStatus = 'POSTED';
  }

  return {
    id: b.id,
    billNumber: b.reference,
    vendorId: b.vendorId,
    vendorName: b.vendor?.name || 'Vendor',
    vendorEmail: b.vendor?.email || undefined,
    purchaseOrderId: b.purchaseOrderId || undefined,
    billDate: b.billDate instanceof Date ? b.billDate.toISOString().split('T')[0] : String(b.billDate).split('T')[0],
    dueDate: b.dueDate instanceof Date ? b.dueDate.toISOString().split('T')[0] : String(b.dueDate).split('T')[0],
    status: displayStatus,
    lines: (b.lines || []).map((l: any) => ({
      id: l.id,
      productId: l.productId,
      productName: l.product?.name || l.description || 'Product',
      quantity: Number(l.quantity),
      unitPrice: Number(l.unitPrice),
      subtotal: Number(l.lineSubtotal),
      tax: Number(l.lineTax),
      total: Number(l.lineTotal),
    })),
    subtotal: Number(b.subtotal),
    taxTotal: Number(b.taxAmount),
    grandTotal: Number(b.totalAmount),
    amountPaid: Number(b.paidAmount || 0),
    balanceDue: Number(b.outstandingAmount),
    journalEntryId: b.journalEntryId || undefined,
    createdAt: b.createdAt,
  };
}

export class BillService {
  public async listBills(
    query: ListBillsQuery,
    user?: AuthUserPayload
  ): Promise<{ items: BillRecord[]; total: number }> {
    const { page, limit, search, status, vendorId } = query;

    if (isDatabaseAvailable()) {
      try {
        const where: any = {};

        if (user && user.role === 'CONTACT') {
          where.OR = [
            { vendorId: user.userId },
            { vendor: { email: { equals: user.email, mode: 'insensitive' } } },
          ];
        } else if (vendorId) {
          where.vendorId = vendorId;
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
            { vendor: { name: { contains: search, mode: 'insensitive' } } },
          ];
        }

        const [items, total] = await Promise.all([
          prisma.bill.findMany({
            where,
            include: {
              vendor: true,
              lines: { include: { product: true } },
            },
            skip: (page - 1) * limit,
            take: limit,
            orderBy: { billDate: 'desc' },
          }),
          prisma.bill.count({ where }),
        ]);

        return {
          items: items.map(mapPrismaBillToRecord),
          total,
        };
      } catch (err) {
        logger.warn('Failed to query bills from Prisma, falling back to memory', err);
      }
    }

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
    if (isDatabaseAvailable()) {
      try {
        const bill = await prisma.bill.findFirst({
          where: {
            OR: [
              { id },
              { reference: { equals: id, mode: 'insensitive' } },
            ],
          },
          include: {
            vendor: true,
            lines: { include: { product: true } },
          },
        });

        if (bill) {
          if (user && user.role === 'CONTACT') {
            const isOwner =
              bill.vendorId === user.userId ||
              (user.email && bill.vendor?.email?.toLowerCase() === user.email.toLowerCase());
            if (!isOwner) {
              throw new ForbiddenError('You do not have permission to view this vendor bill');
            }
          }
          return mapPrismaBillToRecord(bill);
        }
      } catch (err) {
        if (err instanceof ForbiddenError) throw err;
        logger.warn('Failed to get bill from Prisma, falling back to memory', err);
      }
    }

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

    if (isDatabaseAvailable()) {
      try {
        const createdBill = await prisma.bill.create({
          data: {
            reference: billNumber,
            vendorId: vendor.id,
            purchaseOrderId: input.purchaseOrderId || undefined,
            journalEntryId: entry.id,
            billDate: new Date(billDate),
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
          include: { vendor: true, lines: { include: { product: true } } },
        });

        const mapped = mapPrismaBillToRecord(createdBill);
        memoryBills.set(createdBill.id, mapped);
        return mapped;
      } catch (err) {
        logger.warn('Failed to persist bill to Prisma, falling back to memory', err);
      }
    }

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
    if (amount <= 0) throw new BadRequestError('Payment amount must be greater than 0');

    if (isDatabaseAvailable()) {
      try {
        const bill = await prisma.bill.findFirst({
          where: { OR: [{ id: billId }, { reference: { equals: billId, mode: 'insensitive' } }] },
          include: { vendor: true, lines: { include: { product: true } } },
        });

        if (bill) {
          const balanceDue = Number(bill.outstandingAmount);
          if (amount > balanceDue + 0.01) {
            throw new BadRequestError(
              `Payment (₹${amount.toLocaleString('en-IN')}) exceeds remaining balance (₹${balanceDue.toLocaleString('en-IN')}).`
            );
          }

          const newPaid = Number((Number(bill.paidAmount) + amount).toFixed(2));
          const newBalance = Math.max(0, Number((Number(bill.totalAmount) - newPaid).toFixed(2)));
          const newStatus = newBalance <= 0.01 ? 'PAID' : 'PARTIALLY_PAID';

          const updated = await prisma.bill.update({
            where: { id: bill.id },
            data: {
              paidAmount: new Prisma.Decimal(newPaid),
              outstandingAmount: new Prisma.Decimal(newBalance),
              paymentStatus: newStatus,
            },
            include: { vendor: true, lines: { include: { product: true } } },
          });

          const mapped = mapPrismaBillToRecord(updated);
          memoryBills.set(updated.id, mapped);
          return mapped;
        }
      } catch (err) {
        if (err instanceof BadRequestError) throw err;
        logger.warn('Failed to settle bill in Prisma, falling back to memory', err);
      }
    }

    const bill = memoryBills.get(billId);
    if (!bill) throw new NotFoundError('Vendor bill not found');

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
