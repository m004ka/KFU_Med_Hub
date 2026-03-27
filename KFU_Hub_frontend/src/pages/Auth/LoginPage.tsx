import { Form, Input, Button, Checkbox, Divider, Typography, Space, Alert } from 'antd'
import { UserOutlined, LockOutlined } from '@ant-design/icons'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/store/authStore'

const { Title, Text, Link } = Typography

export default function LoginPage() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const navigate = useNavigate()
  const setAuth = useAuthStore((s) => s.setAuth)

  const onFinish = async (values: { email: string; password: string }) => {
    setLoading(true)
    setError(null)
    try {
      // TODO: replace with real API call
      await new Promise((r) => setTimeout(r, 800))
      setAuth(
        {
          id: '1',
          name: 'Юсупов Радмир',
          email: values.email,
          role: 'ADMIN',
          department: 'Медицинская санчасть',
        },
        'mock-token'
      )
      navigate('/dashboard')
    } catch {
      setError('Неверный логин или пароль')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #2d4f6e 0%, #45688e 50%, #6b8faf 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 24,
      }}
    >
      <div style={{ width: '100%', maxWidth: 420 }}>
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div
            style={{
              width: 60,
              height: 60,
              borderRadius: 14,
              background: 'rgba(255,255,255,0.15)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255,255,255,0.2)',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 20,
              fontWeight: 700,
              color: '#fff',
              marginBottom: 16,
              letterSpacing: '-1px',
            }}
          >
            КФУ
          </div>
          <Title level={3} style={{ color: '#fff', margin: 0, fontWeight: 600 }}>
            Медицинский хаб
          </Title>
          <Text style={{ color: 'rgba(255,255,255,0.65)', fontSize: 13 }}>
            Казанский федеральный университет
          </Text>
        </div>

        <div
          style={{
            background: '#fff',
            borderRadius: 16,
            padding: 32,
            boxShadow: '0 20px 60px rgba(0,0,0,0.2)',
          }}
        >
          <Title level={4} style={{ marginBottom: 6, color: '#1a2b3c' }}>
            Вход в систему
          </Title>
          <Text style={{ color: '#6b7a8d', fontSize: 13, display: 'block', marginBottom: 24 }}>
            Используйте корпоративную учётную запись КФУ
          </Text>

          {error && (
            <Alert message={error} type="error" showIcon style={{ marginBottom: 20 }} />
          )}

          <Form layout="vertical" onFinish={onFinish} requiredMark={false} size="large">
            <Form.Item
              name="email"
              rules={[{ required: true, message: 'Введите email' }]}
              style={{ marginBottom: 16 }}
            >
              <Input
                prefix={<UserOutlined style={{ color: '#9aa5b4' }} />}
                placeholder="email@kpfu.ru"
                autoComplete="email"
              />
            </Form.Item>

            <Form.Item
              name="password"
              rules={[{ required: true, message: 'Введите пароль' }]}
              style={{ marginBottom: 16 }}
            >
              <Input.Password
                prefix={<LockOutlined style={{ color: '#9aa5b4' }} />}
                placeholder="Пароль"
                autoComplete="current-password"
              />
            </Form.Item>

            <div
              style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20, alignItems: 'center' }}
            >
              <Checkbox style={{ color: '#6b7a8d', fontSize: 13 }}>Запомнить меня</Checkbox>
              <Link style={{ fontSize: 13 }}>Забыли пароль?</Link>
            </div>

            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              block
              style={{
                height: 44,
                fontWeight: 600,
                fontSize: 15,
                borderRadius: 8,
              }}
            >
              Войти
            </Button>
          </Form>

          <Divider style={{ margin: '20px 0', color: '#9aa5b4', fontSize: 12 }}>или</Divider>

          <Button
            block
            style={{
              height: 44,
              borderColor: '#d9e2ec',
              color: '#1a2b3c',
              fontWeight: 500,
              borderRadius: 8,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z" fill="#45688e"/>
            </svg>
            Войти через SSO КФУ
          </Button>

          <Space
            style={{ marginTop: 20, display: 'flex', justifyContent: 'center', gap: 4 }}
          >
            <Text style={{ fontSize: 12, color: '#9aa5b4' }}>
              Проблемы со входом?
            </Text>
            <Link style={{ fontSize: 12 }}>Обратитесь в поддержку</Link>
          </Space>
        </div>

        <Text style={{ color: 'rgba(255,255,255,0.4)', fontSize: 11, display: 'block', textAlign: 'center', marginTop: 20 }}>
          © 2026 КФУ — Медицинская санчасть. Версия 0.1.0
        </Text>
      </div>
    </div>
  )
}
