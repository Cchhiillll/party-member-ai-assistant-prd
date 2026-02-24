import React, { useState } from 'react'
import { Card, List, Tag, Button, Space, Checkbox, Empty } from 'antd'
import { BellOutlined, CheckCircleOutlined, ClockCircleOutlined, SettingOutlined } from '@ant-design/icons'

interface Message {
  id: string
  title: string
  content: string
  type: 'reminder' | 'notice' | 'task'
  read: boolean
  time: string
}

const MessageCenter: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      title: '申请书待审核提醒',
      content: '您有 3 份入党申请书待审核，请尽快处理',
      type: 'reminder',
      read: false,
      time: '2026-02-24 10:30',
    },
    {
      id: '2',
      title: '谈话提醒',
      content: '李四的入党谈话已安排，请按时参加',
      type: 'notice',
      read: false,
      time: '2026-02-24 09:15',
    },
    {
      id: '3',
      title: '会议通知',
      content: '本周五下午2点召开支委会，请准时参加',
      type: 'notice',
      read: true,
      time: '2026-02-23 16:00',
    },
    {
      id: '4',
      title: '材料提交提醒',
      content: '王五的政审材料尚未提交，请尽快跟进',
      type: 'task',
      read: true,
      time: '2026-02-23 14:30',
    },
  ])

  const getTypeTag = (type: string) => {
    switch (type) {
      case 'reminder':
        return <Tag color="orange" icon={<ClockCircleOutlined />}>提醒</Tag>
      case 'notice':
        return <Tag color="blue" icon={<BellOutlined />}>通知</Tag>
      case 'task':
        return <Tag color="red" icon={<ClockCircleOutlined />}>待办</Tag>
      default:
        return null
    }
  }

  const handleRead = (id: string) => {
    setMessages(messages.map(m => 
      m.id === id ? { ...m, read: true } : m
    ))
  }

  const unreadCount = messages.filter(m => !m.read).length

  return (
    <div>
      <Card
        title={
          <Space>
            <BellOutlined />
            消息中心
            {unreadCount > 0 && <Tag color="red">{unreadCount} 未读</Tag>}
          </Space>
        }
        extra={<Button icon={<SettingOutlined />}>设置</Button>}
      >
        <List
          itemLayout="horizontal"
          dataSource={messages}
          renderItem={item => (
            <List.Item
              style={{ 
                background: item.read ? 'transparent' : '#f6ffed',
                padding: '12px 16px',
                borderRadius: '8px',
                marginBottom: '8px'
              }}
              actions={[
                <Button 
                  type="link" 
                  size="small" 
                  icon={<CheckCircleOutlined />}
                  onClick={() => handleRead(item.id)}
                >
                  已读
                </Button>
              ]}
            >
              <List.Item.Meta
                avatar={getTypeTag(item.type)}
                title={
                  <Space>
                    <span style={{ fontWeight: item.read ? 'normal' : 'bold' }}>
                      {item.title}
                    </span>
                  </Space>
                }
                description={
                  <div>
                    <div>{item.content}</div>
                    <div style={{ color: '#999', fontSize: '12px', marginTop: '4px' }}>
                      {item.time}
                    </div>
                  </div>
                }
              />
            </List.Item>
          )}
        />
      </Card>

      <Card title="消息订阅设置" style={{ marginTop: 16 }}>
        <Space direction="vertical" style={{ width: '100%' }}>
          <Checkbox defaultChecked>申请书审核提醒</Checkbox>
          <Checkbox defaultChecked>谈话安排提醒</Checkbox>
          <Checkbox defaultChecked>会议通知</Checkbox>
          <Checkbox defaultChecked>材料提交提醒</Checkbox>
          <Checkbox>系统更新公告</Checkbox>
          <Button type="primary" style={{ marginTop: 8 }}>保存设置</Button>
        </Space>
      </Card>
    </div>
  )
}

export default MessageCenter
