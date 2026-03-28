import apiClient from './client'

export type DatasetStatus = 'DRAFT' | 'PUBLISHED' | 'ARCHIVED'
export type DatasetType = 'CLINICAL' | 'GENOMIC' | 'IMAGING' | 'LAB' | 'OTHER'

export interface Dataset {
  id: string
  name: string
  description: string
  type: DatasetType
  status: DatasetStatus
  ownerId: string
  ownerName: string
  recordCount: number
  fileSize: number
  filePath: string
  checksum: string
  tags: string[]
  createdAt: string
  updatedAt: string
}

export interface DatasetVersion {
  id: string
  datasetId: string
  version: string
  changeLog: string
  filePath: string
  fileSize: number
  checksum: string
  createdAt: string
}

export interface Page<T> {
  content: T[]
  totalElements: number
  totalPages: number
  size: number
  number: number
}

export interface CreateDatasetRequest {
  name: string
  description: string
  type: DatasetType
  tags: string[]
}

export const datasetsApi = {
  list: (params?: { page?: number; size?: number; status?: DatasetStatus; type?: DatasetType; search?: string }) =>
    apiClient.get<Page<Dataset>>('/datasets', { params }).then((r) => r.data),

  get: (id: string) => apiClient.get<Dataset>(`/datasets/${id}`).then((r) => r.data),

  create: (data: CreateDatasetRequest) =>
    apiClient.post<Dataset>('/datasets', data).then((r) => r.data),

  update: (id: string, data: Partial<CreateDatasetRequest>) =>
    apiClient.put<Dataset>(`/datasets/${id}`, data).then((r) => r.data),

  delete: (id: string) => apiClient.delete(`/datasets/${id}`),

  publish: (id: string) =>
    apiClient.post<Dataset>(`/datasets/${id}/publish`).then((r) => r.data),

  archive: (id: string) =>
    apiClient.post<Dataset>(`/datasets/${id}/archive`).then((r) => r.data),

  upload: (id: string, file: File) => {
    const form = new FormData()
    form.append('file', file)
    return apiClient
      .post<Dataset>(`/datasets/${id}/upload`, form, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      .then((r) => r.data)
  },

  getVersions: (id: string) =>
    apiClient.get<DatasetVersion[]>(`/datasets/${id}/versions`).then((r) => r.data),

  getDownloadUrl: (id: string) =>
    apiClient.get<{ url: string }>(`/datasets/${id}/download-url`).then((r) => r.data),
}
