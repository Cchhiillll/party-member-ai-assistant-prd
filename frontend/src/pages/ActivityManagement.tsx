import React, { useState } from 'react'
import { Card, Table, Button, Tag, Space, Modal, Form, Input, Select, DatePicker, Tabs, message } from 'antd'
import { PlusOutlined, LinkOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons'

const { TextArea } = Input

interface Activity {
  id: string
  name: string
  type: 'committee' | 'members' | 'study' | 'other'
  date: string
  location: string
  status: 'planned' | 'ongoing' | 'completed'
  relatedCount: number
}

const ActivityManagement: React.FC = () => {
  const [activeTab, setActiveTab] = useState('1')
  const [modalVisible, setModalVisible] = useState(false)
  const [form] = Form.useForm()

  const activities: Activity[] = [
    {
      id: '1',
      name: '支委会 - 确认入党积极分子',
      type: 'committee',
      date: '2026-02-28',
      location: '支部会议室',
      status: 'planned',
      relatedCount: 3,
    },
    {
      id: '2',
      name: '党员大会 - 接收预备党员',
      type: 'members',
      date: '2026-03-05',
      location: '党员活动室',
      status: 'planned',
      relatedCount: 5,
    },
    {
      id: '3',
      name: '党课学习 - 两会精神',
      type: 'study',
      date: '2026-02-20',
      location: '线上',
      status: 'completed',
      relatedCount: 20,
    },
  ]

  const getStatusTag = (status: string) => {
    switch (status) {
      case 'planned':
        return <Tag color="blue">待开展</Tag>
      case 'ongoing':
        return <Tag color="orange">进行中</Tag>
      case 'completed':
        return <Tag color="success">已完成</Tag>
      default:
        return null
    }
  }

  const getTypeTag = (type: string) => {
    switch (type) {
      case 'committee':
        return <Tag>支委会</Tag>
      case 'members':
        return <Tag color="purple">党员大会</Tag>
      case 'study':
        return <Tag color="green">党课学习</Tag>
      default:
        return <Tag>其他</Tag>
    }
  }

  const columns = [
    {
      title: '活动名称',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '类型',
      dataIndex: 'type',
      key: 'type',
      render: (type: string) => getTypeTag(type),
    },
    {
      title: '时间',
      dataIndex: 'date',
      key: 'date',
    },
    {
      title: '地点',
      dataIndex: 'location',
      key: 'location',
    },
    {
      title: '关联人员',
      dataIndex: 'relatedCount',
      key: 'relatedCount',
      render: (count: number) => `${count}人`,
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => getStatusTag(status),
    },
    {
      title: '操作',
      key: 'action',
      render: (_: any, record: Activity) => (
        <Space>
          <Button size="small" type="link" icon={<EditOutlined />}>编辑</Button>
          <Button size="small" type="link" icon={<LinkOutlined />}>关联</Button>
          <Button size="small" type="link" danger icon={<DeleteOutlined />}>删除</Button>
        </Space>
      ),
    },
  ]

  const handleGenerateIntro = () => {
    message.success('活动简介已生成！可采纳或编辑')
  }

  const tabItems = [
    {
      key: '1',
      label: '全部活动',
      children: (
        <Table columns={columns} dataSource={activities} pagination={false} rowKey="id" />
      ),
    },
    {
      key: '2',
      label: '支委会',
      children: (
        <Table 
          columns={columns} 
          dataSource={activities.filter(a => a.type === 'committee')} 
          pagination={false} 
          rowKey="id" 
        />
      ),
    },
    {
      key: '3',
      label: '党员大会',
      children: (
        <Table 
          columns={columns} 
          dataSource={activities.filter(a => a.type === 'members')} 
          pagination={false} 
          rowKey="id" 
        />
      ),
    },
    {
      key: '4',
      label: '党课学习',
      children: (
        <Table 
          columns={columns} 
          dataSource={activities.filter(a => a.type === 'study')} 
          pagination={false} 
          rowKey="id" 
        />
      ),
    },
  ]

  return (
    <div>
      <Card
        title="活动管理"
        extra={
          <Button type="primary" icon={<PlusOutlined />} onClick={() => setModalVisible(true)}>
            新建活动
          </Button>
        }
      >
        <Tabs activeKey={activeTab} onChange={setActiveTab} items={tabItems} />
      </Card>

      <Card title="AI 辅助功能" style={{ marginTop: 16 }}>
        <Space direction="vertical" style={{ width: '100%' }}>
          <div>
            <h4>活动简介生成</h4>
            <p>基于活动主题和时间自动生成活动简介</p>
            <Space>
              <Input placeholder="输入活动主题" style={{ width: 300 }} defaultValue="支委会 - 确认入党积极分子" />
              <DatePicker />
              <Button type="primary" onClick={handleGenerateIntro}>生成简介</Button>
            </Space>
          </div>
          
          <div style={{ marginTop: 16 }}>
            <h4>智能匹配</h4>
            <p>基于已有活动智能匹配关联</p>
            <Space>
              <Button icon={<LinkOutlined />}>查看可关联活动</Button>
            </Space>
          </div>
        </Space>
      </Card>

      <Modal
        title="新建活动"
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        onOk={() => {
          form.validateFields().then(() => {
            message.success('活动创建成功！')
            setModalVisible(false)
            form.resetFields()
          })
        }}
      >
        <Form form={form} layout="vertical">
          <Form.Item name="name" label="活动名称" rules={[{ required: true }]}>
            <Input placeholder="请输入活动名称" />
          </Form.Item>
          
          <Form.Item name="type" label="活动类型" rules={[{ required: true }]}>
            <Select placeholder="选择活动类型">
              <Select.Option value="committee">支委会</Select.Option>
              <Select.Option value="members">党员大会</Select.Option>
              <Select.Option value="study">党课学习</Select.Option>
              <Select.Option value="other">其他</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item name="date" label="活动时间" rules={[{ required: true }]}>
            <DatePicker style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item name="location" label="活动地点">
            <Input placeholder="请输入活动地点" />
          </Form.Item>

          <Form.Item name="description" label="活动简介">
            <TextArea rows={3} placeholder="请输入活动简介..." />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}

export default ActivityManagement
