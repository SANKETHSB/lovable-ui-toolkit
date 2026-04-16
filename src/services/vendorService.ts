import api from './api';
import type { Vendor, PagedResponse } from '@/types';

export const vendorService = {
  registerVendor: (data: Partial<Vendor>) => api.post('/vendors/register', data),
  getVendors: (params?: Record<string, string>) => api.get<PagedResponse<Vendor>>('/vendors', { params }),
  getVendorById: (id: number) => api.get<Vendor>(`/vendors/${id}`),
  approveVendor: (id: number) => api.put(`/vendors/${id}/approve`),
  rejectVendor: (id: number, reason: string) => api.put(`/vendors/${id}/reject`, { reason }),
};
