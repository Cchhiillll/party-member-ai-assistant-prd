import React, { useState } from 'react'
import { Card, Upload, Button, Table, Tag, Space, Modal, Form, Input, Select, DatePicker, message } from 'antd'
import { InboxOutlined, PlusOutlined, FileTextOutlined, CheckOutlined, CloseOutlined } from '@ant-design/icons'
import type { UploadProps } from 'antd'

const { Dragger } = Upload

const RecordGeneration: React.FC = () => {
  const [loading, setLoading] = useState(false)
  const [generateModalVisible, setGenerateModalVisible] = useState(false)
  const [form] = Form.useForm()

  const uploadProps: UploadProps = {
    name: 'file',
    multiple: false,
    accept: '.doc,.docx,.pdf,.jpg,.png',
    beforeUpload: () => false,
  }

  const handleGenerate = async () => {
    const values = await form.validateFields()
    setLoading(true)
    
    setTimeout(() => {
      message.success('谈话记录生成成功！')
      setLoading(false)
      setGenerateModalVisible(false)
      form.resetFields()
    }, 2000)
  }

  const records = [
    {
      key: '1',
      name: '李四',
      type: '入党申请谈话',
      date: '2026-02-20',
      talker: '张三',
      status: 'completed',
    },
    {
      key: '2',
      name: '王五',
      type: '入党申请谈话',
      date: '2026-02-21',
      talker: '李四',
      status: 'completed',
    },
    {
      key: '3',
      name: '赵六',
      type: '积极分子谈话',
      date: '2026-02-22',
      talker: '张三',
      status: 'pending',
    },
  ]

  const columns = [
    {
      title: '被谈话人',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '谈话类型',
      dataIndex: 'type',
      key: 'type',
    },
    {
      title: '谈话时间',
      dataIndex: 'date',
      key: 'date',
    },
    {
      title: '谈话人',
      dataIndex: 'talker',
      key: 'talker',
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag color={status === 'completed' ? 'success' : 'warning'}>
          {status === 'completed' ? '已完成' : '待生成'}
        </Tag>
      ),
    },
    {
      title: '操作',
      key: 'action',
      render: (_: any, record: any) => (
        <Space>
          <Button size="small" type="link">查看</Button>
          <Button size="small" type="link">编辑</Button>
        </Space>
      ),
    },
  ]

  return (
    <div>
      <Card
        title="谈话记录管理"
        extra={
          <Button type="primary" icon={<PlusOutlined />} onClick={() => setGenerateModalVisible(true)}>
            新建谈话记录
          </Button>
        }
      >
        <Table columns={columns} dataSource={records} pagination={false} />

        <div style={{ marginTop: 24 }}>
          <h3>上传谈话记录生成</h3>
          <Dragger {...uploadProps} style={{ marginTop: 16 }}>
            <p className="ant-upload-drag-icon">
              <InboxOutlined />
            </p>
            <p className="ant-upload-text">点击或拖拽文件生成结构化谈话记录</p>
            <p className="ant-upload-hint">支持 .doc, .docx, .pdf, .jpg, .png 格式</p>
          </Dragger>
        </div>
      </Card>

      <Modal
        title="新建谈话记录"
        open={generateModalVisible}
        onCancel={() => setGenerateModalVisible(false)}
        onOk={handleGenerate}
        confirmLoading={loading}
      >
        <Form form={form} layout="vertical">
          <Form.Item name="interviewee" label="被谈话人" rules={[{ required: true }]}>
            <Input placeholder="请输入被谈话人姓名" />
          </Form.Item>
          
          <Form.Item name="talkType" label="谈话类型" rules={[{ required: true }]}>
            <Select placeholder="选择谈话类型">
              <Select.Option value="application">入党申请谈话</Select.Option>
              <Select.Option value="activist">积极分子培养谈话</Select.Option>
              <Select.Option value="develop">发展对象谈话</Select.Option>
              <Select.Option value="probation">预备党员谈话</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item name="talkDate" label="谈话时间" rules={[{ required: true }]}>
            <DatePicker style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item name="talker" label="谈话人" rules={[{ required: true }]}>
            <Input placeholder="请输入谈话人姓名" />
          </Form.Item>

          <Form.Item name="content" label="谈话内容">
            <Input.TextArea rows={4} placeholder="请输入谈话主要内容..." />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}

export default RecordGeneration
