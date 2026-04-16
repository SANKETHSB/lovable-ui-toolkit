import api from './api';
import type { User, PagedResponse } from '@/types';

export const userService = {
  getUsers: (params?: Record<string, string>) => api.get<PagedResponse<User>>('/users', { params }),
  getUserById: (id: number) => api.get<User>(`/users/${id}`),
  createUser: (data: Partial<User>) => api.post('/users', data),
  updateUser: (id: number, data: Partial<User>) => api.put(`/users/${id}`, data),
  lockUser: (id: number) => api.put(`/users/${id}/lock`),
  assignRoles: (id: number, roles: string[]) => api.put(`/users/${id}/roles`, { roles }),
};
