import { Router } from 'express'
import { v4 as uuidv4 } from 'uuid'

const router = Router()

interface TalkRecord {
  id: string
  interviewee: string
  talkType: string
  talkDate: string
  talker: string
  content: string
  status: 'draft' | 'completed'
  createdAt: string
}

// 模拟数据存储
let records: TalkRecord[] = [
  {
    id: '1',
    interviewee: '李四',
    talkType: '入党申请谈话',
    talkDate: '2026-02-20',
    talker: '张三',
    content: '谈话内容...',
    status: 'completed',
    createdAt: '2026-02-20T10:00:00Z'
  }
]

// 生成谈话记录
router.post('/generate', async (req, res) => {
  const { interviewee, talkType, talkDate, talker, content } = req.body
  
  // 模拟OCR和结构化处理
  const newRecord: TalkRecord = {
    id: uuidv4(),
    interviewee,
    talkType,
    talkDate,
    talker,
    content: content || '这是由AI生成的结构化谈话记录...',
    status: 'draft',
    createdAt: new Date().toISOString()
  }

  records.push(newRecord)

  res.json({
    success: true,
    data: newRecord
  })
})

// 获取谈话记录列表
router.get('/list', (req, res) => {
  res.json({
    success: true,
    data: records
  })
})

// 获取单条记录
router.get('/:id', (req, res) => {
  const { id } = req.params
  const record = records.find(r => r.id === id)
  
  if (!record) {
    return res.status(404).json({ error: '记录不存在' })
  }

  res.json({
    success: true,
    data: record
  })
})

// 更新谈话记录
router.put('/:id', (req, res) => {
  const { id } = req.params
  const index = records.findIndex(r => r.id === id)
  
  if (index === -1) {
    return res.status(404).json({ error: '记录不存在' })
  }

  records[index] = { ...records[index], ...req.body }

  res.json({
    success: true,
    data: records[index]
  })
})

// 删除谈话记录
router.delete('/:id', (req, res) => {
  const { id } = req.params
  records = records.filter(r => r.id !== id)

  res.json({
    success: true,
    message: '删除成功'
  })
})

export default router
