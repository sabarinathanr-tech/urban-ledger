import apiClient from '@/lib/axios';

export interface ProductData {
  id: string;
  name: string;
  type: 'GOODS' | 'SERVICE' | 'COMBO';
  salesPrice: number;
  purchasePrice: number;
  category: string;
  isActive: boolean;
}

export async function fetchProducts(params?: { search?: string; category?: string; isActive?: string }) {
  const res = await apiClient.get<{ success: boolean; data: { items: ProductData[]; total: number } }>(
    '/products',
    { params }
  );
  return res.data.data;
}

export async function fetchProductById(id: string) {
  const res = await apiClient.get<{ success: boolean; data: ProductData }>(`/products/${id}`);
  return res.data.data;
}

export async function createProduct(data: Partial<ProductData>) {
  const res = await apiClient.post<{ success: boolean; data: ProductData }>('/products', data);
  return res.data.data;
}

export async function updateProduct(id: string, data: Partial<ProductData>) {
  const res = await apiClient.put<{ success: boolean; data: ProductData }>(`/products/${id}`, data);
  return res.data.data;
}

export async function deleteProduct(id: string) {
  const res = await apiClient.delete<{ success: boolean; data: ProductData }>(`/products/${id}`);
  return res.data.data;
}
