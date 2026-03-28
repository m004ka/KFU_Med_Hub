import apiClient from './client'
import type { Page } from './datasets'

export interface AuditLog {
  id: string
  userId: string
  userName: string
  action: string
  entityType: string
  entityId: string
  details: string
  ipAddress: string
  createdAt: string
}

export const auditApi = {
  list: (params?: {
    page?: number
    size?: number
    userId?: string
    action?: string
    entityType?: string
    entityId?: string
    from?: string
    to?: string
  }) => apiClient.get<Page<AuditLog>>('/audit', { params }).then((r) => r.data),
}
