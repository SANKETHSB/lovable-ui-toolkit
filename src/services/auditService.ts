import api from './api';

export const auditService = {
  getLogs: (params?: Record<string, string>) => api.get('/audit-logs', { params }),
  exportLogs: (params?: Record<string, string>) => api.get('/audit-logs/export', { params, responseType: 'blob' }),
};
