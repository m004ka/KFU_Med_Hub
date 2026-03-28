import apiClient from './client'

export interface LoginRequest {
  username: string
  password: string
}

export interface AuthResponse {
  accessToken: string
  refreshToken: string
  tokenType: string
  userId: string
  username: string
  role: string
}

export const authApi = {
  login: (data: LoginRequest) =>
    apiClient.post<AuthResponse>('/auth/login', data).then((r) => r.data),

  refresh: (refreshToken: string) =>
    apiClient
      .post<AuthResponse>('/auth/refresh', { refreshToken })
      .then((r) => r.data),

  logout: () => apiClient.post('/auth/logout'),
}
