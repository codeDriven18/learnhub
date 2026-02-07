import axios from 'axios';
import type { LoginRequest, LoginResponse, RegisterRequest, User } from '@/types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: `${API_URL}/api`,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor to handle token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem('refresh_token');
        if (refreshToken) {
          const response = await axios.post(`${API_URL}/api/auth/token/refresh/`, {
            refresh: refreshToken,
          });

          const { access } = response.data;
          localStorage.setItem('access_token', access);

          originalRequest.headers.Authorization = `Bearer ${access}`;
          return api(originalRequest);
        }
      } catch (refreshError) {
        // Refresh token is invalid, redirect to login
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;

// Auth API
export const authAPI = {
  login: (data: LoginRequest) => api.post<LoginResponse>('/auth/login/', data),
  register: (data: RegisterRequest) => api.post<User>('/auth/register/', data),
  getProfile: () => api.get<User>('/auth/profile/'),
  updateProfile: (data: Partial<User>) => api.patch<User>('/auth/profile/', data),
  changePassword: (oldPassword: string, newPassword: string) =>
    api.post('/auth/change-password/', { old_password: oldPassword, new_password: newPassword }),
};

// Applications API
export const applicationsAPI = {
  list: () => api.get('/applications/'),
  create: (data: any) => api.post('/applications/', data),
  get: (id: number) => api.get(`/applications/${id}/`),
  update: (id: number, data: any) => api.patch(`/applications/${id}/`, data),
  delete: (id: number) => api.delete(`/applications/${id}/`),
  submit: (id: number) => api.post(`/applications/${id}/submit/`),
  assign: (id: number, checkerId: number) =>
    api.post(`/applications/${id}/assign/`, { checker_id: checkerId }),
  updateStatus: (id: number, data: any) => api.patch(`/applications/${id}/status/`, data),
};

// Documents API
export const documentsAPI = {
  list: (applicationId?: number) =>
    api.get('/documents/', { params: { application_id: applicationId } }),
  upload: (data: FormData) =>
    api.post('/documents/', data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  get: (id: number) => api.get(`/documents/${id}/`),
  delete: (id: number) => api.delete(`/documents/${id}/`),
  verify: (id: number, status: string, notes?: string) =>
    api.post(`/documents/${id}/verify/`, { status, verification_notes: notes }),
};

// Reviews API
export const reviewsAPI = {
  list: (applicationId?: number) =>
    api.get('/reviews/', { params: { application_id: applicationId } }),
  create: (data: any) => api.post('/reviews/', data),
  get: (id: number) => api.get(`/reviews/${id}/`),
  update: (id: number, data: any) => api.patch(`/reviews/${id}/`, data),
  submit: (id: number) => api.post(`/reviews/${id}/submit/`),
};

// Notifications API
export const notificationsAPI = {
  list: (isRead?: boolean) => api.get('/notifications/', { params: { is_read: isRead } }),
  get: (id: number) => api.get(`/notifications/${id}/`),
  markRead: (ids: number[]) => api.post('/notifications/mark-read/', { notification_ids: ids }),
  markAllRead: () => api.post('/notifications/mark-all-read/'),
  unreadCount: () => api.get('/notifications/unread-count/'),
};
