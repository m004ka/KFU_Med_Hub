import {
  Card, Row, Col, Button, Typography, Tag, Avatar,
  Input, Select, Progress, Space, Tooltip, Empty, Modal, Form, DatePicker, message,
} from 'antd'
import {
  PlusOutlined, SearchOutlined, TeamOutlined,
  CalendarOutlined, CheckSquareOutlined,
} from '@ant-design/icons'
import React, { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { projectsApi, type ProjectStatus } from '@/api/projects'
import dayjs from 'dayjs'

const { Title, Text } = Typography

const statusConfig: Record<ProjectStatus, { label: string; color: string }> = {
  ACTIVE: { label: 'Активный', color: 'green' },
  ON_HOLD: { label: 'Приостановлен', color: 'orange' },
  COMPLETED: { label: 'Завершён', color: 'blue' },
  ARCHIVED: { label: 'Архив', color: 'default' },
}

const strokeColors: Record<ProjectStatus, string> = {
  ACTIVE: '#45688e',
  ON_HOLD: '#faad14',
  COMPLETED: '#52c41a',
  ARCHIVED: '#9aa5b4',
}

const memberColors = ['#45688e', '#722ed1', '#52c41a', '#faad14', '#f5222d', '#13c2c2']

export default function ProjectsPage() {
  const queryClient = useQueryClient()
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<ProjectStatus | undefined>()
  const [page, setPage] = useState(1)
  const [createOpen, setCreateOpen] = useState(false)
  const [form] = Form.useForm()

  const { data, isLoading } = useQuery({
    queryKey: ['projects', page, statusFilter],
    queryFn: () => projectsApi.list({ page: page - 1, size: 12, status: statusFilter }),
  })

  const createMutation = useMutation({
    mutationFn: projectsApi.create,
    onSuccess: () => {
      message.success('Проект создан')
      setCreateOpen(false)
      form.resetFields()
      queryClient.invalidateQueries({ queryKey: ['projects'] })
    },
    onError: () => message.error('Не удалось создать проект'),
  })

  const filtered = (data?.content ?? []).filter((p) => {
    if (!search) return true
    const s = search.toLowerCase()
    return p.name.toLowerCase().includes(s) || (p.description ?? '').toLowerCase().includes(s)
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
        <Button type="primary" icon={<PlusOutlined />} style={{ height: 38, fontWeight: 500 }} onClick={() => setCreateOpen(true)}>
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
          allowClear
          placeholder="Все статусы"
          value={statusFilter}
          onChange={(v) => { setStatusFilter(v); setPage(1) }}
          style={{ width: 180 }}
          options={Object.entries(statusConfig).map(([v, { label }]) => ({ label, value: v }))}
        />
      </div>

      {isLoading ? null : filtered.length === 0 ? (
        <Empty description="Проекты не найдены" />
      ) : (
        <Row gutter={[16, 16]}>
          {filtered.map((project) => {
            const status = project.status as ProjectStatus
            const cfg = statusConfig[status] ?? { label: status, color: 'default' }
            const taskDone = 0
            const taskTotal = project.taskCount ?? 0
            const progress = taskTotal > 0 ? Math.round((taskDone / taskTotal) * 100) : 0

            return (
              <Col xs={24} lg={12} xl={8} key={project.id}>
                <Card
                  hoverable
                  style={{ borderRadius: 10, border: '1px solid #d9e2ec', transition: 'all .2s' }}
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
                    <Tag color={cfg.color} style={{ borderRadius: 20, fontSize: 11 }}>
                      {cfg.label}
                    </Tag>
                    {project.endDate && (
                      <Text style={{ fontSize: 11, color: '#9aa5b4' }}>
                        <CalendarOutlined style={{ marginRight: 4 }} />
                        {dayjs(project.endDate).format('DD.MM.YYYY')}
                      </Text>
                    )}
                  </div>

                  <Title level={5} style={{ margin: '0 0 6px', color: '#1a2b3c', lineHeight: 1.3 }}>
                    {project.name}
                  </Title>
                  <Text style={{ fontSize: 12, color: '#6b7a8d', display: 'block', marginBottom: 14, lineHeight: 1.5 }}>
                    {project.description}
                  </Text>

                  {(project.tags ?? []).length > 0 && (
                    <Space size={4} wrap style={{ marginBottom: 14 }}>
                      {(project.tags ?? []).map((tag) => (
                        <Tag key={tag} style={{ fontSize: 11, borderRadius: 20, borderColor: '#d9e2ec', color: '#6b7a8d', background: '#f5f7fa', margin: 0 }}>
                          {tag}
                        </Tag>
                      ))}
                    </Space>
                  )}

                  <div style={{ marginBottom: 14 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                      <Text style={{ fontSize: 11, color: '#6b7a8d' }}>
                        Задачи: {taskDone}/{taskTotal}
                      </Text>
                      <Text style={{ fontSize: 11, color: '#6b7a8d' }}>{progress}%</Text>
                    </div>
                    <Progress
                      percent={progress}
                      strokeColor={strokeColors[status] ?? '#45688e'}
                      trailColor="#eef2f7"
                      showInfo={false}
                      size={['100%', 6]}
                    />
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Avatar.Group max={{ count: 3, style: { background: '#45688e', fontSize: 11 } as React.CSSProperties }} size={28}>
                      {Array.from({ length: Math.min(project.memberCount ?? 0, 5) }).map((_, i) => (
                        <Tooltip key={i} title={`Участник ${i + 1}`}>
                          <Avatar size={28} style={{ background: memberColors[i % memberColors.length], fontSize: 11, fontWeight: 600 }}>
                            {String.fromCharCode(65 + i)}
                          </Avatar>
                        </Tooltip>
                      ))}
                    </Avatar.Group>
                    <Space size={12}>
                      <Text style={{ fontSize: 11, color: '#9aa5b4' }}>
                        <TeamOutlined style={{ marginRight: 3 }} />
                        {project.memberCount ?? 0}
                      </Text>
                      <Text style={{ fontSize: 11, color: '#9aa5b4' }}>
                        <CheckSquareOutlined style={{ marginRight: 3 }} />
                        {project.taskCount ?? 0}
                      </Text>
                    </Space>
                  </div>
                </Card>
              </Col>
            )
          })}
        </Row>
      )}

      <Modal
        title="Новый проект"
        open={createOpen}
        onCancel={() => setCreateOpen(false)}
        footer={null}
        width={520}
      >
        <Form layout="vertical" requiredMark={false} form={form} onFinish={(v) => createMutation.mutate({
          name: v.name,
          description: v.description,
          startDate: v.startDate?.toISOString(),
          endDate: v.endDate?.toISOString(),
          tags: v.tags ?? [],
        })}>
          <Form.Item label="Название" name="name" rules={[{ required: true }]}>
            <Input placeholder="Название проекта" />
          </Form.Item>
          <Form.Item label="Описание" name="description">
            <Input.TextArea rows={2} />
          </Form.Item>
          <Row gutter={12}>
            <Col span={12}>
              <Form.Item label="Начало" name="startDate">
                <DatePicker style={{ width: '100%' }} format="DD.MM.YYYY" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Дедлайн" name="endDate">
                <DatePicker style={{ width: '100%' }} format="DD.MM.YYYY" />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item label="Теги" name="tags">
            <Select mode="tags" placeholder="Добавьте теги" />
          </Form.Item>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
            <Button onClick={() => setCreateOpen(false)}>Отмена</Button>
            <Button type="primary" htmlType="submit" loading={createMutation.isPending}>Создать</Button>
          </div>
        </Form>
      </Modal>
    </div>
  )
}
