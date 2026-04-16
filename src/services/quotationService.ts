import api from './api';
import type { Quotation } from '@/types';

export const quotationService = {
  submitQuotation: (rfqId: number, data: Partial<Quotation>) => api.post(`/rfqs/${rfqId}/quotations`, data),
  updateQuotation: (rfqId: number, qId: number, data: Partial<Quotation>) => api.put(`/rfqs/${rfqId}/quotations/${qId}`, data),
  getQuotations: (rfqId: number) => api.get(`/rfqs/${rfqId}/quotations`),
  getComparison: (rfqId: number) => api.get(`/rfqs/${rfqId}/quotations/comparison`),
  exportComparison: (rfqId: number) => api.get(`/rfqs/${rfqId}/quotations/export`, { responseType: 'blob' }),
};
