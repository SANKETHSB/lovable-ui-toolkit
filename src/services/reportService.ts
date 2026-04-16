import api from './api';

export const reportService = {
  getVendorAnalytics: (vendorId: number) => api.get(`/reports/vendor-analytics/${vendorId}`),
  getRFQComparison: (rfqId: number) => api.get(`/reports/rfq-comparison/${rfqId}`, { responseType: 'blob' }),
  getSpendReport: (params?: Record<string, string>) => api.get('/reports/spend', { params }),
};
