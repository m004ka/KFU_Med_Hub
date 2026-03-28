import {
  Card, Table, Typography, Tag, Input, DatePicker, Select, Row, Col, Button,
} from 'antd'
import { SearchOutlined, FilterOutlined } from '@ant-design/icons'
import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { auditApi } from '@/api/audit'
import dayjs from 'dayjs'

const { Title, Text } = Typography
const { RangePicker } = DatePicker

const actionColors: Record<string, string> = {
  CREATE: 'green',
  UPDATE: 'blue',
  DELETE: 'red',
  VIEW: 'default',
  LOGIN: 'cyan',
  LOGOUT: 'orange',
  PUBLISH: 'purple',
  ARCHIVE: 'volcano',
}

export default function AuditPage() {
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [actionFilter, setActionFilter] = useState<string | undefined>()
  const [entityFilter, setEntityFilter] = useState<string | undefined>()
  const [dateRange, setDateRange] = useState<[string, string] | null>(null)

  const { data, isLoading } = useQuery({
    queryKey: ['audit', page, actionFilter, entityFilter, dateRange],
    queryFn: () =>
      auditApi.list({
        page: page - 1,
        size: 20,
        action: actionFilter,
        entityType: entityFilter,
        from: dateRange?.[0],
        to: dateRange?.[1],
      }),
  })

  const filtered = (data?.content ?? []).filter((log) => {
    if (!search) return true
    const s = search.toLowerCase()
    return (
      (log.userName ?? '').toLowerCase().includes(s) ||
      (log.entityType ?? '').toLowerCase().includes(s) ||
      (log.entityId ?? '').toLowerCase().includes(s) ||
      (log.details ?? '').toLowerCase().includes(s)
    )
  })

  const columns = [
    {
      title: 'Дата/время',
      dataIndex: 'createdAt',
      width: 150,
      render: (d: string) => (
        <Text style={{ fontSize: 12, color: '#6b7a8d', fontFamily: 'monospace' }}>
          {d ? dayjs(d).format('DD.MM.YYYY HH:mm') : '—'}
        </Text>
      ),
    },
    {
      title: 'Пользователь',
      dataIndex: 'userName',
      width: 160,
      render: (name: string) => <Text style={{ fontSize: 13 }}>{name ?? '—'}</Text>,
    },
    {
      title: 'Действие',
      dataIndex: 'action',
      width: 120,
      render: (action: string) => (
        <Tag color={actionColors[action] ?? 'default'} style={{ borderRadius: 20, fontSize: 11 }}>
          {action}
        </Tag>
      ),
    },
    {
      title: 'Сущность',
      dataIndex: 'entityType',
      width: 130,
      render: (t: string) => <Tag style={{ borderRadius: 20, fontSize: 11, borderColor: '#d9e2ec', background: '#f5f7fa', color: '#6b7a8d' }}>{t ?? '—'}</Tag>,
    },
    {
      title: 'ID объекта',
      dataIndex: 'entityId',
      width: 200,
      render: (id: string) => (
        <Text style={{ fontSize: 11, color: '#9aa5b4', fontFamily: 'monospace' }}>{id ?? '—'}</Text>
      ),
    },
    {
      title: 'Детали',
      dataIndex: 'details',
      render: (d: string) => (
        <Text style={{ fontSize: 12, color: '#6b7a8d' }} ellipsis={{ tooltip: d }}>
          {d ?? '—'}
        </Text>
      ),
    },
    {
      title: 'IP',
      dataIndex: 'ipAddress',
      width: 130,
      render: (ip: string) => (
        <Text style={{ fontSize: 11, color: '#9aa5b4', fontFamily: 'monospace' }}>{ip ?? '—'}</Text>
      ),
    },
  ]

  return (
    <div style={{ maxWidth: 1400 }}>
      <div style={{ marginBottom: 24 }}>
        <Title level={4} style={{ margin: 0, color: '#1a2b3c' }}>Журнал аудита</Title>
        <Text style={{ color: '#6b7a8d', fontSize: 13 }}>
          Все действия пользователей в системе
        </Text>
      </div>

      <Card style={{ borderRadius: 10, border: '1px solid #d9e2ec', marginBottom: 16 }} styles={{ body: { padding: 16 } }}>
        <Row gutter={12} align="middle">
          <Col flex="1">
            <Input
              prefix={<SearchOutlined style={{ color: '#9aa5b4' }} />}
              placeholder="Поиск по пользователю, объекту, деталям..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ borderRadius: 8 }}
            />
          </Col>
          <Col>
            <Select
              placeholder="Действие"
              allowClear
              style={{ width: 140 }}
              value={actionFilter}
              onChange={(v) => { setActionFilter(v); setPage(1) }}
              options={Object.keys(actionColors).map((a) => ({ label: a, value: a }))}
            />
          </Col>
          <Col>
            <Select
              placeholder="Тип сущности"
              allowClear
              style={{ width: 160 }}
              value={entityFilter}
              onChange={(v) => { setEntityFilter(v); setPage(1) }}
              options={['DATASET', 'PROJECT', 'TASK', 'USER', 'AI_TASK', 'NOTIFICATION'].map((v) => ({ label: v, value: v }))}
            />
          </Col>
          <Col>
            <RangePicker
              format="DD.MM.YYYY"
              onChange={(_, s) => setDateRange(s[0] && s[1] ? [s[0], s[1]] : null)}
            />
          </Col>
          <Col>
            <Button
              icon={<FilterOutlined />}
              style={{ borderRadius: 8, borderColor: '#d9e2ec', color: '#6b7a8d' }}
              onClick={() => { setActionFilter(undefined); setEntityFilter(undefined); setDateRange(null); setSearch('') }}
            >
              Сбросить
            </Button>
          </Col>
        </Row>
      </Card>

      <Card style={{ borderRadius: 10, border: '1px solid #d9e2ec' }} styles={{ body: { padding: 0 } }}>
        <Table
          dataSource={filtered}
          rowKey="id"
          columns={columns}
          loading={isLoading}
          pagination={{
            current: page,
            pageSize: 20,
            total: data?.totalElements ?? 0,
            onChange: setPage,
            showSizeChanger: false,
            showTotal: (total) => `Всего ${total} записей`,
          }}
          size="small"
          scroll={{ x: 1100 }}
        />
      </Card>
    </div>
  )
}
