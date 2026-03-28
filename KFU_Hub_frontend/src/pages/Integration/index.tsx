import {
  Card, Table, Button, Typography, Tag, Space, Modal, Form, Input, Select,
  Switch, Tooltip, message, Row, Col,
} from 'antd'
import {
  PlusOutlined, SyncOutlined, DeleteOutlined, LinkOutlined,
} from '@ant-design/icons'
import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { integrationApi, type ExternalSystem, type SystemType } from '@/api/integration'
import dayjs from 'dayjs'

const { Title, Text } = Typography

const typeColors: Record<SystemType, string> = {
  FHIR: 'geekblue',
  HL7: 'blue',
  DICOM: 'volcano',
  CSV: 'green',
  REST_API: 'purple',
  DATABASE: 'cyan',
}


export default function IntegrationPage() {
  const queryClient = useQueryClient()
  const [createOpen, setCreateOpen] = useState(false)
  const [form] = Form.useForm()

  const { data, isLoading } = useQuery({
    queryKey: ['integration-systems'],
    queryFn: () => integrationApi.listSystems({ page: 0, size: 20 }),
  })

  const createMutation = useMutation({
    mutationFn: integrationApi.createSystem,
    onSuccess: () => {
      message.success('Система добавлена')
      setCreateOpen(false)
      form.resetFields()
      queryClient.invalidateQueries({ queryKey: ['integration-systems'] })
    },
    onError: () => message.error('Ошибка создания системы'),
  })

  const deleteMutation = useMutation({
    mutationFn: integrationApi.deleteSystem,
    onSuccess: () => {
      message.success('Система удалена')
      queryClient.invalidateQueries({ queryKey: ['integration-systems'] })
    },
  })

  const syncMutation = useMutation({
    mutationFn: integrationApi.triggerSync,
    onSuccess: () => message.success('Синхронизация запущена'),
    onError: () => message.error('Не удалось запустить синхронизацию'),
  })

  const columns = [
    {
      title: 'Система',
      dataIndex: 'name',
      render: (name: string, row: ExternalSystem) => (
        <div>
          <Text strong style={{ fontSize: 13 }}>{name}</Text>
          <br />
          <Text style={{ fontSize: 12, color: '#6b7a8d' }}>{row.description}</Text>
        </div>
      ),
    },
    {
      title: 'Тип',
      dataIndex: 'type',
      width: 100,
      render: (t: SystemType) => (
        <Tag color={typeColors[t] ?? 'default'} style={{ borderRadius: 20, fontSize: 11 }}>{t}</Tag>
      ),
    },
    {
      title: 'URL',
      dataIndex: 'baseUrl',
      render: (url: string) => (
        <Text style={{ fontSize: 12, color: '#45688e', fontFamily: 'monospace' }}>{url}</Text>
      ),
    },
    {
      title: 'Активна',
      dataIndex: 'isActive',
      width: 80,
      render: (v: boolean) => <Switch checked={v} size="small" disabled />,
    },
    {
      title: 'Создана',
      dataIndex: 'createdAt',
      width: 110,
      render: (d: string) => (
        <Text style={{ fontSize: 12, color: '#9aa5b4' }}>{d ? dayjs(d).format('DD.MM.YYYY') : '—'}</Text>
      ),
    },
    {
      title: '',
      key: 'actions',
      width: 100,
      render: (_: any, row: ExternalSystem) => (
        <Space>
          <Tooltip title="Синхронизировать">
            <Button
              size="small"
              icon={<SyncOutlined />}
              style={{ border: 'none', color: '#45688e', background: '#eef2f7' }}
              loading={syncMutation.isPending}
              onClick={() => syncMutation.mutate(row.id)}
            />
          </Tooltip>
          <Tooltip title="Удалить">
            <Button
              size="small"
              icon={<DeleteOutlined />}
              style={{ border: 'none', color: '#f5222d', background: '#fff1f0' }}
              onClick={() => deleteMutation.mutate(row.id)}
            />
          </Tooltip>
        </Space>
      ),
    },
  ]

  return (
    <div style={{ maxWidth: 1200 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
        <div>
          <Title level={4} style={{ margin: 0, color: '#1a2b3c' }}>Интеграции</Title>
          <Text style={{ color: '#6b7a8d', fontSize: 13 }}>
            Подключение внешних медицинских систем: FHIR, HL7, DICOM и других
          </Text>
        </div>
        <Button type="primary" icon={<PlusOutlined />} style={{ height: 38, fontWeight: 500 }} onClick={() => setCreateOpen(true)}>
          Добавить систему
        </Button>
      </div>

      <Card style={{ borderRadius: 10, border: '1px solid #d9e2ec' }} styles={{ body: { padding: 0 } }}>
        <Table
          dataSource={data?.content ?? []}
          rowKey="id"
          columns={columns}
          loading={isLoading}
          pagination={{
            pageSize: 10,
            total: data?.totalElements ?? 0,
            showTotal: (total) => `Всего ${total} систем`,
          }}
          size="middle"
        />
      </Card>

      <Modal
        title="Добавить внешнюю систему"
        open={createOpen}
        onCancel={() => setCreateOpen(false)}
        footer={null}
        width={520}
      >
        <Form
          layout="vertical"
          requiredMark={false}
          form={form}
          onFinish={(v) => createMutation.mutate({ ...v, isActive: v.isActive ?? true })}
        >
          <Form.Item label="Название" name="name" rules={[{ required: true }]}>
            <Input placeholder="Название системы" />
          </Form.Item>
          <Form.Item label="Описание" name="description">
            <Input.TextArea rows={2} />
          </Form.Item>
          <Row gutter={12}>
            <Col span={12}>
              <Form.Item label="Тип" name="type" rules={[{ required: true }]}>
                <Select
                  options={['FHIR', 'HL7', 'DICOM', 'CSV', 'REST_API', 'DATABASE'].map((v) => ({ label: v, value: v }))}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Активна" name="isActive" valuePropName="checked" initialValue={true}>
                <Switch />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item label="Base URL" name="baseUrl" rules={[{ required: true }]}>
            <Input prefix={<LinkOutlined />} placeholder="https://fhir.example.com/api" />
          </Form.Item>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
            <Button onClick={() => setCreateOpen(false)}>Отмена</Button>
            <Button type="primary" htmlType="submit" loading={createMutation.isPending}>Добавить</Button>
          </div>
        </Form>
      </Modal>
    </div>
  )
}
