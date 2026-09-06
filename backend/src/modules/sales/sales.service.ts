import { Prisma } from '@prisma/client';
import { prisma, isDatabaseAvailable } from '../../config/db.js';
import { contactService } from '../contacts/contact.service.js';
import { productService } from '../products/product.service.js';
import { invoiceService } from '../invoices/invoice.service.js';
import { NotFoundError, BadRequestError } from '../../utils/errors.js';
import { logger } from '../../utils/logger.js';
import type { CreateSalesOrderInput, ListSalesOrdersQuery } from './sales.schema.js';

export interface SalesOrderLineRecord {
  id: string;
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
  tax: number;
  total: number;
}

export interface SalesOrderRecord {
  id: string;
  orderNumber: string;
  customerId: string;
  customerName: string;
  orderDate: string;
  status: 'DRAFT' | 'CONFIRMED' | 'INVOICED' | 'CANCELLED';
  lines: SalesOrderLineRecord[];
  subtotal: number;
  taxTotal: number;
  grandTotal: number;
  invoiceId?: string;
  createdAt: Date;
}

const memorySalesOrders = new Map<string, SalesOrderRecord>();

// Seed initial sales order
const seedSalesOrder: SalesOrderRecord = {
  id: 'so_seed_001',
  orderNumber: 'SO-2026-0001',
  customerId: 'c1111111-1111-1111-1111-111111111111', // Nimesh Pathak
  customerName: 'Nimesh Pathak',
  orderDate: '2026-09-01',
  status: 'INVOICED',
  lines: [
    {
      id: 'sol_001',
      productId: 'p1111111-1111-1111-1111-111111111111',
      productName: 'Office Chair',
      quantity: 10,
      unitPrice: 4500,
      subtotal: 45000,
      tax: 8100,
      total: 53100,
    },
    {
      id: 'sol_002',
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
  invoiceId: 'inv_seed_001',
  createdAt: new Date('2026-09-01T09:00:00Z'),
};

memorySalesOrders.set(seedSalesOrder.id, seedSalesOrder);

let orderCounter = 2;

function mapPrismaSalesOrderToRecord(so: any): SalesOrderRecord {
  return {
    id: so.id,
    orderNumber: so.reference,
    customerId: so.customerId,
    customerName: so.customer?.name || 'Customer',
    orderDate: so.orderDate instanceof Date ? so.orderDate.toISOString().split('T')[0] : String(so.orderDate).split('T')[0],
    status: so.status,
    lines: (so.lines || []).map((l: any) => ({
      id: l.id,
      productId: l.productId,
      productName: l.product?.name || 'Product',
      quantity: Number(l.quantity),
      unitPrice: Number(l.unitPrice),
      subtotal: Number(l.lineSubtotal),
      tax: Number(l.lineTax),
      total: Number(l.lineTotal),
    })),
    subtotal: Number(so.subtotal),
    taxTotal: Number(so.taxAmount),
    grandTotal: Number(so.totalAmount),
    invoiceId: so.invoices?.[0]?.id || undefined,
    createdAt: so.createdAt,
  };
}

export class SalesService {
  public async listSalesOrders(query: ListSalesOrdersQuery): Promise<{ items: SalesOrderRecord[]; total: number }> {
    const { page, limit, search, status, customerId } = query;

    if (isDatabaseAvailable()) {
      try {
        const where: any = {};
        if (status) where.status = status;
        if (customerId) where.customerId = customerId;
        if (search) {
          where.OR = [
            { reference: { contains: search, mode: 'insensitive' } },
            { customer: { name: { contains: search, mode: 'insensitive' } } },
          ];
        }

        const [items, total] = await Promise.all([
          prisma.salesOrder.findMany({
            where,
            include: { customer: true, lines: { include: { product: true } }, invoices: true },
            skip: (page - 1) * limit,
            take: limit,
            orderBy: { orderDate: 'desc' },
          }),
          prisma.salesOrder.count({ where }),
        ]);

        return { items: items.map(mapPrismaSalesOrderToRecord), total };
      } catch (err) {
        logger.warn('Failed to query sales orders from Prisma, falling back to memory', err);
      }
    }

    let all = Array.from(memorySalesOrders.values());
    if (status) all = all.filter((o) => o.status === status);
    if (customerId) all = all.filter((o) => o.customerId === customerId);
    if (search) {
      const s = search.toLowerCase();
      all = all.filter(
        (o) =>
          o.orderNumber.toLowerCase().includes(s) ||
          o.customerName.toLowerCase().includes(s)
      );
    }

    const total = all.length;
    const start = (page - 1) * limit;
    const items = all
      .sort((a, b) => new Date(b.orderDate).getTime() - new Date(a.orderDate).getTime())
      .slice(start, start + limit);

    return { items, total };
  }

  public async getSalesOrderById(id: string): Promise<SalesOrderRecord> {
    if (isDatabaseAvailable()) {
      try {
        const order = await prisma.salesOrder.findFirst({
          where: { OR: [{ id }, { reference: { equals: id, mode: 'insensitive' } }] },
          include: { customer: true, lines: { include: { product: true } }, invoices: true },
        });
        if (order) return mapPrismaSalesOrderToRecord(order);
      } catch (err) {
        logger.warn('Failed to get sales order from Prisma, falling back to memory', err);
      }
    }

    const order = memorySalesOrders.get(id);
    if (!order) {
      throw new NotFoundError('Sales order not found');
    }
    return order;
  }

  public async createSalesOrder(input: CreateSalesOrderInput): Promise<SalesOrderRecord> {
    const customer = await contactService.getContactById(input.customerId);

    let subtotal = 0;
    let taxTotal = 0;

    const lines: SalesOrderLineRecord[] = [];
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
        id: `sol_${Date.now()}_${i}`,
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
    const orderNumber = `SO-2026-${String(Date.now()).slice(-6)}-${Math.floor(100 + Math.random() * 900)}`;
    const id = `so_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    const orderDate = input.orderDate || new Date().toISOString().split('T')[0];

    const orderStatus = input.status || 'DRAFT';

    if (isDatabaseAvailable()) {
      try {
        const created = await prisma.salesOrder.create({
          data: {
            reference: orderNumber,
            customerId: customer.id,
            orderDate: new Date(orderDate),
            status: orderStatus as any,
            subtotal: new Prisma.Decimal(subtotal),
            taxAmount: new Prisma.Decimal(taxTotal),
            totalAmount: new Prisma.Decimal(grandTotal),
            lines: {
              create: lines.map((l) => ({
                productId: l.productId,
                quantity: new Prisma.Decimal(l.quantity),
                unitPrice: new Prisma.Decimal(l.unitPrice),
                taxRate: new Prisma.Decimal(18),
                lineSubtotal: new Prisma.Decimal(l.subtotal),
                lineTax: new Prisma.Decimal(l.tax),
                lineTotal: new Prisma.Decimal(l.total),
              })),
            },
          },
          include: { customer: true, lines: { include: { product: true } }, invoices: true },
        });
        const mapped = mapPrismaSalesOrderToRecord(created);
        memorySalesOrders.set(created.id, mapped);
        return mapped;
      } catch (err) {
        logger.warn('Failed to persist sales order to Prisma, falling back to memory', err);
      }
    }

    const newOrder: SalesOrderRecord = {
      id,
      orderNumber,
      customerId: customer.id,
      customerName: customer.name,
      orderDate,
      status: orderStatus as any,
      lines,
      subtotal: Number(subtotal.toFixed(2)),
      taxTotal: Number(taxTotal.toFixed(2)),
      grandTotal,
      createdAt: new Date(),
    };

    memorySalesOrders.set(id, newOrder);
    return newOrder;
  }

  public async confirmSalesOrder(id: string): Promise<SalesOrderRecord> {
    const order = await this.getSalesOrderById(id);
    if (order.status === 'CANCELLED') {
      throw new BadRequestError('Cannot confirm a cancelled sales order');
    }

    if (isDatabaseAvailable()) {
      try {
        const updated = await prisma.salesOrder.update({
          where: { id: order.id },
          data: { status: 'CONFIRMED' },
          include: { customer: true, lines: { include: { product: true } }, invoices: true },
        });
        const mapped = mapPrismaSalesOrderToRecord(updated);
        memorySalesOrders.set(updated.id, mapped);
        return mapped;
      } catch {
        // fallback
      }
    }

    order.status = 'CONFIRMED';
    memorySalesOrders.set(id, order);
    return order;
  }

  public async invoiceSalesOrder(id: string): Promise<{ order: SalesOrderRecord; invoice: any }> {
    const order = await this.getSalesOrderById(id);
    if (order.status === 'INVOICED') {
      throw new BadRequestError('Sales order is already invoiced');
    }
    if (order.status === 'CANCELLED') {
      throw new BadRequestError('Cannot invoice a cancelled sales order');
    }

    // Generate Customer Invoice with identical line items
    const invoice = await invoiceService.createInvoice({
      customerId: order.customerId,
      salesOrderId: order.id,
      issueDate: new Date().toISOString().split('T')[0],
      lines: order.lines.map((l) => ({
        productId: l.productId,
        quantity: l.quantity,
        unitPrice: l.unitPrice,
      })),
    });

    if (isDatabaseAvailable()) {
      try {
        const updated = await prisma.salesOrder.update({
          where: { id: order.id },
          data: { status: 'INVOICED' },
          include: { customer: true, lines: { include: { product: true } }, invoices: true },
        });
        const mapped = mapPrismaSalesOrderToRecord(updated);
        memorySalesOrders.set(updated.id, mapped);
        return { order: mapped, invoice };
      } catch {
        // fallback
      }
    }

    order.status = 'INVOICED';
    order.invoiceId = invoice.id;
    memorySalesOrders.set(id, order);

    return { order, invoice };
  }
}

export const salesService = new SalesService();
export { memorySalesOrders };
