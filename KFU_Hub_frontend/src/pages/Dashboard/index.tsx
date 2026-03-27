import { Row, Col, Card, Statistic, Typography, Table, Tag, Space, Button, Avatar, Progress } from 'antd'
import {
  DatabaseOutlined,
  ExperimentOutlined,
  TeamOutlined,
  FileSearchOutlined,
  ArrowUpOutlined,
  RightOutlined,
} from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/store/authStore'

const { Title, Text } = Typography

const statsData = [
  {
    title: 'Датасетов',
    value: 47,
    suffix: 'шт',
    icon: <DatabaseOutlined />,
    color: '#45688e',
    bg: '#eef2f7',
    trend: '+3 за месяц',
  },
  {
    title: 'ИИ-задач запущено',
    value: 182,
    suffix: '',
    icon: <ExperimentOutlined />,
    color: '#722ed1',
    bg: '#f9f0ff',
    trend: '+24 за неделю',
  },
  {
    title: 'Активных проектов',
    value: 12,
    suffix: '',
    icon: <TeamOutlined />,
    color: '#52c41a',
    bg: '#f6ffed',
    trend: '3 новых',
  },
  {
    title: 'Пользователей',
    value: 134,
    suffix: '',
    icon: <FileSearchOutlined />,
    color: '#fa8c16',
    bg: '#fff7e6',
    trend: '+11 за месяц',
  },
]

const recentActivity = [
  { key: 1, user: 'Иванова М.С.', action: 'Загрузила датасет', object: 'lab_results_2026_q1.csv', time: '5 мин назад', status: 'success' },
  { key: 2, user: 'Петров А.Н.', action: 'Запустил ИИ-анализ', object: 'Классификация МКБ-11', time: '18 мин назад', status: 'processing' },
  { key: 3, user: 'Сидорова Е.В.', action: 'Создала проект', object: 'Анализ лёгочных патологий', time: '1 ч назад', status: 'success' },
  { key: 4, user: 'Ахметов Р.И.', action: 'Добавил участника', object: 'Предиктивная аналитика', time: '2 ч назад', status: 'success' },
  { key: 5, user: 'Козлова Т.П.', action: 'ИИ-анализ завершён', object: 'Рентгеновские снимки Q1', time: '3 ч назад', status: 'success' },
]

const activityColumns = [
  {
    title: 'Пользователь',
    dataIndex: 'user',
    render: (name: string) => (
      <Space>
        <Avatar size={28} style={{ background: '#45688e', fontSize: 11, fontWeight: 600 }}>
          {name.charAt(0)}
        </Avatar>
        <Text style={{ fontSize: 13 }}>{name}</Text>
      </Space>
    ),
  },
  {
    title: 'Действие',
    dataIndex: 'action',
    render: (action: string) => <Text style={{ fontSize: 13, color: '#6b7a8d' }}>{action}</Text>,
  },
  {
    title: 'Объект',
    dataIndex: 'object',
    render: (obj: string) => (
      <Text style={{ fontSize: 13, color: '#45688e', fontWeight: 500 }}>{obj}</Text>
    ),
  },
  {
    title: 'Статус',
    dataIndex: 'status',
    render: (s: string) => (
      <Tag color={s === 'processing' ? 'blue' : 'green'} style={{ borderRadius: 20, fontSize: 11 }}>
        {s === 'processing' ? 'В процессе' : 'Выполнено'}
      </Tag>
    ),
  },
  {
    title: 'Время',
    dataIndex: 'time',
    render: (t: string) => <Text style={{ fontSize: 12, color: '#9aa5b4' }}>{t}</Text>,
  },
]

const aiTasks = [
  { name: 'Классификация МКБ-11', progress: 67, color: '#45688e' },
  { name: 'Анализ рентген-снимков', progress: 100, color: '#52c41a' },
  { name: 'NLP историй болезней', progress: 23, color: '#722ed1' },
]

export default function Dashboard() {
  const navigate = useNavigate()
  const user = useAuthStore((s) => s.user)

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
                  suffix={stat.suffix}
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
              dataSource={recentActivity}
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
              {aiTasks.map((task) => (
                <div key={task.name}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                    <Text style={{ fontSize: 12, color: '#1a2b3c' }}>{task.name}</Text>
                    <Text style={{ fontSize: 12, color: '#6b7a8d' }}>{task.progress}%</Text>
                  </div>
                  <Progress
                    percent={task.progress}
                    strokeColor={task.color}
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
