import { createBrowserRouter, Navigate, Outlet } from 'react-router-dom'
import AppLayout from '@/components/layout/AppLayout'
import LoginPage from '@/pages/Auth/LoginPage'
import Dashboard from '@/pages/Dashboard'
import DatasetsPage from '@/pages/Datasets'
import AIPage from '@/pages/AI'
import ProjectsPage from '@/pages/Projects'
import IntegrationPage from '@/pages/Integration'
import AuditPage from '@/pages/Audit'
import { useAuthStore } from '@/store/authStore'

function ProtectedRoute() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
  if (!isAuthenticated) return <Navigate to="/login" replace />
  return <Outlet />
}

export const router = createBrowserRouter([
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/',
    element: <ProtectedRoute />,
    children: [
      {
        element: <AppLayout />,
        children: [
          { index: true, element: <Navigate to="/dashboard" replace /> },
          { path: 'dashboard', element: <Dashboard /> },
          { path: 'datasets', element: <DatasetsPage /> },
          { path: 'ai', element: <AIPage /> },
          { path: 'projects', element: <ProjectsPage /> },
          { path: 'integration', element: <IntegrationPage /> },
          { path: 'audit', element: <AuditPage /> },
          { path: 'settings', element: <div style={{ padding: 24 }}>Настройки — в разработке</div> },
        ],
      },
    ],
  },
  { path: '*', element: <Navigate to="/dashboard" replace /> },
])
