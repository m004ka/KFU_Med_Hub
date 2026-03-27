import { Layout, Avatar, Badge, Dropdown, Space, Typography, Divider } from 'antd'
import {
  BellOutlined,
  UserOutlined,
  LogoutOutlined,
  SettingOutlined,
  QuestionCircleOutlined,
} from '@ant-design/icons'
import type { MenuProps } from 'antd'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/store/authStore'

const { Header: AntHeader } = Layout
const { Text } = Typography

const roleLabels: Record<string, string> = {
  ADMIN: 'Администратор',
  DOCTOR: 'Врач',
  TEACHER: 'Преподаватель',
  STUDENT: 'Студент',
  RESEARCHER: 'Исследователь',
}

const roleColors: Record<string, string> = {
  ADMIN: '#f50',
  DOCTOR: '#45688e',
  TEACHER: '#52c41a',
  STUDENT: '#faad14',
  RESEARCHER: '#722ed1',
}

export default function Header() {
  const navigate = useNavigate()
  const { user, logout } = useAuthStore()

  const userMenuItems: MenuProps['items'] = [
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: 'Профиль',
    },
    {
      key: 'settings',
      icon: <SettingOutlined />,
      label: 'Настройки',
      onClick: () => navigate('/settings'),
    },
    { type: 'divider' },
    {
      key: 'help',
      icon: <QuestionCircleOutlined />,
      label: 'Помощь',
    },
    { type: 'divider' },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: 'Выйти',
      danger: true,
      onClick: () => {
        logout()
        navigate('/login')
      },
    },
  ]

  return (
    <AntHeader
      style={{
        background: '#fff',
        padding: '0 24px',
        height: 64,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottom: '1px solid #d9e2ec',
        position: 'sticky',
        top: 0,
        zIndex: 100,
        boxShadow: '0 1px 3px 0 rgba(0,0,0,.04)',
      }}
    >
      <div />

      <Space size={4} align="center">
        <div
          style={{
            width: 36,
            height: 36,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: 8,
            cursor: 'pointer',
            color: '#6b7a8d',
            transition: 'all .15s',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = '#f5f7fa'
            e.currentTarget.style.color = '#45688e'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'transparent'
            e.currentTarget.style.color = '#6b7a8d'
          }}
        >
          <QuestionCircleOutlined style={{ fontSize: 17 }} />
        </div>

        <div
          style={{
            width: 36,
            height: 36,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: 8,
            cursor: 'pointer',
            color: '#6b7a8d',
            transition: 'all .15s',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = '#f5f7fa'
            e.currentTarget.style.color = '#45688e'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'transparent'
            e.currentTarget.style.color = '#6b7a8d'
          }}
        >
          <Badge count={3} size="small" offset={[-2, 2]}>
            <BellOutlined style={{ fontSize: 17 }} />
          </Badge>
        </div>

        <Divider type="vertical" style={{ margin: '0 4px', height: 20 }} />

        <Dropdown menu={{ items: userMenuItems }} trigger={['click']} placement="bottomRight">
          <Space
            size={8}
            style={{ cursor: 'pointer', padding: '4px 8px', borderRadius: 8, transition: 'all .15s' }}
            onMouseEnter={(e) => (e.currentTarget.style.background = '#f5f7fa')}
            onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
          >
            <Avatar
              size={32}
              style={{
                background: roleColors[user?.role ?? 'STUDENT'],
                fontSize: 13,
                fontWeight: 600,
              }}
            >
              {user?.name?.charAt(0) ?? 'U'}
            </Avatar>
            <div style={{ lineHeight: 1.3 }}>
              <Text strong style={{ fontSize: 13, color: '#1a2b3c', display: 'block' }}>
                {user?.name ?? 'Пользователь'}
              </Text>
              <Text style={{ fontSize: 11, color: '#6b7a8d' }}>
                {roleLabels[user?.role ?? ''] ?? ''}
              </Text>
            </div>
          </Space>
        </Dropdown>
      </Space>
    </AntHeader>
  )
}
