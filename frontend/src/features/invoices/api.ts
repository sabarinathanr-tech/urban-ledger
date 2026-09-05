import apiClient from '@/lib/axios';

export interface InvoiceData {
  id: string;
  invoiceNumber: string;
  customerId: string;
  customerName: string;
  customerEmail?: string;
  issueDate: string;
  dueDate: string;
  status: 'DRAFT' | 'POSTED' | 'PAID' | 'OVERDUE' | 'CANCELLED';
  subtotal: number;
  taxTotal: number;
  grandTotal: number;
  amountPaid: number;
  balanceDue: number;
  lines: Array<{
    id: string;
    productId: string;
    productName: string;
    quantity: number;
    unitPrice: number;
    subtotal: number;
    tax: number;
    total: number;
  }>;
  journalEntryId?: string;
}

export async function fetchInvoices(params?: { search?: string; status?: string }) {
  const res = await apiClient.get<{ success: boolean; data: { items: InvoiceData[]; total: number } }>(
    '/invoices',
    { params }
  );
  return res.data.data;
}

export async function fetchInvoiceById(id: string) {
  const res = await apiClient.get<{ success: boolean; data: InvoiceData }>(`/invoices/${id}`);
  return res.data.data;
}

export async function createInvoice(data: {
  customerId: string;
  issueDate?: string;
  dueDate?: string;
  lines: Array<{ productId: string; quantity: number; unitPrice?: number }>;
}) {
  const res = await apiClient.post<{ success: boolean; data: InvoiceData }>('/invoices', data);
  return res.data.data;
}
