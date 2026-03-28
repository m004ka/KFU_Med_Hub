import {
  Card, Row, Col, Select, Button, Typography, Tag, Space,
  Table, Progress, Steps, Form, Input, Divider, Empty, Tooltip, message,
} from 'antd'
import {
  ExperimentOutlined, PlayCircleOutlined, PauseCircleOutlined,
  CheckCircleOutlined, CloseCircleOutlined, FileTextOutlined,
  StopOutlined,
} from '@ant-design/icons'
import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { aiApi, type TaskType, type TaskStatus, type AnalysisTask } from '@/api/ai'
import { datasetsApi } from '@/api/datasets'
import dayjs from 'dayjs'

const { Title, Text, Paragraph } = Typography

interface AITaskMeta {
  id: TaskType
  name: string
  description: string
  model: string
  framework: string
  inputFormats: string[]
  color: string
}

const taskTypes: AITaskMeta[] = [
  { id: 'CLASSIFICATION', name: 'Классификация МКБ-11', description: 'Автоматическая классификация диагнозов по тексту истории болезни', model: 'Multiclass Classifier', framework: 'Scikit-learn / PyTorch', inputFormats: ['CSV', 'FHIR', 'JSON'], color: '#45688e' },
  { id: 'IMAGE_ANALYSIS', name: 'Анализ рентгеновских снимков', description: 'Детекция патологий лёгких и костей, предварительный скрининг', model: 'CNN (ResNet, EfficientNet)', framework: 'TensorFlow / ONNX', inputFormats: ['DICOM'], color: '#722ed1' },
  { id: 'NLP', name: 'NLP историй болезней', description: 'Извлечение клинических сущностей, суммаризация выписок', model: 'BERT (ruBERT, MedBERT-ru)', framework: 'Hugging Face', inputFormats: ['JSON', 'FHIR', 'CSV'], color: '#fa8c16' },
  { id: 'ANOMALY_DETECTION', name: 'Анализ лабораторных данных', description: 'Выявление отклонений в результатах анализов, трендовый анализ', model: 'Anomaly Detection', framework: 'Scikit-learn', inputFormats: ['CSV', 'XLSX', 'JSON'], color: '#52c41a' },
  { id: 'REGRESSION', name: 'Предиктивная аналитика рисков', description: 'Оценка риска осложнений, ранняя диагностика хронических заболеваний', model: 'Gradient Boosting (XGBoost)', framework: 'PyTorch / XGBoost', inputFormats: ['CSV', 'FHIR'], color: '#f5222d' },
  { id: 'CLUSTERING', name: 'Кластеризация пациентов', description: 'Группировка пациентов по схожим клиническим профилям', model: 'K-Means / DBSCAN', framework: 'Scikit-learn', inputFormats: ['CSV', 'JSON'], color: '#13c2c2' },
  { id: 'SURVIVAL_ANALYSIS', name: 'Анализ выживаемости', description: 'Построение кривых выживаемости, анализ Kaplan-Meier', model: 'Cox PH / Random Survival Forest', framework: 'Lifelines / PyTorch', inputFormats: ['CSV', 'FHIR'], color: '#eb2f96' },
]

const statusConfig: Record<TaskStatus, { label: string; color: string; icon: React.ReactNode }> = {
  PENDING:   { label: 'Ожидание',    color: 'default',    icon: <PauseCircleOutlined /> },
  RUNNING:   { label: 'Выполняется', color: 'processing', icon: <ExperimentOutlined /> },
  COMPLETED: { label: 'Завершено',   color: 'success',    icon: <CheckCircleOutlined /> },
  FAILED:    { label: 'Ошибка',      color: 'error',      icon: <CloseCircleOutlined /> },
  CANCELLED: { label: 'Отменено',    color: 'warning',    icon: <StopOutlined /> },
}

export default function AIPage() {
  const queryClient = useQueryClient()
  const [selectedTaskType, setSelectedTaskType] = useState<TaskType | null>(null)
  const [selectedDataset, setSelectedDataset] = useState<string | null>(null)
  const [taskName, setTaskName] = useState('')
  const [step, setStep] = useState(0)

  const { data: tasksData, isLoading } = useQuery({
    queryKey: ['ai-tasks'],
    queryFn: () => aiApi.list({ page: 0, size: 20 }),
    refetchInterval: 5_000,
  })

  const { data: datasetsData } = useQuery({
    queryKey: ['datasets-select'],
    queryFn: () => datasetsApi.list({ page: 0, size: 50 }),
  })

  const createMutation = useMutation({
    mutationFn: aiApi.create,
    onSuccess: () => {
      message.success('Задача запущена')
      setStep(0)
      setSelectedTaskType(null)
      setSelectedDataset(null)
      setTaskName('')
      queryClient.invalidateQueries({ queryKey: ['ai-tasks'] })
    },
    onError: () => message.error('Не удалось создать задачу'),
  })

  const cancelMutation = useMutation({
    mutationFn: aiApi.cancel,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['ai-tasks'] }),
  })

  const selected = taskTypes.find((t) => t.id === selectedTaskType)

  const handleLaunch = () => {
    if (!selectedTaskType || !selectedDataset) return
    createMutation.mutate({
      name: taskName || selected?.name || selectedTaskType,
      taskType: selectedTaskType,
      datasetId: selectedDataset,
    })
  }

  const jobColumns = [
    {
      title: 'Задача',
      dataIndex: 'name',
      render: (name: string, row: AnalysisTask) => (
        <div>
          <Text strong style={{ fontSize: 13 }}>{name}</Text>
          <br />
          <Text style={{ fontSize: 11, color: '#6b7a8d' }}>{row.taskType}</Text>
        </div>
      ),
    },
    {
      title: 'Датасет',
      dataIndex: 'datasetName',
      render: (d: string) => <Text style={{ fontSize: 12, color: '#45688e', fontFamily: 'monospace' }}>{d}</Text>,
    },
    {
      title: 'Статус / Прогресс',
      dataIndex: 'status',
      width: 200,
      render: (s: TaskStatus, row: AnalysisTask) => {
        const cfg = statusConfig[s] ?? { label: s, color: 'default', icon: null }
        return (
          <div>
            <Tag icon={cfg.icon} color={cfg.color} style={{ borderRadius: 20, fontSize: 11, marginBottom: 4 }}>
              {cfg.label}
            </Tag>
            {s === 'RUNNING' && (
              <Progress percent={row.progress ?? 0} strokeColor="#45688e" size="small" showInfo={false} />
            )}
          </div>
        )
      },
    },
    {
      title: 'Запущен',
      dataIndex: 'createdAt',
      width: 90,
      render: (t: string) => <Text style={{ fontSize: 12, color: '#9aa5b4' }}>{t ? dayjs(t).format('HH:mm') : '—'}</Text>,
    },
    {
      title: '',
      key: 'actions',
      width: 80,
      render: (_: unknown, row: AnalysisTask) => (
        <Space>
          {row.status === 'COMPLETED' && (
            <Tooltip title="Отчёт">
              <Button size="small" icon={<FileTextOutlined />} style={{ border: 'none', color: '#6b7a8d', background: '#f5f7fa' }} />
            </Tooltip>
          )}
          {(row.status === 'RUNNING' || row.status === 'PENDING') && (
            <Tooltip title="Отменить">
              <Button
                size="small"
                icon={<StopOutlined />}
                style={{ border: 'none', color: '#f5222d', background: '#fff1f0' }}
                onClick={() => cancelMutation.mutate(row.id)}
              />
            </Tooltip>
          )}
        </Space>
      ),
    },
  ]

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
                      onClick={() => setSelectedTaskType(task.id)}
                      style={{
                        padding: '12px 14px',
                        borderRadius: 8,
                        border: `1px solid ${selectedTaskType === task.id ? task.color : '#d9e2ec'}`,
                        background: selectedTaskType === task.id ? `${task.color}08` : '#fff',
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
                  disabled={!selectedTaskType}
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
                <Form.Item label="Название задачи">
                  <Input
                    placeholder={selected.name}
                    value={taskName}
                    onChange={(e) => setTaskName(e.target.value)}
                  />
                </Form.Item>
                <Form.Item label="Датасет" required>
                  <Select
                    placeholder="Выберите датасет"
                    value={selectedDataset}
                    onChange={setSelectedDataset}
                    options={(datasetsData?.content ?? []).map((d) => ({
                      label: d.name,
                      value: d.id,
                    }))}
                  />
                </Form.Item>
                <div style={{ display: 'flex', gap: 8 }}>
                  <Button style={{ flex: 1 }} onClick={() => setStep(0)}>Назад</Button>
                  <Button
                    type="primary"
                    style={{ flex: 2 }}
                    disabled={!selectedDataset}
                    onClick={() => setStep(2)}
                  >
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
                  Задача «{taskName || selected.name}» будет добавлена в очередь. Вы получите уведомление по завершении.
                </Paragraph>
                <Divider />
                <div style={{ display: 'flex', gap: 8 }}>
                  <Button style={{ flex: 1 }} onClick={() => { setStep(0); setSelectedTaskType(null) }}>Отмена</Button>
                  <Button
                    type="primary"
                    icon={<PlayCircleOutlined />}
                    style={{ flex: 2, height: 38 }}
                    loading={createMutation.isPending}
                    onClick={handleLaunch}
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
            {!isLoading && (tasksData?.content ?? []).length === 0 ? (
              <Empty description="Нет запущенных задач" style={{ padding: 40 }} />
            ) : (
              <Table
                dataSource={tasksData?.content ?? []}
                rowKey="id"
                columns={jobColumns}
                loading={isLoading}
                pagination={{
                  pageSize: 10,
                  total: tasksData?.totalElements ?? 0,
                  showTotal: (total) => `Всего ${total}`,
                }}
                size="middle"
              />
            )}
          </Card>
        </Col>
      </Row>
    </div>
  )
}
