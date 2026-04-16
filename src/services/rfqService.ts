import api from './api';
import type { RFQ, PagedResponse } from '@/types';

export const rfqService = {
  createRFQ: (data: Partial<RFQ>) => api.post('/rfqs', data),
  getRFQs: (params?: Record<string, string>) => api.get<PagedResponse<RFQ>>('/rfqs', { params }),
  getRFQById: (id: number) => api.get<RFQ>(`/rfqs/${id}`),
  updateRFQ: (id: number, data: Partial<RFQ>) => api.put(`/rfqs/${id}`, data),
  closeRFQ: (id: number) => api.put(`/rfqs/${id}/close`),
  getRevisions: (id: number) => api.get(`/rfqs/${id}/revisions`),
};
