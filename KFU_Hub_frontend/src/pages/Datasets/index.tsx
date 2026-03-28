import {
  Card, Input, Table, Tag, Button, Space, Typography,
  Select, Row, Col, Tooltip, Upload, Modal, Form, Divider, message,
} from 'antd'
import {
  SearchOutlined, UploadOutlined, DownloadOutlined,
  EyeOutlined, FilterOutlined, PlusOutlined,
} from '@ant-design/icons'
import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { datasetsApi, type Dataset, type DatasetType } from '@/api/datasets'
import dayjs from 'dayjs'

const { Title, Text } = Typography

const typeColors: Record<DatasetType, string> = {
  CLINICAL: 'green',
  GENOMIC: 'purple',
  IMAGING: 'volcano',
  LAB: 'cyan',
  OTHER: 'default',
}

const typeLabels: Record<DatasetType, string> = {
  CLINICAL: 'Клинический',
  GENOMIC: 'Геномный',
  IMAGING: 'Изображения',
  LAB: 'Лаборатория',
  OTHER: 'Другое',
}

const statusColors: Record<string, string> = {
  DRAFT: 'orange',
  PUBLISHED: 'green',
  ARCHIVED: 'default',
}

const statusLabels: Record<string, string> = {
  DRAFT: 'Черновик',
  PUBLISHED: 'Опубликован',
  ARCHIVED: 'Архив',
}

function formatBytes(bytes: number) {
  if (!bytes) return '—'
  if (bytes < 1024) return `${bytes} Б`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} КБ`
  if (bytes < 1024 * 1024 * 1024) return `${(bytes / 1024 / 1024).toFixed(1)} МБ`
  return `${(bytes / 1024 / 1024 / 1024).toFixed(2)} ГБ`
}

export default function DatasetsPage() {
  const queryClient = useQueryClient()
  const [uploadOpen, setUploadOpen] = useState(false)
  const [createOpen, setCreateOpen] = useState(false)
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [statusFilter, setStatusFilter] = useState<string | undefined>()
  const [typeFilter, setTypeFilter] = useState<DatasetType | undefined>()
  const [form] = Form.useForm()
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [createdId, setCreatedId] = useState<string | null>(null)

  const { data, isLoading } = useQuery({
    queryKey: ['datasets', page, statusFilter, typeFilter],
    queryFn: () =>
      datasetsApi.list({
        page: page - 1,
        size: 10,
        status: statusFilter as any,
        type: typeFilter,
      }),
  })

  const createMutation = useMutation({
    mutationFn: datasetsApi.create,
    onSuccess: (ds) => {
      setCreatedId(ds.id)
      setCreateOpen(false)
      setUploadOpen(true)
      form.resetFields()
    },
    onError: () => message.error('Не удалось создать датасет'),
  })

  const uploadMutation = useMutation({
    mutationFn: ({ id, file }: { id: string; file: File }) =>
      datasetsApi.upload(id, file),
    onSuccess: () => {
      message.success('Файл загружен')
      setUploadOpen(false)
      setCreatedId(null)
      setSelectedFile(null)
      queryClient.invalidateQueries({ queryKey: ['datasets'] })
    },
    onError: () => message.error('Ошибка загрузки файла'),
  })

  const handleCreate = (values: any) => {
    createMutation.mutate({
      name: values.name,
      description: values.description,
      type: values.type,
      tags: values.tags ?? [],
    })
  }

  const handleUpload = () => {
    if (!createdId || !selectedFile) return
    uploadMutation.mutate({ id: createdId, file: selectedFile })
  }

  const filtered = (data?.content ?? []).filter((d) => {
    if (!search) return true
    const s = search.toLowerCase()
    return (
      d.name.toLowerCase().includes(s) ||
      (d.description ?? '').toLowerCase().includes(s) ||
      (d.tags ?? []).some((t) => t.toLowerCase().includes(s))
    )
  })

  const columns = [
    {
      title: 'Название',
      dataIndex: 'name',
      render: (name: string, row: Dataset) => (
        <div>
          <Text strong style={{ fontSize: 13, color: '#1a2b3c', fontFamily: 'monospace' }}>{name}</Text>
          <br />
          <Text style={{ fontSize: 12, color: '#6b7a8d' }}>{row.description}</Text>
        </div>
      ),
    },
    {
      title: 'Тип',
      dataIndex: 'type',
      width: 130,
      render: (t: DatasetType) => (
        <Tag color={typeColors[t] ?? 'default'} style={{ borderRadius: 20, fontSize: 11 }}>
          {typeLabels[t] ?? t}
        </Tag>
      ),
    },
    {
      title: 'Статус',
      dataIndex: 'status',
      width: 120,
      render: (s: string) => (
        <Tag color={statusColors[s] ?? 'default'} style={{ borderRadius: 20, fontSize: 11 }}>
          {statusLabels[s] ?? s}
        </Tag>
      ),
    },
    {
      title: 'Размер / Записей',
      dataIndex: 'fileSize',
      width: 140,
      render: (size: number, row: Dataset) => (
        <div>
          <Text style={{ fontSize: 13 }}>{formatBytes(size)}</Text>
          <br />
          <Text style={{ fontSize: 11, color: '#9aa5b4' }}>{row.recordCount?.toLocaleString('ru') ?? '—'} записей</Text>
        </div>
      ),
    },
    {
      title: 'Теги',
      dataIndex: 'tags',
      render: (tags: string[]) => (
        <Space size={4} wrap>
          {(tags ?? []).map((t) => (
            <Tag key={t} style={{ borderRadius: 20, fontSize: 11, borderColor: '#d9e2ec', color: '#6b7a8d', background: '#f5f7fa' }}>{t}</Tag>
          ))}
        </Space>
      ),
    },
    {
      title: 'Владелец',
      dataIndex: 'ownerName',
      width: 150,
      render: (o: string) => <Text style={{ fontSize: 12, color: '#6b7a8d' }}>{o}</Text>,
    },
    {
      title: 'Обновлён',
      dataIndex: 'updatedAt',
      width: 110,
      render: (d: string) => <Text style={{ fontSize: 12, color: '#9aa5b4' }}>{d ? dayjs(d).format('DD.MM.YYYY') : '—'}</Text>,
    },
    {
      title: '',
      key: 'actions',
      width: 100,
      render: (_: any, row: Dataset) => (
        <Space>
          <Tooltip title="Просмотр">
            <Button size="small" icon={<EyeOutlined />} style={{ border: 'none', color: '#45688e', background: '#eef2f7' }} />
          </Tooltip>
          <Tooltip title="Скачать">
            <Button
              size="small"
              icon={<DownloadOutlined />}
              style={{ border: 'none', color: '#6b7a8d', background: '#f5f7fa' }}
              onClick={() => datasetsApi.getDownloadUrl(row.id).then((r) => window.open(r.url, '_blank'))}
            />
          </Tooltip>
        </Space>
      ),
    },
  ]

  return (
    <div style={{ maxWidth: 1400 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
        <div>
          <Title level={4} style={{ margin: 0, color: '#1a2b3c' }}>Каталог датасетов</Title>
          <Text style={{ color: '#6b7a8d', fontSize: 13 }}>
            Централизованный репозиторий медицинских данных
          </Text>
        </div>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => setCreateOpen(true)}
          style={{ height: 38, fontWeight: 500 }}
        >
          Загрузить датасет
        </Button>
      </div>

      <Card style={{ borderRadius: 10, border: '1px solid #d9e2ec', marginBottom: 16 }} styles={{ body: { padding: 16 } }}>
        <Row gutter={12} align="middle">
          <Col flex="1">
            <Input
              prefix={<SearchOutlined style={{ color: '#9aa5b4' }} />}
              placeholder="Поиск по названию, тегам, описанию..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ borderRadius: 8 }}
            />
          </Col>
          <Col>
            <Select
              placeholder="Тип"
              allowClear
              style={{ width: 150 }}
              value={typeFilter}
              onChange={(v) => { setTypeFilter(v); setPage(1) }}
              options={Object.entries(typeLabels).map(([v, l]) => ({ label: l, value: v }))}
            />
          </Col>
          <Col>
            <Select
              placeholder="Статус"
              allowClear
              style={{ width: 140 }}
              value={statusFilter}
              onChange={(v) => { setStatusFilter(v); setPage(1) }}
              options={Object.entries(statusLabels).map(([v, l]) => ({ label: l, value: v }))}
            />
          </Col>
          <Col>
            <Button icon={<FilterOutlined />} style={{ borderRadius: 8, borderColor: '#d9e2ec', color: '#6b7a8d' }}>
              Фильтры
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
            pageSize: 10,
            total: data?.totalElements ?? 0,
            onChange: setPage,
            showSizeChanger: false,
            showTotal: (total) => `Всего ${total} датасетов`,
          }}
          size="middle"
        />
      </Card>

      {/* Создание датасета */}
      <Modal
        title="Новый датасет"
        open={createOpen}
        onCancel={() => setCreateOpen(false)}
        footer={null}
        width={520}
      >
        <Form layout="vertical" requiredMark={false} form={form} onFinish={handleCreate}>
          <Form.Item label="Название" name="name" rules={[{ required: true }]}>
            <Input placeholder="Уникальное название датасета" />
          </Form.Item>
          <Form.Item label="Описание" name="description">
            <Input.TextArea rows={2} placeholder="Краткое описание содержимого" />
          </Form.Item>
          <Row gutter={12}>
            <Col span={12}>
              <Form.Item label="Тип" name="type" rules={[{ required: true }]}>
                <Select
                  options={Object.entries(typeLabels).map(([v, l]) => ({ label: l, value: v }))}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Теги" name="tags">
                <Select mode="tags" placeholder="Добавьте теги" />
              </Form.Item>
            </Col>
          </Row>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
            <Button onClick={() => setCreateOpen(false)}>Отмена</Button>
            <Button type="primary" htmlType="submit" loading={createMutation.isPending}>
              Создать
            </Button>
          </div>
        </Form>
      </Modal>

      {/* Загрузка файла */}
      <Modal
        title="Загрузить файл"
        open={uploadOpen}
        onCancel={() => { setUploadOpen(false); setCreatedId(null); setSelectedFile(null) }}
        footer={null}
        width={520}
      >
        <Divider style={{ margin: '8px 0 16px' }} />
        <Upload.Dragger
          maxCount={1}
          beforeUpload={(file) => { setSelectedFile(file); return false }}
          style={{ borderColor: '#d9e2ec', borderRadius: 8, background: '#f5f7fa' }}
        >
          <p style={{ fontSize: 28, color: '#45688e', marginBottom: 8 }}>
            <UploadOutlined />
          </p>
          <p style={{ fontSize: 13, color: '#1a2b3c', fontWeight: 500 }}>Перетащите файл или нажмите для выбора</p>
          <p style={{ fontSize: 12, color: '#9aa5b4' }}>CSV, JSON, XLSX, DICOM, NIFTI, FHIR Bundle, Parquet · до 5 ГБ</p>
        </Upload.Dragger>
        <div style={{ marginTop: 16, display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
          <Button onClick={() => { setUploadOpen(false); queryClient.invalidateQueries({ queryKey: ['datasets'] }) }}>
            Пропустить
          </Button>
          <Button
            type="primary"
            disabled={!selectedFile}
            loading={uploadMutation.isPending}
            onClick={handleUpload}
          >
            Загрузить
          </Button>
        </div>
      </Modal>
    </div>
  )
}
