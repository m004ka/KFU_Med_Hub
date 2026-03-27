import {
  Card, Input, Table, Tag, Button, Space, Typography,
  Select, Row, Col, Tooltip, Upload, Modal, Form, Divider,
} from 'antd'
import {
  SearchOutlined, UploadOutlined, DownloadOutlined,
  EyeOutlined, FilterOutlined, PlusOutlined,
} from '@ant-design/icons'
import { useState } from 'react'

const { Title, Text } = Typography

type DatasetFormat = 'CSV' | 'JSON' | 'XLSX' | 'DICOM' | 'NIFTI' | 'FHIR' | 'Parquet'
type AccessLevel = 'public' | 'group' | 'private'

interface Dataset {
  key: number
  name: string
  description: string
  format: DatasetFormat
  size: string
  records: number
  tags: string[]
  access: AccessLevel
  owner: string
  updated: string
}

const mockData: Dataset[] = [
  { key: 1, name: 'lab_results_2025_q4', description: 'Результаты лаб. анализов 4 кв. 2025', format: 'CSV', size: '12 МБ', records: 45820, tags: ['лаборатория', 'анализы'], access: 'group', owner: 'Иванова М.С.', updated: '12.03.2026' },
  { key: 2, name: 'chest_xray_dataset_v2', description: 'Рентгеновские снимки грудной клетки', format: 'DICOM', size: '4.2 ГБ', records: 1240, tags: ['рентген', 'лёгкие', 'DICOM'], access: 'private', owner: 'Петров А.Н.', updated: '08.03.2026' },
  { key: 3, name: 'patient_records_fhir', description: 'Истории болезней в формате HL7 FHIR R4', format: 'FHIR', size: '890 МБ', records: 9800, tags: ['FHIR', 'истории болезней'], access: 'private', owner: 'Сидорова Е.В.', updated: '01.03.2026' },
  { key: 4, name: 'blood_pressure_monitoring', description: 'Мониторинг АД за 2024 год', format: 'CSV', size: '3 МБ', records: 120000, tags: ['кардиология', 'мониторинг'], access: 'public', owner: 'Козлова Т.П.', updated: '25.02.2026' },
  { key: 5, name: 'mri_brain_segmentation', description: 'МРТ снимки головного мозга для сегментации', format: 'NIFTI', size: '18 ГБ', records: 340, tags: ['МРТ', 'нейрология', 'сегментация'], access: 'group', owner: 'Ахметов Р.И.', updated: '20.02.2026' },
]

const formatColors: Record<DatasetFormat, string> = {
  CSV: 'green', JSON: 'blue', XLSX: 'cyan',
  DICOM: 'volcano', NIFTI: 'purple', FHIR: 'geekblue', Parquet: 'orange',
}

const accessLabels: Record<AccessLevel, { label: string; color: string }> = {
  public: { label: 'Публичный', color: 'green' },
  group: { label: 'Группа', color: 'blue' },
  private: { label: 'Приватный', color: 'default' },
}

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
    title: 'Формат',
    dataIndex: 'format',
    width: 90,
    render: (f: DatasetFormat) => <Tag color={formatColors[f]} style={{ borderRadius: 20, fontSize: 11 }}>{f}</Tag>,
  },
  {
    title: 'Размер / Записей',
    dataIndex: 'size',
    width: 140,
    render: (size: string, row: Dataset) => (
      <div>
        <Text style={{ fontSize: 13 }}>{size}</Text>
        <br />
        <Text style={{ fontSize: 11, color: '#9aa5b4' }}>{row.records.toLocaleString('ru')} записей</Text>
      </div>
    ),
  },
  {
    title: 'Теги',
    dataIndex: 'tags',
    render: (tags: string[]) => (
      <Space size={4} wrap>
        {tags.map((t) => (
          <Tag key={t} style={{ borderRadius: 20, fontSize: 11, borderColor: '#d9e2ec', color: '#6b7a8d', background: '#f5f7fa' }}>{t}</Tag>
        ))}
      </Space>
    ),
  },
  {
    title: 'Доступ',
    dataIndex: 'access',
    width: 110,
    render: (a: AccessLevel) => (
      <Tag color={accessLabels[a].color} style={{ borderRadius: 20, fontSize: 11 }}>
        {accessLabels[a].label}
      </Tag>
    ),
  },
  {
    title: 'Владелец',
    dataIndex: 'owner',
    width: 150,
    render: (o: string) => <Text style={{ fontSize: 12, color: '#6b7a8d' }}>{o}</Text>,
  },
  {
    title: 'Обновлён',
    dataIndex: 'updated',
    width: 110,
    render: (d: string) => <Text style={{ fontSize: 12, color: '#9aa5b4' }}>{d}</Text>,
  },
  {
    title: '',
    key: 'actions',
    width: 100,
    render: () => (
      <Space>
        <Tooltip title="Просмотр">
          <Button size="small" icon={<EyeOutlined />} style={{ border: 'none', color: '#45688e', background: '#eef2f7' }} />
        </Tooltip>
        <Tooltip title="Скачать">
          <Button size="small" icon={<DownloadOutlined />} style={{ border: 'none', color: '#6b7a8d', background: '#f5f7fa' }} />
        </Tooltip>
      </Space>
    ),
  },
]

export default function DatasetsPage() {
  const [uploadOpen, setUploadOpen] = useState(false)
  const [search, setSearch] = useState('')

  const filtered = mockData.filter(
    (d) =>
      d.name.toLowerCase().includes(search.toLowerCase()) ||
      d.description.toLowerCase().includes(search.toLowerCase()) ||
      d.tags.some((t) => t.toLowerCase().includes(search.toLowerCase()))
  )

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
          onClick={() => setUploadOpen(true)}
          style={{ height: 38, fontWeight: 500 }}
        >
          Загрузить датасет
        </Button>
      </div>

      {/* Filters */}
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
              placeholder="Формат"
              allowClear
              style={{ width: 140 }}
              options={['CSV', 'JSON', 'DICOM', 'NIFTI', 'FHIR', 'XLSX', 'Parquet'].map((f) => ({ label: f, value: f }))}
            />
          </Col>
          <Col>
            <Select
              placeholder="Доступ"
              allowClear
              style={{ width: 140 }}
              options={[
                { label: 'Публичный', value: 'public' },
                { label: 'Группа', value: 'group' },
                { label: 'Приватный', value: 'private' },
              ]}
            />
          </Col>
          <Col>
            <Button icon={<FilterOutlined />} style={{ borderRadius: 8, borderColor: '#d9e2ec', color: '#6b7a8d' }}>
              Фильтры
            </Button>
          </Col>
        </Row>
      </Card>

      {/* Table */}
      <Card style={{ borderRadius: 10, border: '1px solid #d9e2ec' }} styles={{ body: { padding: 0 } }}>
        <Table
          dataSource={filtered}
          columns={columns}
          pagination={{ pageSize: 10, showSizeChanger: true, showTotal: (total) => `Всего ${total} датасетов` }}
          size="middle"
        />
      </Card>

      {/* Upload modal */}
      <Modal
        title="Загрузить датасет"
        open={uploadOpen}
        onCancel={() => setUploadOpen(false)}
        footer={null}
        width={520}
        styles={{ body: { paddingTop: 8 } }}
      >
        <Form layout="vertical" requiredMark={false}>
          <Form.Item label="Название" name="name" rules={[{ required: true }]}>
            <Input placeholder="Уникальное название датасета" />
          </Form.Item>
          <Form.Item label="Описание" name="description">
            <Input.TextArea rows={2} placeholder="Краткое описание содержимого" />
          </Form.Item>
          <Row gutter={12}>
            <Col span={12}>
              <Form.Item label="Уровень доступа" name="access">
                <Select defaultValue="private" options={[
                  { label: 'Приватный', value: 'private' },
                  { label: 'Группа', value: 'group' },
                  { label: 'Публичный', value: 'public' },
                ]} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Теги" name="tags">
                <Select mode="tags" placeholder="Добавьте теги" />
              </Form.Item>
            </Col>
          </Row>
          <Divider style={{ margin: '8px 0 16px' }} />
          <Upload.Dragger
            maxCount={1}
            style={{ borderColor: '#d9e2ec', borderRadius: 8, background: '#f5f7fa' }}
          >
            <p style={{ fontSize: 28, color: '#45688e', marginBottom: 8 }}>
              <UploadOutlined />
            </p>
            <p style={{ fontSize: 13, color: '#1a2b3c', fontWeight: 500 }}>Перетащите файл или нажмите для выбора</p>
            <p style={{ fontSize: 12, color: '#9aa5b4' }}>CSV, JSON, XLSX, DICOM, NIFTI, FHIR Bundle, Parquet · до 5 ГБ</p>
          </Upload.Dragger>
          <div style={{ marginTop: 16, display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
            <Button onClick={() => setUploadOpen(false)}>Отмена</Button>
            <Button type="primary">Загрузить</Button>
          </div>
        </Form>
      </Modal>
    </div>
  )
}
