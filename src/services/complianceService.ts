import api from './api';

export const complianceService = {
  uploadDocument: (vendorId: number, file: File, meta: Record<string, string>) => {
    const fd = new FormData();
    fd.append('file', file);
    Object.entries(meta).forEach(([k, v]) => fd.append(k, v));
    return api.post(`/vendors/${vendorId}/documents`, fd, { headers: { 'Content-Type': 'multipart/form-data' } });
  },
  getDocuments: (vendorId: number) => api.get(`/vendors/${vendorId}/documents`),
  checkExpiry: () => api.get('/compliance/expiry-check'),
};
