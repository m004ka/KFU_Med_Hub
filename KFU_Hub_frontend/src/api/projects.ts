import apiClient from './client'
import type { Page } from './datasets'

export type ProjectStatus = 'ACTIVE' | 'COMPLETED' | 'ARCHIVED' | 'ON_HOLD'
export type MemberRole = 'OWNER' | 'ADMIN' | 'MEMBER' | 'VIEWER'
export type TaskStatus = 'TODO' | 'IN_PROGRESS' | 'REVIEW' | 'DONE' | 'CANCELLED'
export type TaskPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'

export interface Project {
  id: string
  name: string
  description: string
  status: ProjectStatus
  ownerId: string
  ownerName: string
  startDate: string
  endDate: string
  tags: string[]
  memberCount: number
  taskCount: number
  createdAt: string
  updatedAt: string
}

export interface ProjectMember {
  id: string
  projectId: string
  userId: string
  userName: string
  role: MemberRole
  joinedAt: string
}

export interface Task {
  id: string
  projectId: string
  title: string
  description: string
  status: TaskStatus
  priority: TaskPriority
  assigneeId: string
  assigneeName: string
  dueDate: string
  createdAt: string
  updatedAt: string
}

export interface TaskComment {
  id: string
  taskId: string
  authorId: string
  authorName: string
  content: string
  createdAt: string
}

export const projectsApi = {
  list: (params?: { page?: number; size?: number; status?: ProjectStatus; search?: string }) =>
    apiClient.get<Page<Project>>('/projects', { params }).then((r) => r.data),

  get: (id: string) => apiClient.get<Project>(`/projects/${id}`).then((r) => r.data),

  create: (data: { name: string; description: string; startDate?: string; endDate?: string; tags?: string[] }) =>
    apiClient.post<Project>('/projects', data).then((r) => r.data),

  update: (id: string, data: Partial<Project>) =>
    apiClient.put<Project>(`/projects/${id}`, data).then((r) => r.data),

  delete: (id: string) => apiClient.delete(`/projects/${id}`),

  getMembers: (id: string) =>
    apiClient.get<ProjectMember[]>(`/projects/${id}/members`).then((r) => r.data),

  addMember: (id: string, data: { userId: string; role: MemberRole }) =>
    apiClient.post<ProjectMember>(`/projects/${id}/members`, data).then((r) => r.data),

  removeMember: (id: string, userId: string) =>
    apiClient.delete(`/projects/${id}/members/${userId}`),

  getTasks: (id: string, params?: { page?: number; size?: number; status?: TaskStatus }) =>
    apiClient.get<Page<Task>>(`/projects/${id}/tasks`, { params }).then((r) => r.data),

  createTask: (id: string, data: Partial<Task>) =>
    apiClient.post<Task>(`/projects/${id}/tasks`, data).then((r) => r.data),

  updateTask: (projectId: string, taskId: string, data: Partial<Task>) =>
    apiClient.put<Task>(`/projects/${projectId}/tasks/${taskId}`, data).then((r) => r.data),

  deleteTask: (projectId: string, taskId: string) =>
    apiClient.delete(`/projects/${projectId}/tasks/${taskId}`),

  getTaskComments: (projectId: string, taskId: string) =>
    apiClient
      .get<TaskComment[]>(`/projects/${projectId}/tasks/${taskId}/comments`)
      .then((r) => r.data),

  addTaskComment: (projectId: string, taskId: string, content: string) =>
    apiClient
      .post<TaskComment>(`/projects/${projectId}/tasks/${taskId}/comments`, { content })
      .then((r) => r.data),
}
