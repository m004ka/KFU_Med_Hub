import { createBrowserRouter, Navigate } from 'react-router-dom'
import AppLayout from '@/components/layout/AppLayout'
import LoginPage from '@/pages/Auth/LoginPage'
import Dashboard from '@/pages/Dashboard'
import DatasetsPage from '@/pages/Datasets'
import AIPage from '@/pages/AI'
import ProjectsPage from '@/pages/Projects'

export const router = createBrowserRouter([
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/',
    element: <AppLayout />,
    children: [
      { index: true, element: <Navigate to="/dashboard" replace /> },
      { path: 'dashboard', element: <Dashboard /> },
      { path: 'datasets', element: <DatasetsPage /> },
      { path: 'ai', element: <AIPage /> },
      { path: 'projects', element: <ProjectsPage /> },
      { path: 'integration', element: <div style={{ padding: 24 }}>Интеграции — в разработке</div> },
      { path: 'audit', element: <div style={{ padding: 24 }}>Журнал аудита — в разработке</div> },
      { path: 'settings', element: <div style={{ padding: 24 }}>Настройки — в разработке</div> },
    ],
  },
  { path: '*', element: <Navigate to="/dashboard" replace /> },
])
