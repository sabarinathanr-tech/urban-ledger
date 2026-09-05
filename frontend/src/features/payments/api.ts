import apiClient from '@/lib/axios';

export interface PaymentData {
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
}

export async function fetchPayments(params?: { search?: string; type?: string; method?: string }) {
  const res = await apiClient.get<{ success: boolean; data: { items: PaymentData[]; total: number } }>(
    '/payments',
    { params }
  );
  return res.data.data;
}

export async function fetchPaymentById(id: string) {
  const res = await apiClient.get<{ success: boolean; data: PaymentData }>(`/payments/${id}`);
  return res.data.data;
}

export async function createPayment(data: {
  type: 'CUSTOMER_PAYMENT' | 'VENDOR_PAYMENT';
  contactId: string;
  amount: number;
  method: 'CASH' | 'BANK';
  paymentDate?: string;
  invoiceId?: string;
  billId?: string;
  referenceDoc?: string;
}) {
  const res = await apiClient.post<{ success: boolean; data: PaymentData }>('/payments', data);
  return res.data.data;
}
