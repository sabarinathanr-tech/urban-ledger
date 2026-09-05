import apiClient from '@/lib/axios';
import type { InvoiceData } from '../invoices/api';

export interface SalesOrderData {
  id: string;
  orderNumber: string;
  customerId: string;
  customerName: string;
  orderDate: string;
  status: 'DRAFT' | 'CONFIRMED' | 'INVOICED' | 'CANCELLED';
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
  invoiceId?: string;
}

export async function fetchSalesOrders(params?: { search?: string; status?: string }) {
  const res = await apiClient.get<{ success: boolean; data: { items: SalesOrderData[]; total: number } }>(
    '/sales',
    { params }
  );
  return res.data.data;
}

export async function fetchSalesOrderById(id: string) {
  const res = await apiClient.get<{ success: boolean; data: SalesOrderData }>(`/sales/${id}`);
  return res.data.data;
}

export async function createSalesOrder(data: {
  customerId: string;
  orderDate?: string;
  lines: Array<{ productId: string; quantity: number; unitPrice?: number }>;
}) {
  const res = await apiClient.post<{ success: boolean; data: SalesOrderData }>('/sales', data);
  return res.data.data;
}

export async function confirmSalesOrder(id: string) {
  const res = await apiClient.post<{ success: boolean; data: SalesOrderData }>(`/sales/${id}/confirm`);
  return res.data.data;
}

export async function invoiceSalesOrder(id: string) {
  const res = await apiClient.post<{ success: boolean; data: { order: SalesOrderData; invoice: InvoiceData } }>(
    `/sales/${id}/invoice`
  );
  return res.data.data;
}
