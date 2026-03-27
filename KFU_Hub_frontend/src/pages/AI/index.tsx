import {
  Card, Row, Col, Select, Button, Typography, Tag, Space,
  Table, Progress, Steps, Form, Divider, Empty, Tooltip,
} from 'antd'
import {
  ExperimentOutlined, PlayCircleOutlined, PauseCircleOutlined,
  CheckCircleOutlined, CloseCircleOutlined, FileTextOutlined,
  DownloadOutlined,
} from '@ant-design/icons'
import { useState } from 'react'

const { Title, Text, Paragraph } = Typography

interface AITaskType {
  id: string
  name: string
  description: string
  model: string
  framework: string
  inputFormats: string[]
  color: string
}

const taskTypes: AITaskType[] = [
  { id: 'icd11', name: 'Классификация МКБ-11', description: 'Автоматическая классификация диагнозов по тексту истории болезни', model: 'Multiclass Classifier', framework: 'Scikit-learn / PyTorch', inputFormats: ['CSV', 'FHIR', 'JSON'], color: '#45688e' },
  { id: 'xray', name: 'Анализ рентгеновских снимков', description: 'Детекция патологий лёгких и костей, предварительный скрининг', model: 'CNN (ResNet, EfficientNet)', framework: 'TensorFlow / ONNX', inputFormats: ['DICOM'], color: '#722ed1' },
  { id: 'nlp', name: 'NLP историй болезней', description: 'Извлечение клинических сущностей, суммаризация выписок', model: 'BERT (ruBERT, MedBERT-ru)', framework: 'Hugging Face', inputFormats: ['JSON', 'FHIR', 'CSV'], color: '#fa8c16' },
  { id: 'lab', name: 'Анализ лабораторных данных', description: 'Выявление отклонений в результатах анализов, трендовый анализ', model: 'Regression / Anomaly Detection', framework: 'Scikit-learn', inputFormats: ['CSV', 'XLSX', 'JSON'], color: '#52c41a' },
  { id: 'risk', name: 'Предиктивная аналитика рисков', description: 'Оценка риска осложнений, ранняя диагностика хронических заболеваний', model: 'Gradient Boosting (XGBoost)', framework: 'PyTorch / XGBoost', inputFormats: ['CSV', 'FHIR'], color: '#f5222d' },
  { id: 'mri', name: 'Обработка МРТ/КТ', description: 'Сегментация органов и опухолей, поддержка планирования лечения', model: 'U-Net Segmentation', framework: 'PyTorch / ONNX', inputFormats: ['NIFTI', 'DICOM'], color: '#13c2c2' },
]

type JobStatus = 'pending' | 'running' | 'completed' | 'failed'

interface Job {
  key: number
  type: string
  dataset: string
  status: JobStatus
  progress: number
  created: string
  duration: string
}

const jobs: Job[] = [
  { key: 1, type: 'Классификация МКБ-11', dataset: 'patient_records_fhir', status: 'running', progress: 67, created: '10:42', duration: '8 мин' },
  { key: 2, type: 'Анализ рентгеновских снимков', dataset: 'chest_xray_dataset_v2', status: 'completed', progress: 100, created: '09:15', duration: '23 мин' },
  { key: 3, type: 'NLP историй болезней', dataset: 'patient_records_fhir', status: 'pending', progress: 0, created: '10:55', duration: '—' },
  { key: 4, type: 'Анализ лабораторных данных', dataset: 'lab_results_2025_q4', status: 'failed', progress: 34, created: '08:30', duration: '12 мин' },
]

const statusConfig: Record<JobStatus, { label: string; color: string; icon: React.ReactNode }> = {
  pending:   { label: 'Ожидание',  color: 'default', icon: <PauseCircleOutlined /> },
  running:   { label: 'Выполняется', color: 'processing', icon: <ExperimentOutlined /> },
  completed: { label: 'Завершено', color: 'success', icon: <CheckCircleOutlined /> },
  failed:    { label: 'Ошибка',    color: 'error', icon: <CloseCircleOutlined /> },
}

const jobColumns = [
  {
    title: 'Тип анализа',
    dataIndex: 'type',
    render: (t: string) => <Text strong style={{ fontSize: 13 }}>{t}</Text>,
  },
  {
    title: 'Датасет',
    dataIndex: 'dataset',
    render: (d: string) => <Text style={{ fontSize: 12, color: '#45688e', fontFamily: 'monospace' }}>{d}</Text>,
  },
  {
    title: 'Статус / Прогресс',
    dataIndex: 'status',
    width: 200,
    render: (s: JobStatus, row: Job) => (
      <div>
        <Tag
          icon={statusConfig[s].icon}
          color={statusConfig[s].color}
          style={{ borderRadius: 20, fontSize: 11, marginBottom: 4 }}
        >
          {statusConfig[s].label}
        </Tag>
        {s === 'running' && (
          <Progress percent={row.progress} strokeColor="#45688e" size="small" showInfo={false} />
        )}
      </div>
    ),
  },
  { title: 'Запущен', dataIndex: 'created', width: 80, render: (t: string) => <Text style={{ fontSize: 12, color: '#9aa5b4' }}>{t}</Text> },
  { title: 'Время', dataIndex: 'duration', width: 80, render: (d: string) => <Text style={{ fontSize: 12, color: '#6b7a8d' }}>{d}</Text> },
  {
    title: '',
    key: 'actions',
    width: 80,
    render: (_: unknown, row: Job) => (
      <Space>
        {row.status === 'completed' && (
          <Tooltip title="Скачать результат">
            <Button size="small" icon={<DownloadOutlined />} style={{ border: 'none', color: '#45688e', background: '#eef2f7' }} />
          </Tooltip>
        )}
        {row.status === 'completed' && (
          <Tooltip title="Отчёт">
            <Button size="small" icon={<FileTextOutlined />} style={{ border: 'none', color: '#6b7a8d', background: '#f5f7fa' }} />
          </Tooltip>
        )}
      </Space>
    ),
  },
]

export default function AIPage() {
  const [selectedTask, setSelectedTask] = useState<string | null>(null)
  const [step, setStep] = useState(0)

  const selected = taskTypes.find((t) => t.id === selectedTask)

  return (
    <div style={{ maxWidth: 1400 }}>
      <div style={{ marginBottom: 24 }}>
        <Title level={4} style={{ margin: 0, color: '#1a2b3c' }}>ИИ-анализ</Title>
        <Text style={{ color: '#6b7a8d', fontSize: 13 }}>
          Запуск задач машинного обучения без программирования
        </Text>
      </div>

      <Row gutter={[16, 16]}>
        <Col xs={24} xl={10}>
          <Card
            title={<Text strong style={{ fontSize: 14 }}>Новая задача</Text>}
            style={{ borderRadius: 10, border: '1px solid #d9e2ec', marginBottom: 16 }}
          >
            <Steps
              current={step}
              size="small"
              style={{ marginBottom: 24 }}
              items={[
                { title: 'Тип анализа' },
                { title: 'Датасет' },
                { title: 'Запуск' },
              ]}
            />

            {step === 0 && (
              <>
                <Text style={{ fontSize: 12, color: '#6b7a8d', display: 'block', marginBottom: 12 }}>
                  Выберите сценарий ИИ-анализа:
                </Text>
                <Space direction="vertical" style={{ width: '100%' }} size={8}>
                  {taskTypes.map((task) => (
                    <div
                      key={task.id}
                      onClick={() => setSelectedTask(task.id)}
                      style={{
                        padding: '12px 14px',
                        borderRadius: 8,
                        border: `1px solid ${selectedTask === task.id ? task.color : '#d9e2ec'}`,
                        background: selectedTask === task.id ? `${task.color}08` : '#fff',
                        cursor: 'pointer',
                        transition: 'all .15s',
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Text strong style={{ fontSize: 13, color: '#1a2b3c' }}>{task.name}</Text>
                        <Space size={4}>
                          {task.inputFormats.slice(0, 2).map((f) => (
                            <Tag key={f} style={{ fontSize: 10, borderRadius: 20, margin: 0 }}>{f}</Tag>
                          ))}
                        </Space>
                      </div>
                      <Text style={{ fontSize: 12, color: '#6b7a8d' }}>{task.description}</Text>
                    </div>
                  ))}
                </Space>
                <Button
                  type="primary"
                  block
                  disabled={!selectedTask}
                  style={{ marginTop: 16, height: 38 }}
                  onClick={() => setStep(1)}
                >
                  Далее
                </Button>
              </>
            )}

            {step === 1 && selected && (
              <Form layout="vertical" requiredMark={false}>
                <div
                  style={{
                    padding: '10px 12px',
                    background: `${selected.color}0d`,
                    borderRadius: 8,
                    border: `1px solid ${selected.color}30`,
                    marginBottom: 16,
                  }}
                >
                  <Text strong style={{ fontSize: 13, color: selected.color }}>{selected.name}</Text>
                  <br />
                  <Text style={{ fontSize: 11, color: '#6b7a8d' }}>
                    {selected.framework} · {selected.model}
                  </Text>
                </div>
                <Form.Item label="Датасет" required>
                  <Select
                    placeholder="Выберите датасет"
                    options={[
                      { label: 'lab_results_2025_q4', value: '1' },
                      { label: 'chest_xray_dataset_v2', value: '2' },
                      { label: 'patient_records_fhir', value: '3' },
                    ]}
                  />
                </Form.Item>
                <Form.Item label="Параметры (опционально)" name="params">
                  <Select
                    mode="multiple"
                    placeholder="Выберите поля для анализа"
                    allowClear
                  />
                </Form.Item>
                <div style={{ display: 'flex', gap: 8 }}>
                  <Button style={{ flex: 1 }} onClick={() => setStep(0)}>Назад</Button>
                  <Button type="primary" style={{ flex: 2 }} onClick={() => setStep(2)}>
                    Далее
                  </Button>
                </div>
              </Form>
            )}

            {step === 2 && selected && (
              <div style={{ textAlign: 'center', padding: '16px 0' }}>
                <div style={{ fontSize: 48, marginBottom: 12 }}>🚀</div>
                <Title level={5} style={{ color: '#1a2b3c' }}>Готово к запуску</Title>
                <Paragraph style={{ color: '#6b7a8d', fontSize: 13 }}>
                  Задача «{selected.name}» будет добавлена в очередь. Вы получите уведомление по завершении.
                </Paragraph>
                <Divider />
                <div style={{ display: 'flex', gap: 8 }}>
                  <Button style={{ flex: 1 }} onClick={() => { setStep(0); setSelectedTask(null) }}>Отмена</Button>
                  <Button type="primary" icon={<PlayCircleOutlined />} style={{ flex: 2, height: 38 }}
                    onClick={() => { setStep(0); setSelectedTask(null) }}
                  >
                    Запустить анализ
                  </Button>
                </div>
              </div>
            )}
          </Card>
        </Col>

        <Col xs={24} xl={14}>
          <Card
            title={<Text strong style={{ fontSize: 14 }}>История задач</Text>}
            style={{ borderRadius: 10, border: '1px solid #d9e2ec' }}
            styles={{ body: { padding: 0 } }}
          >
            {jobs.length === 0 ? (
              <Empty description="Нет запущенных задач" style={{ padding: 40 }} />
            ) : (
              <Table dataSource={jobs} columns={jobColumns} pagination={false} size="middle" />
            )}
          </Card>
        </Col>
      </Row>
    </div>
  )
}
