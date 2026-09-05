import apiClient from '@/lib/axios';

export interface BillData {
  id: string;
  billNumber: string;
  vendorId: string;
  vendorName: string;
  vendorEmail?: string;
  billDate: string;
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

export async function fetchBills(params?: { search?: string; status?: string }) {
  const res = await apiClient.get<{ success: boolean; data: { items: BillData[]; total: number } }>(
    '/bills',
    { params }
  );
  return res.data.data;
}

export async function fetchBillById(id: string) {
  const res = await apiClient.get<{ success: boolean; data: BillData }>(`/bills/${id}`);
  return res.data.data;
}

export async function createBill(data: {
  vendorId: string;
  billDate?: string;
  dueDate?: string;
  lines: Array<{ productId: string; quantity: number; unitPrice?: number }>;
}) {
  const res = await apiClient.post<{ success: boolean; data: BillData }>('/bills', data);
  return res.data.data;
}
