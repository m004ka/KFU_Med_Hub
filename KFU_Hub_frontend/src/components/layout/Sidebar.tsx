import { useState } from 'react'
import { Layout, Menu } from 'antd'
import { useNavigate, useLocation } from 'react-router-dom'
import {
  DashboardOutlined,
  DatabaseOutlined,
  ExperimentOutlined,
  ProjectOutlined,
  AuditOutlined,
  SettingOutlined,
  ApiOutlined,
} from '@ant-design/icons'

const { Sider } = Layout

const menuItems = [
  {
    key: '/dashboard',
    icon: <DashboardOutlined />,
    label: 'Главная',
  },
  {
    key: '/datasets',
    icon: <DatabaseOutlined />,
    label: 'Датасеты',
  },
  {
    key: '/ai',
    icon: <ExperimentOutlined />,
    label: 'ИИ-анализ',
  },
  {
    key: '/projects',
    icon: <ProjectOutlined />,
    label: 'Проекты',
  },
  {
    key: '/integration',
    icon: <ApiOutlined />,
    label: 'Интеграции',
  },
  {
    key: '/audit',
    icon: <AuditOutlined />,
    label: 'Журнал аудита',
  },
  {
    key: '/settings',
    icon: <SettingOutlined />,
    label: 'Настройки',
  },
]

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()

  const selectedKey = '/' + location.pathname.split('/')[1]

  return (
    <Sider
      collapsible
      collapsed={collapsed}
      onCollapse={setCollapsed}
      width={240}
      collapsedWidth={72}
      style={{
        height: '100vh',
        position: 'sticky',
        top: 0,
        left: 0,
        overflow: 'auto',
        background: '#2d4f6e',
      }}
    >
      <div
        style={{
          height: 64,
          display: 'flex',
          alignItems: 'center',
          padding: collapsed ? '0 20px' : '0 20px',
          borderBottom: '1px solid rgba(255,255,255,0.08)',
          gap: 10,
          flexShrink: 0,
        }}
      >
        <div
          style={{
            width: 32,
            height: 32,
            borderRadius: 8,
            background: '#45688e',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            fontSize: 14,
            fontWeight: 700,
            color: '#fff',
            letterSpacing: '-0.5px',
          }}
        >
          КФУ
        </div>
        {!collapsed && (
          <div>
            <div
              style={{
                color: '#fff',
                fontWeight: 600,
                fontSize: 14,
                lineHeight: 1.2,
              }}
            >
              Медхаб
            </div>
            <div
              style={{
                color: 'rgba(255,255,255,0.45)',
                fontSize: 11,
                lineHeight: 1.2,
              }}
            >
              Медицинская санчасть
            </div>
          </div>
        )}
      </div>

      <Menu
        theme="dark"
        mode="inline"
        selectedKeys={[selectedKey]}
        items={menuItems}
        onClick={({ key }) => navigate(key)}
        style={{
          background: '#2d4f6e',
          border: 'none',
          marginTop: 8,
        }}
      />
    </Sider>
  )
}
