import apiClient from './client'
import type { Page } from './datasets'

export type SystemType = 'FHIR' | 'HL7' | 'DICOM' | 'CSV' | 'REST_API' | 'DATABASE'
export type SyncStatus = 'PENDING' | 'RUNNING' | 'COMPLETED' | 'FAILED'

export interface ExternalSystem {
  id: string
  name: string
  type: SystemType
  baseUrl: string
  description: string
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface SyncJob {
  id: string
  systemId: string
  systemName: string
  status: SyncStatus
  recordsProcessed: number
  errorMessage: string
  startedAt: string
  completedAt: string
}

export const integrationApi = {
  listSystems: (params?: { page?: number; size?: number }) =>
    apiClient.get<Page<ExternalSystem>>('/integration/systems', { params }).then((r) => r.data),

  getSystem: (id: string) =>
    apiClient.get<ExternalSystem>(`/integration/systems/${id}`).then((r) => r.data),

  createSystem: (data: Omit<ExternalSystem, 'id' | 'createdAt' | 'updatedAt'>) =>
    apiClient.post<ExternalSystem>('/integration/systems', data).then((r) => r.data),

  updateSystem: (id: string, data: Partial<ExternalSystem>) =>
    apiClient.put<ExternalSystem>(`/integration/systems/${id}`, data).then((r) => r.data),

  deleteSystem: (id: string) => apiClient.delete(`/integration/systems/${id}`),

  triggerSync: (id: string) =>
    apiClient.post<SyncJob>(`/integration/systems/${id}/sync`).then((r) => r.data),

  getSyncJobs: (id: string) =>
    apiClient.get<SyncJob[]>(`/integration/systems/${id}/jobs`).then((r) => r.data),
}
