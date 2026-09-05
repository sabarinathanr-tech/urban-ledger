import { contactService } from '../contacts/contact.service.js';
import { invoiceService } from '../invoices/invoice.service.js';
import { billService } from '../bills/bill.service.js';
import { accountingService } from '../accounting/accounting.service.js';
import { NotFoundError, BadRequestError, ForbiddenError } from '../../utils/errors.js';
import type { CreatePaymentInput, ListPaymentsQuery } from './payment.schema.js';
import type { AuthUserPayload } from '../../middleware/auth.middleware.js';

export interface PaymentRecord {
  id: string;
  paymentNumber: string;
  type: 'CUSTOMER_PAYMENT' | 'VENDOR_PAYMENT';
  contactId: string;
  contactName: string;
  contactEmail?: string;
  amount: number;
  method: 'CASH' | 'BANK';
  paymentDate: string;
  invoiceId?: string;
  billId?: string;
  referenceDoc?: string;
  journalEntryId?: string;
  status: 'COMPLETED';
  createdAt: Date;
}

const memoryPayments = new Map<string, PaymentRecord>();

// Seed canonical payment (PAY-2026-0031)
const seedPayment: PaymentRecord = {
  id: 'pay_seed_001',
  paymentNumber: 'PAY-2026-0031',
  type: 'CUSTOMER_PAYMENT',
  contactId: 'c1111111-1111-1111-1111-111111111111', // Nimesh Pathak
  contactName: 'Nimesh Pathak',
  contactEmail: 'nimesh@pathak.com',
  amount: 45000,
  method: 'BANK',
  paymentDate: '2026-09-03',
  invoiceId: 'inv_seed_001',
  referenceDoc: 'INV-2026-0042',
  journalEntryId: 'ent_seed_002',
  status: 'COMPLETED',
  createdAt: new Date('2026-09-03T11:30:00Z'),
};

memoryPayments.set(seedPayment.id, seedPayment);

let paymentCounter = 32;

export class PaymentService {
  public async listPayments(
    query: ListPaymentsQuery,
    user?: AuthUserPayload
  ): Promise<{ items: PaymentRecord[]; total: number }> {
    const { page, limit, search, type, method, contactId } = query;

    let all = Array.from(memoryPayments.values());

    if (user && user.role === 'CONTACT') {
      all = all.filter(
        (p) =>
          p.contactId === user.userId ||
          (user.email && p.contactEmail?.toLowerCase() === user.email.toLowerCase()) ||
          p.contactName.toLowerCase().includes(user.name ? user.name.toLowerCase() : '')
      );
    } else if (contactId) {
      all = all.filter((p) => p.contactId === contactId);
    }

    if (type) all = all.filter((p) => p.type === type);
    if (method) all = all.filter((p) => p.method === method);
    if (search) {
      const s = search.toLowerCase();
      all = all.filter(
        (p) =>
          p.paymentNumber.toLowerCase().includes(s) ||
          p.contactName.toLowerCase().includes(s) ||
          (p.referenceDoc && p.referenceDoc.toLowerCase().includes(s))
      );
    }

    const total = all.length;
    const start = (page - 1) * limit;
    const items = all
      .sort((a, b) => new Date(b.paymentDate).getTime() - new Date(a.paymentDate).getTime())
      .slice(start, start + limit);

    return { items, total };
  }

  public async getPaymentById(id: string, user?: AuthUserPayload): Promise<PaymentRecord> {
    const payment = memoryPayments.get(id);
    if (!payment) {
      throw new NotFoundError('Payment record not found');
    }

    if (user && user.role === 'CONTACT') {
      const isOwner =
        payment.contactId === user.userId ||
        (user.email && payment.contactEmail?.toLowerCase() === user.email.toLowerCase());
      if (!isOwner) {
        throw new ForbiddenError('You do not have permission to view this payment voucher');
      }
    }

    return payment;
  }

  public async createPayment(
    input: CreatePaymentInput,
    user?: AuthUserPayload
  ): Promise<PaymentRecord> {
    const contact = await contactService.getContactById(input.contactId);

    // If caller is CONTACT, verify they are settling their own document
    if (user && user.role === 'CONTACT') {
      const isOwner =
        contact.id === user.userId ||
        (user.email && contact.email?.toLowerCase() === user.email.toLowerCase());
      if (!isOwner) {
        throw new ForbiddenError('You can only submit payments for your own account');
      }
    }

    let referenceDoc = input.referenceDoc;

    // Settle against Customer Invoice
    if (input.invoiceId) {
      const invoice = await invoiceService.getInvoiceById(input.invoiceId);
      if (input.amount > invoice.balanceDue + 0.01) {
        throw new BadRequestError(
          `Payment amount (₹${input.amount.toLocaleString('en-IN')}) exceeds invoice balance (₹${invoice.balanceDue.toLocaleString('en-IN')}).`
        );
      }
      await invoiceService.recordPaymentSettlement(input.invoiceId, input.amount);
      referenceDoc = invoice.invoiceNumber;
    }

    // Settle against Vendor Bill
    if (input.billId) {
      const bill = await billService.getBillById(input.billId);
      if (input.amount > bill.balanceDue + 0.01) {
        throw new BadRequestError(
          `Payment amount (₹${input.amount.toLocaleString('en-IN')}) exceeds bill balance (₹${bill.balanceDue.toLocaleString('en-IN')}).`
        );
      }
      await billService.recordPaymentSettlement(input.billId, input.amount);
      referenceDoc = bill.billNumber;
    }

    const paymentNumber = `PAY-2026-${String(paymentCounter++).padStart(4, '0')}`;
    const id = `pay_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    const paymentDate = input.paymentDate || new Date().toISOString().split('T')[0];

    // Automatically post balanced Double-Entry journal entry (Bank/Cash)
    const entry = await accountingService.createPaymentEntry({
      id,
      paymentNumber,
      type: input.type,
      contactName: contact.name,
      amount: input.amount,
      method: input.method,
      paymentDate,
      referenceDoc,
    });

    const newPayment: PaymentRecord = {
      id,
      paymentNumber,
      type: input.type,
      contactId: contact.id,
      contactName: contact.name,
      contactEmail: contact.email || undefined,
      amount: input.amount,
      method: input.method,
      paymentDate,
      invoiceId: input.invoiceId,
      billId: input.billId,
      referenceDoc,
      journalEntryId: entry.reference,
      status: 'COMPLETED',
      createdAt: new Date(),
    };

    memoryPayments.set(id, newPayment);
    return newPayment;
  }
}

export const paymentService = new PaymentService();
export { memoryPayments };
