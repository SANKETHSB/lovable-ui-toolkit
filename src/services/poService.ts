import api from './api';
import type { PurchaseOrder } from '@/types';

export const poService = {
  generatePO: (rfqId: number, deliveryDate: string) => api.post('/purchase-orders', { rfqId, deliveryDate }),
  getPOs: (params?: Record<string, string>) => api.get('/purchase-orders', { params }),
  getPOById: (id: number) => api.get<PurchaseOrder>(`/purchase-orders/${id}`),
  downloadPDF: (id: number) => api.get(`/purchase-orders/${id}/pdf`, { responseType: 'blob' }),
};
