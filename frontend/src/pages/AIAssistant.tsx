import React, { useState, useRef, useEffect } from 'react'
import { Card, Input, Button, Avatar, Space, Spin, Empty } from 'antd'
import { SendOutlined, RobotOutlined, UserOutlined } from '@ant-design-icons'
import './AIAssistant.css'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

const AIAssistant: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: '您好！我是党员发展AI助手，可以为您解答党员发展流程相关问题。请问有什么可以帮助您的？',
      timestamp: new Date()
    }
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSend = async () => {
    if (!input.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInput('')
    setLoading(true)

    // 模拟AI响应
    setTimeout(() => {
      const responses: Record<string, string> = {
        '申请书': `您好！提交入党申请书后，接下来的流程是：
1. 等待党办接口人审批您的申请书（预计3-5个工作日）
2. 审批通过后，支部接口人会与您进行入党谈话
3. 谈话结束后，支部接口人会录入谈话记录
4. 后续会通知您是否进入积极分子培养阶段

💡 提醒：您可以随时在这里询问流程进展`,
        '流程': `党员发展完整流程如下：

📋 入党申请流程
→ 确认入党积极分子流程
→ 确认发展对象流程
→ 确认预备党员流程
→ 建档流程
→ 确认正式党员流程
→ 归档流程

每个阶段都有具体的要求和时间节点，您可以在"活动管理"中查看详情。`,
        '材料': `根据您当前的发展阶段，所需材料如下：

📄 入党申请书阶段：
• 入党申请书原件
• 个人思想汇报

📄 确认积极分子阶段：
• 培养联系人意见
• 支委会会议记录

📄 确认发展对象阶段：
• 政审材料
• 党校培训结业证书

如有疑问，请随时咨询！`
      }

      let response = '感谢您的提问！我来为您解答相关问题。'
      for (const [key, value] of Object.entries(responses)) {
        if (input.includes(key)) {
          response = value
          break
        }
      }

      const assistantMessage: Message = {
        id: Date.now().toString(),
        role: 'assistant',
        content: response,
        timestamp: new Date()
      }
      setMessages(prev => [...prev, assistantMessage])
      setLoading(false)
    }, 1000)
  }

  return (
    <div className="ai-assistant-container">
      <Card title="AI 办事助手" className="chat-card">
        <div className="messages-container">
          {messages.length === 0 ? (
            <Empty description="暂无消息" />
          ) : (
            messages.map(msg => (
              <div key={msg.id} className={`message ${msg.role}`}>
                <Avatar
                  icon={msg.role === 'user' ? <UserOutlined /> : <RobotOutlined />}
                  style={{ backgroundColor: msg.role === 'user' ? '#1890ff' : '#52c41a' }}
                />
                <div className="message-content">
                  <div className="message-text">{msg.content}</div>
                </div>
              </div>
            ))
          )}
          {loading && (
            <div className="message assistant">
              <Avatar icon={<RobotOutlined />} style={{ backgroundColor: '#52c41a' }} />
              <div className="message-content">
                <Spin size="small" />
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
        
        <div className="input-container">
          <Space.Compact style={{ width: '100%' }}>
            <Input
              placeholder="请输入您的问题，如：我现在该做什么？"
              value={input}
              onChange={e => setInput(e.target.value)}
              onPressEnter={handleSend}
            />
            <Button type="primary" onClick={handleSend} loading={loading}>
              <SendOutlined />
            </Button>
          </Space.Compact>
        </div>

        <div className="quick-questions">
          <span>快捷问题：</span>
          <Button size="small" onClick={() => setInput('入党申请书怎么写？')}>入党申请书怎么写？</Button>
          <Button size="small" onClick={() => setInput('现在是什么流程？')}>现在是什么流程？</Button>
          <Button size="small" onClick={() => setInput('需要准备什么材料？')}>需要准备什么材料？</Button>
        </div>
      </Card>
    </div>
  )
}

export default AIAssistant
