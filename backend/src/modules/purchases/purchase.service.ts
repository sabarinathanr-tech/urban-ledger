import { contactService } from '../contacts/contact.service.js';
import { productService } from '../products/product.service.js';
import { billService } from '../bills/bill.service.js';
import { NotFoundError, BadRequestError } from '../../utils/errors.js';
import type { CreatePurchaseOrderInput, ListPurchaseOrdersQuery } from './purchase.schema.js';

export interface PurchaseOrderLineRecord {
  id: string;
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
  tax: number;
  total: number;
}

export interface PurchaseOrderRecord {
  id: string;
  orderNumber: string;
  vendorId: string;
  vendorName: string;
  orderDate: string;
  status: 'DRAFT' | 'CONFIRMED' | 'BILLED' | 'CANCELLED';
  lines: PurchaseOrderLineRecord[];
  subtotal: number;
  taxTotal: number;
  grandTotal: number;
  billId?: string;
  createdAt: Date;
}

const memoryPurchaseOrders = new Map<string, PurchaseOrderRecord>();

// Seed canonical purchase order (PO-2026-0001)
const seedPurchaseOrder: PurchaseOrderRecord = {
  id: 'po_seed_001',
  orderNumber: 'PO-2026-0001',
  vendorId: 'c2222222-2222-2222-2222-222222222222', // Azure Furniture
  vendorName: 'Azure Furniture',
  orderDate: '2026-09-02',
  status: 'BILLED',
  lines: [
    {
      id: 'pol_001',
      productId: 'p2222222-2222-2222-2222-222222222222',
      productName: 'Wooden Table',
      quantity: 5,
      unitPrice: 7500,
      subtotal: 37500,
      tax: 6750,
      total: 44250,
    },
    {
      id: 'pol_002',
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
  billId: 'bill_seed_001',
  createdAt: new Date('2026-09-02T10:00:00Z'),
};

memoryPurchaseOrders.set(seedPurchaseOrder.id, seedPurchaseOrder);

let poCounter = 2;

export class PurchaseService {
  public async listPurchaseOrders(
    query: ListPurchaseOrdersQuery
  ): Promise<{ items: PurchaseOrderRecord[]; total: number }> {
    const { page, limit, search, status, vendorId } = query;

    let all = Array.from(memoryPurchaseOrders.values());
    if (status) all = all.filter((o) => o.status === status);
    if (vendorId) all = all.filter((o) => o.vendorId === vendorId);
    if (search) {
      const s = search.toLowerCase();
      all = all.filter(
        (o) =>
          o.orderNumber.toLowerCase().includes(s) ||
          o.vendorName.toLowerCase().includes(s)
      );
    }

    const total = all.length;
    const start = (page - 1) * limit;
    const items = all
      .sort((a, b) => new Date(b.orderDate).getTime() - new Date(a.orderDate).getTime())
      .slice(start, start + limit);

    return { items, total };
  }

  public async getPurchaseOrderById(id: string): Promise<PurchaseOrderRecord> {
    const order = memoryPurchaseOrders.get(id);
    if (!order) {
      throw new NotFoundError('Purchase order not found');
    }
    return order;
  }

  public async createPurchaseOrder(
    input: CreatePurchaseOrderInput
  ): Promise<PurchaseOrderRecord> {
    const vendor = await contactService.getContactById(input.vendorId);

    let subtotal = 0;
    let taxTotal = 0;

    const lines: PurchaseOrderLineRecord[] = [];
    for (let i = 0; i < input.lines.length; i++) {
      const item = input.lines[i];
      const product = await productService.getProductById(item.productId);
      const unitPrice =
        item.unitPrice !== undefined ? item.unitPrice : product.purchasePrice;
      const lineSubtotal = Number((unitPrice * item.quantity).toFixed(2));
      const lineTax = Number((lineSubtotal * 0.18).toFixed(2));
      const lineTotal = Number((lineSubtotal + lineTax).toFixed(2));

      subtotal += lineSubtotal;
      taxTotal += lineTax;

      lines.push({
        id: `pol_${Date.now()}_${i}`,
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
    const orderNumber = `PO-2026-${String(poCounter++).padStart(4, '0')}`;
    const id = `po_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    const orderDate = input.orderDate || new Date().toISOString().split('T')[0];

    const newOrder: PurchaseOrderRecord = {
      id,
      orderNumber,
      vendorId: vendor.id,
      vendorName: vendor.name,
      orderDate,
      status: 'CONFIRMED',
      lines,
      subtotal: Number(subtotal.toFixed(2)),
      taxTotal: Number(taxTotal.toFixed(2)),
      grandTotal,
      createdAt: new Date(),
    };

    memoryPurchaseOrders.set(id, newOrder);
    return newOrder;
  }

  public async confirmPurchaseOrder(id: string): Promise<PurchaseOrderRecord> {
    const order = await this.getPurchaseOrderById(id);
    if (order.status === 'CANCELLED') {
      throw new BadRequestError('Cannot confirm a cancelled purchase order');
    }
    order.status = 'CONFIRMED';
    memoryPurchaseOrders.set(id, order);
    return order;
  }

  public async billPurchaseOrder(
    id: string
  ): Promise<{ order: PurchaseOrderRecord; bill: any }> {
    const order = await this.getPurchaseOrderById(id);
    if (order.status === 'BILLED') {
      throw new BadRequestError('Purchase order is already billed');
    }
    if (order.status === 'CANCELLED') {
      throw new BadRequestError('Cannot bill a cancelled purchase order');
    }

    const bill = await billService.createBill({
      vendorId: order.vendorId,
      purchaseOrderId: order.id,
      billDate: new Date().toISOString().split('T')[0],
      lines: order.lines.map((l) => ({
        productId: l.productId,
        quantity: l.quantity,
        unitPrice: l.unitPrice,
      })),
    });

    order.status = 'BILLED';
    order.billId = bill.id;
    memoryPurchaseOrders.set(id, order);

    return { order, bill };
  }
}

export const purchaseService = new PurchaseService();
export { memoryPurchaseOrders };
