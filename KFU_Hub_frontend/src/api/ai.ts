import apiClient from './client'
import type { Page } from './datasets'

export type TaskType =
  | 'CLASSIFICATION'
  | 'REGRESSION'
  | 'CLUSTERING'
  | 'ANOMALY_DETECTION'
  | 'NLP'
  | 'IMAGE_ANALYSIS'
  | 'SURVIVAL_ANALYSIS'

export type TaskStatus = 'PENDING' | 'RUNNING' | 'COMPLETED' | 'FAILED' | 'CANCELLED'

export interface AnalysisTask {
  id: string
  name: string
  taskType: TaskType
  status: TaskStatus
  datasetId: string
  datasetName: string
  parameters: Record<string, unknown>
  resultPath: string
  errorMessage: string
  progress: number
  createdAt: string
  startedAt: string
  completedAt: string
}

export const aiApi = {
  list: (params?: { page?: number; size?: number; status?: TaskStatus; taskType?: TaskType }) =>
    apiClient.get<Page<AnalysisTask>>('/ai/tasks', { params }).then((r) => r.data),

  get: (id: string) => apiClient.get<AnalysisTask>(`/ai/tasks/${id}`).then((r) => r.data),

  create: (data: {
    name: string
    taskType: TaskType
    datasetId: string
    parameters?: Record<string, unknown>
  }) => apiClient.post<AnalysisTask>('/ai/tasks', data).then((r) => r.data),

  cancel: (id: string) =>
    apiClient.post<AnalysisTask>(`/ai/tasks/${id}/cancel`).then((r) => r.data),

  getStreamUrl: (id: string) => `/api/v1/ai/tasks/${id}/stream`,
}
