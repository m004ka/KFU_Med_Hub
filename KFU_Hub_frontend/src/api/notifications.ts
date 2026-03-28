import apiClient from './client'
import type { Page } from './datasets'

export type NotificationType = 'SYSTEM' | 'DATASET' | 'PROJECT' | 'TASK' | 'AI_TASK' | 'INTEGRATION'

export interface Notification {
  id: string
  userId: string
  type: NotificationType
  title: string
  message: string
  link: string
  isRead: boolean
  createdAt: string
}

export const notificationsApi = {
  list: (params?: { page?: number; size?: number; isRead?: boolean }) =>
    apiClient.get<Page<Notification>>('/notifications', { params }).then((r) => r.data),

  getUnreadCount: () =>
    apiClient.get<{ count: number }>('/notifications/unread-count').then((r) => r.data),

  markRead: (id: string) =>
    apiClient.put<Notification>(`/notifications/${id}/read`).then((r) => r.data),

  markAllRead: () => apiClient.put('/notifications/read-all'),

  delete: (id: string) => apiClient.delete(`/notifications/${id}`),
}
