import { Router } from 'express'
import { v4 as uuidv4 } from 'uuid'

const router = Router()

interface Message {
  id: string
  title: string
  content: string
  type: 'reminder' | 'notice' | 'task'
  read: boolean
  time: string
  userId?: string
}

// 模拟消息数据
let messages: Message[] = [
  {
    id: '1',
    title: '申请书待审核提醒',
    content: '您有 3 份入党申请书待审核，请尽快处理',
    type: 'reminder',
    read: false,
    time: '2026-02-24T10:30:00Z'
  },
  {
    id: '2',
    title: '谈话提醒',
    content: '李四的入党谈话已安排，请按时参加',
    type: 'notice',
    read: false,
    time: '2026-02-24T09:15:00Z'
  },
  {
    id: '3',
    title: '会议通知',
    content: '本周五下午2点召开支委会，请准时参加',
    type: 'notice',
    read: true,
    time: '2026-02-23T16:00:00Z'
  }
]

// 获取消息列表
router.get('/list', (req, res) => {
  res.json({
    success: true,
    data: messages
  })
})

// 获取未读消息数
router.get('/unread-count', (req, res) => {
  const count = messages.filter(m => !m.read).length
  res.json({
    success: true,
    data: { count }
  })
})

// 标记已读
router.post('/:id/read', (req, res) => {
  const { id } = req.params
  const index = messages.findIndex(m => m.id === id)
  
  if (index !== -1) {
    messages[index].read = true
  }

  res.json({
    success: true,
    message: '标记已读'
  })
})

// 全部标记已读
router.post('/mark-all-read', (req, res) => {
  messages = messages.map(m => ({ ...m, read: true }))
  res.json({
    success: true,
    message: '全部已读'
  })
})

// 发送消息
router.post('/send', (req, res) => {
  const { title, content, type, userId } = req.body
  
  const newMessage: Message = {
    id: uuidv4(),
    title,
    content,
    type: type || 'notice',
    read: false,
    time: new Date().toISOString(),
    userId
  }

  messages.unshift(newMessage)

  res.json({
    success: true,
    data: newMessage
  })
})

// 删除消息
router.delete('/:id', (req, res) => {
  const { id } = req.params
  messages = messages.filter(m => m.id !== id)

  res.json({
    success: true,
    message: '删除成功'
  })
})

export default router
