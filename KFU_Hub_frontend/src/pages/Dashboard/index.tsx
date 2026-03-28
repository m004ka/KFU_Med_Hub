import { Row, Col, Card, Statistic, Typography, Table, Tag, Space, Button, Avatar, Progress } from 'antd'
import {
  DatabaseOutlined,
  ExperimentOutlined,
  TeamOutlined,
  AuditOutlined,
  ArrowUpOutlined,
  RightOutlined,
} from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { useAuthStore } from '@/store/authStore'
import { datasetsApi } from '@/api/datasets'
import { projectsApi } from '@/api/projects'
import { aiApi } from '@/api/ai'
import { auditApi } from '@/api/audit'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import 'dayjs/locale/ru'
dayjs.extend(relativeTime)
dayjs.locale('ru')

const { Title, Text } = Typography

const activityColumns = [
  {
    title: 'Пользователь',
    dataIndex: 'userName',
    render: (name: string) => (
      <Space>
        <Avatar size={28} style={{ background: '#45688e', fontSize: 11, fontWeight: 600 }}>
          {(name ?? '?').charAt(0)}
        </Avatar>
        <Text style={{ fontSize: 13 }}>{name ?? '—'}</Text>
      </Space>
    ),
  },
  {
    title: 'Действие',
    dataIndex: 'action',
    render: (action: string) => <Tag color="blue" style={{ borderRadius: 20, fontSize: 11 }}>{action}</Tag>,
  },
  {
    title: 'Объект',
    dataIndex: 'entityType',
    render: (t: string, row: any) => (
      <Text style={{ fontSize: 12, color: '#45688e', fontWeight: 500 }}>{t}{row.entityId ? ` #${row.entityId.slice(0, 8)}` : ''}</Text>
    ),
  },
  {
    title: 'Время',
    dataIndex: 'createdAt',
    render: (t: string) => <Text style={{ fontSize: 12, color: '#9aa5b4' }}>{t ? dayjs(t).fromNow() : '—'}</Text>,
  },
]

export default function Dashboard() {
  const navigate = useNavigate()
  const user = useAuthStore((s) => s.user)

  const { data: datasetsData } = useQuery({ queryKey: ['datasets-count'], queryFn: () => datasetsApi.list({ page: 0, size: 1 }) })
  const { data: projectsData } = useQuery({ queryKey: ['projects-count'], queryFn: () => projectsApi.list({ page: 0, size: 1 }) })
  const { data: aiData } = useQuery({ queryKey: ['ai-tasks-count'], queryFn: () => aiApi.list({ page: 0, size: 1 }) })
  const { data: auditData } = useQuery({ queryKey: ['audit-recent'], queryFn: () => auditApi.list({ page: 0, size: 5 }) })
  const { data: runningAi } = useQuery({ queryKey: ['ai-running'], queryFn: () => aiApi.list({ page: 0, size: 5, status: 'RUNNING' }), refetchInterval: 5_000 })

  const statsData = [
    { title: 'Датасетов', value: datasetsData?.totalElements ?? 0, icon: <DatabaseOutlined />, color: '#45688e', bg: '#eef2f7', trend: 'всего в системе' },
    { title: 'ИИ-задач запущено', value: aiData?.totalElements ?? 0, icon: <ExperimentOutlined />, color: '#722ed1', bg: '#f9f0ff', trend: 'всего в системе' },
    { title: 'Активных проектов', value: projectsData?.totalElements ?? 0, icon: <TeamOutlined />, color: '#52c41a', bg: '#f6ffed', trend: 'всего в системе' },
    { title: 'Записей аудита', value: auditData?.totalElements ?? 0, icon: <AuditOutlined />, color: '#fa8c16', bg: '#fff7e6', trend: 'всего в системе' },
  ]

  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Доброе утро' : hour < 18 ? 'Добрый день' : 'Добрый вечер'

  return (
    <div style={{ maxWidth: 1400 }}>
      <div style={{ marginBottom: 24 }}>
        <Title level={4} style={{ margin: 0, color: '#1a2b3c' }}>
          {greeting}, {user?.name?.split(' ')[0]} 👋
        </Title>
        <Text style={{ color: '#6b7a8d', fontSize: 13 }}>
          Платформа медицинских данных КФУ — обзор системы
        </Text>
      </div>

      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        {statsData.map((stat) => (
          <Col xs={24} sm={12} lg={6} key={stat.title}>
            <Card
              style={{
                borderRadius: 10,
                border: '1px solid #d9e2ec',
                boxShadow: '0 1px 3px rgba(0,0,0,.04)',
              }}
              styles={{ body: { padding: 20 } }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <Statistic
                  title={
                    <Text style={{ fontSize: 12, color: '#6b7a8d', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                      {stat.title}
                    </Text>
                  }
                  value={stat.value}
                  valueStyle={{ fontSize: 28, fontWeight: 700, color: '#1a2b3c', lineHeight: 1.2 }}
                />
                <div
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 10,
                    background: stat.bg,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 18,
                    color: stat.color,
                  }}
                >
                  {stat.icon}
                </div>
              </div>
              <div style={{ marginTop: 8, display: 'flex', alignItems: 'center', gap: 4 }}>
                <ArrowUpOutlined style={{ fontSize: 11, color: '#52c41a' }} />
                <Text style={{ fontSize: 12, color: '#52c41a' }}>{stat.trend}</Text>
              </div>
            </Card>
          </Col>
        ))}
      </Row>

      <Row gutter={[16, 16]}>
        <Col xs={24} xl={16}>
          <Card
            title={
              <Text strong style={{ fontSize: 14, color: '#1a2b3c' }}>
                Последние действия
              </Text>
            }
            extra={
              <Button type="link" size="small" icon={<RightOutlined />} style={{ color: '#45688e', fontSize: 12 }}>
                Все события
              </Button>
            }
            style={{ borderRadius: 10, border: '1px solid #d9e2ec' }}
            styles={{ body: { padding: 0 } }}
          >
            <Table
              dataSource={auditData?.content ?? []}
              rowKey="id"
              columns={activityColumns}
              pagination={false}
              size="small"
              style={{ borderRadius: 10 }}
            />
          </Card>
        </Col>

        <Col xs={24} xl={8}>
          <Card
            title={
              <Text strong style={{ fontSize: 14, color: '#1a2b3c' }}>
                Активные ИИ-задачи
              </Text>
            }
            extra={
              <Button
                type="link"
                size="small"
                onClick={() => navigate('/ai')}
                style={{ color: '#45688e', fontSize: 12 }}
              >
                Все задачи
              </Button>
            }
            style={{ borderRadius: 10, border: '1px solid #d9e2ec', marginBottom: 16 }}
          >
            <Space direction="vertical" style={{ width: '100%' }} size={16}>
              {(runningAi?.content ?? []).length === 0 ? (
                <Text style={{ fontSize: 13, color: '#9aa5b4' }}>Нет активных задач</Text>
              ) : (runningAi?.content ?? []).map((task) => (
                <div key={task.id}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                    <Text style={{ fontSize: 12, color: '#1a2b3c' }}>{task.name}</Text>
                    <Text style={{ fontSize: 12, color: '#6b7a8d' }}>{task.progress ?? 0}%</Text>
                  </div>
                  <Progress
                    percent={task.progress ?? 0}
                    strokeColor="#45688e"
                    trailColor="#eef2f7"
                    showInfo={false}
                    size={['100%', 6]}
                    style={{ marginBottom: 0 }}
                  />
                </div>
              ))}
            </Space>
          </Card>

          <Card
            title={
              <Text strong style={{ fontSize: 14, color: '#1a2b3c' }}>
                Быстрые действия
              </Text>
            }
            style={{ borderRadius: 10, border: '1px solid #d9e2ec' }}
          >
            <Space direction="vertical" style={{ width: '100%' }} size={8}>
              {[
                { label: 'Загрузить датасет', path: '/datasets', color: '#45688e' },
                { label: 'Запустить ИИ-анализ', path: '/ai', color: '#722ed1' },
                { label: 'Создать проект', path: '/projects', color: '#52c41a' },
              ].map((a) => (
                <Button
                  key={a.path}
                  block
                  onClick={() => navigate(a.path)}
                  style={{
                    textAlign: 'left',
                    height: 38,
                    borderColor: '#d9e2ec',
                    color: a.color,
                    fontWeight: 500,
                    fontSize: 13,
                    borderRadius: 8,
                  }}
                >
                  {a.label}
                </Button>
              ))}
            </Space>
          </Card>
        </Col>
      </Row>
    </div>
  )
}
