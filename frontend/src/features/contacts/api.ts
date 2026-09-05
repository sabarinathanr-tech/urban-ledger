import apiClient from '@/lib/axios';

export interface ContactData {
  id: string;
  name: string;
  type: 'CUSTOMER' | 'VENDOR' | 'BOTH';
  email?: string;
  mobile?: string;
  city?: string;
  state?: string;
  pincode?: string;
  isActive: boolean;
}

export async function fetchContacts(params?: { search?: string; type?: string; isActive?: string }) {
  const res = await apiClient.get<{ success: boolean; data: { items: ContactData[]; total: number } }>(
    '/contacts',
    { params }
  );
  return res.data.data;
}

export async function fetchContactById(id: string) {
  const res = await apiClient.get<{ success: boolean; data: ContactData }>(`/contacts/${id}`);
  return res.data.data;
}

export async function createContact(data: Partial<ContactData>) {
  const res = await apiClient.post<{ success: boolean; data: ContactData }>('/contacts', data);
  return res.data.data;
}

export async function updateContact(id: string, data: Partial<ContactData>) {
  const res = await apiClient.put<{ success: boolean; data: ContactData }>(`/contacts/${id}`, data);
  return res.data.data;
}

export async function deleteContact(id: string) {
  const res = await apiClient.delete<{ success: boolean; data: ContactData }>(`/contacts/${id}`);
  return res.data.data;
}
