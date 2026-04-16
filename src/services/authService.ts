import api from './api';
import type { LoginRequest, LoginResponse } from '@/types';

export const authService = {
  login: (data: LoginRequest) => api.post<LoginResponse>('/auth/login', data),
  refreshToken: () => api.post('/auth/refresh'),
  logout: () => api.post('/auth/logout'),
  resetPassword: (email: string) => api.post('/auth/password-reset/request', { email }),
  confirmReset: (token: string, newPassword: string) => api.post('/auth/password-reset/confirm', { token, newPassword }),
};
