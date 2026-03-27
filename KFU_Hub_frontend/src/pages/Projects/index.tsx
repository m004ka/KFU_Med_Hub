import {
  Card, Row, Col, Button, Typography, Tag, Avatar,
  Input, Select, Progress, Space, Tooltip, Empty,
} from 'antd'
import {
  PlusOutlined, SearchOutlined, TeamOutlined,
  CalendarOutlined, DatabaseOutlined,
} from '@ant-design/icons'
import React, { useState } from 'react'

const { Title, Text } = Typography

type ProjectStatus = 'active' | 'completed' | 'paused'

interface Project {
  id: number
  title: string
  description: string
  status: ProjectStatus
  progress: number
  members: { name: string; role: string; color: string }[]
  datasets: number
  tasks: { total: number; done: number }
  deadline: string
  tags: string[]
}

const projects: Project[] = [
  {
    id: 1,
    title: 'Анализ лёгочных патологий',
    description: 'Исследование паттернов на рентгеновских снимках с применением CNN для раннего выявления патологий',
    status: 'active',
    progress: 65,
    members: [
      { name: 'Петров А.Н.', role: 'DOCTOR', color: '#45688e' },
      { name: 'Иванова М.С.', role: 'RESEARCHER', color: '#722ed1' },
      { name: 'Ахметов Р.И.', role: 'STUDENT', color: '#faad14' },
    ],
    datasets: 2,
    tasks: { total: 12, done: 7 },
    deadline: '15.04.2026',
    tags: ['рентген', 'CNN', 'лёгкие'],
  },
  {
    id: 2,
    title: 'Предиктивная модель сахарного диабета',
    description: 'Построение предиктивной модели риска развития диабета 2 типа на основе лабораторных данных',
    status: 'active',
    progress: 30,
    members: [
      { name: 'Козлова Т.П.', role: 'TEACHER', color: '#52c41a' },
      { name: 'Сидорова Е.В.', role: 'DOCTOR', color: '#45688e' },
    ],
    datasets: 3,
    tasks: { total: 8, done: 2 },
    deadline: '01.06.2026',
    tags: ['диабет', 'XGBoost', 'лаборатория'],
  },
  {
    id: 3,
    title: 'NLP классификация выписок',
    description: 'Автоматическая классификация медицинских выписок по МКБ-11 с помощью ruBERT',
    status: 'paused',
    progress: 50,
    members: [
      { name: 'Ахметов Р.И.', role: 'RESEARCHER', color: '#722ed1' },
      { name: 'Петров А.Н.', role: 'TEACHER', color: '#52c41a' },
      { name: 'Иванова М.С.', role: 'STUDENT', color: '#faad14' },
      { name: 'Козлова Т.П.', role: 'STUDENT', color: '#f5222d' },
    ],
    datasets: 1,
    tasks: { total: 15, done: 8 },
    deadline: '30.05.2026',
    tags: ['NLP', 'ruBERT', 'МКБ-11'],
  },
  {
    id: 4,
    title: 'Мониторинг кардиологических показателей',
    description: 'Анализ трендов АД, ЧСС у пациентов с ХСН за 12 месяцев',
    status: 'completed',
    progress: 100,
    members: [
      { name: 'Сидорова Е.В.', role: 'DOCTOR', color: '#45688e' },
      { name: 'Козлова Т.П.', role: 'TEACHER', color: '#52c41a' },
    ],
    datasets: 4,
    tasks: { total: 10, done: 10 },
    deadline: '01.03.2026',
    tags: ['кардиология', 'мониторинг', 'ХСН'],
  },
]

const statusConfig: Record<ProjectStatus, { label: string; color: string }> = {
  active: { label: 'Активный', color: 'green' },
  paused: { label: 'Приостановлен', color: 'orange' },
  completed: { label: 'Завершён', color: 'blue' },
}

const strokeColors: Record<ProjectStatus, string> = {
  active: '#45688e',
  paused: '#faad14',
  completed: '#52c41a',
}

export default function ProjectsPage() {
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<ProjectStatus | 'all'>('all')

  const filtered = projects.filter((p) => {
    const matchSearch =
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.description.toLowerCase().includes(search.toLowerCase())
    const matchStatus = statusFilter === 'all' || p.status === statusFilter
    return matchSearch && matchStatus
  })

  return (
    <div style={{ maxWidth: 1400 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
        <div>
          <Title level={4} style={{ margin: 0, color: '#1a2b3c' }}>Исследовательские проекты</Title>
          <Text style={{ color: '#6b7a8d', fontSize: 13 }}>
            Совместная работа врачей, преподавателей и студентов
          </Text>
        </div>
        <Button type="primary" icon={<PlusOutlined />} style={{ height: 38, fontWeight: 500 }}>
          Создать проект
        </Button>
      </div>

      <div style={{ display: 'flex', gap: 12, marginBottom: 20 }}>
        <Input
          prefix={<SearchOutlined style={{ color: '#9aa5b4' }} />}
          placeholder="Поиск проектов..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ maxWidth: 320, borderRadius: 8 }}
        />
        <Select
          value={statusFilter}
          onChange={setStatusFilter}
          style={{ width: 160 }}
          options={[
            { label: 'Все статусы', value: 'all' },
            { label: 'Активные', value: 'active' },
            { label: 'Приостановленные', value: 'paused' },
            { label: 'Завершённые', value: 'completed' },
          ]}
        />
      </div>

      {filtered.length === 0 ? (
        <Empty description="Проекты не найдены" />
      ) : (
        <Row gutter={[16, 16]}>
          {filtered.map((project) => (
            <Col xs={24} lg={12} xl={8} key={project.id}>
              <Card
                hoverable
                style={{
                  borderRadius: 10,
                  border: '1px solid #d9e2ec',
                  cursor: 'pointer',
                  transition: 'all .2s',
                }}
                styles={{ body: { padding: 20 } }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(69,104,142,.15)'
                  e.currentTarget.style.borderColor = '#45688e'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = ''
                  e.currentTarget.style.borderColor = '#d9e2ec'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
                  <Tag
                    color={statusConfig[project.status].color}
                    style={{ borderRadius: 20, fontSize: 11 }}
                  >
                    {statusConfig[project.status].label}
                  </Tag>
                  <Text style={{ fontSize: 11, color: '#9aa5b4' }}>
                    <CalendarOutlined style={{ marginRight: 4 }} />
                    {project.deadline}
                  </Text>
                </div>

                <Title level={5} style={{ margin: '0 0 6px', color: '#1a2b3c', lineHeight: 1.3 }}>
                  {project.title}
                </Title>
                <Text style={{ fontSize: 12, color: '#6b7a8d', display: 'block', marginBottom: 14, lineHeight: 1.5 }}>
                  {project.description}
                </Text>

                <Space size={4} wrap style={{ marginBottom: 14 }}>
                  {project.tags.map((tag) => (
                    <Tag key={tag} style={{ fontSize: 11, borderRadius: 20, borderColor: '#d9e2ec', color: '#6b7a8d', background: '#f5f7fa', margin: 0 }}>
                      {tag}
                    </Tag>
                  ))}
                </Space>

                <div style={{ marginBottom: 14 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                    <Text style={{ fontSize: 11, color: '#6b7a8d' }}>
                      Задачи: {project.tasks.done}/{project.tasks.total}
                    </Text>
                    <Text style={{ fontSize: 11, color: '#6b7a8d' }}>{project.progress}%</Text>
                  </div>
                  <Progress
                    percent={project.progress}
                    strokeColor={strokeColors[project.status]}
                    trailColor="#eef2f7"
                    showInfo={false}
                    size={['100%', 6]}
                  />
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Avatar.Group max={{ count: 3, style: { background: '#45688e', fontSize: 11 } as React.CSSProperties }} size={28}>
                    {project.members.map((m) => (
                      <Tooltip key={m.name} title={`${m.name}`}>
                        <Avatar size={28} style={{ background: m.color, fontSize: 11, fontWeight: 600 }}>
                          {m.name.charAt(0)}
                        </Avatar>
                      </Tooltip>
                    ))}
                  </Avatar.Group>
                  <Space size={12}>
                    <Text style={{ fontSize: 11, color: '#9aa5b4' }}>
                      <TeamOutlined style={{ marginRight: 3 }} />
                      {project.members.length}
                    </Text>
                    <Text style={{ fontSize: 11, color: '#9aa5b4' }}>
                      <DatabaseOutlined style={{ marginRight: 3 }} />
                      {project.datasets}
                    </Text>
                  </Space>
                </div>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </div>
  )
}
