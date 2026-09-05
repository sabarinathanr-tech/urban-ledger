import apiClient from '@/lib/axios';
import type { BillData } from '../bills/api';

export interface PurchaseOrderData {
  id: string;
  orderNumber: string;
  vendorId: string;
  vendorName: string;
  orderDate: string;
  status: 'DRAFT' | 'CONFIRMED' | 'BILLED' | 'CANCELLED';
  subtotal: number;
  taxTotal: number;
  grandTotal: number;
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
  billId?: string;
}

export async function fetchPurchaseOrders(params?: { search?: string; status?: string }) {
  const res = await apiClient.get<{ success: boolean; data: { items: PurchaseOrderData[]; total: number } }>(
    '/purchases',
    { params }
  );
  return res.data.data;
}

export async function fetchPurchaseOrderById(id: string) {
  const res = await apiClient.get<{ success: boolean; data: PurchaseOrderData }>(`/purchases/${id}`);
  return res.data.data;
}

export async function createPurchaseOrder(data: {
  vendorId: string;
  orderDate?: string;
  lines: Array<{ productId: string; quantity: number; unitPrice?: number }>;
}) {
  const res = await apiClient.post<{ success: boolean; data: PurchaseOrderData }>('/purchases', data);
  return res.data.data;
}

export async function confirmPurchaseOrder(id: string) {
  const res = await apiClient.post<{ success: boolean; data: PurchaseOrderData }>(`/purchases/${id}/confirm`);
  return res.data.data;
}

export async function billPurchaseOrder(id: string) {
  const res = await apiClient.post<{ success: boolean; data: { order: PurchaseOrderData; bill: BillData } }>(
    `/purchases/${id}/bill`
  );
  return res.data.data;
}
