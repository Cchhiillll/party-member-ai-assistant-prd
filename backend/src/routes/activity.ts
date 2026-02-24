import { Router } from 'express'
import { v4 as uuidv4 } from 'uuid'

const router = Router()

interface Activity {
  id: string
  name: string
  type: 'committee' | 'members' | 'study' | 'other'
  date: string
  location: string
  status: 'planned' | 'ongoing' | 'completed'
  relatedCount: number
  description?: string
  createdAt: string
}

// 模拟活动数据
let activities: Activity[] = [
  {
    id: '1',
    name: '支委会 - 确认入党积极分子',
    type: 'committee',
    date: '2026-02-28',
    location: '支部会议室',
    status: 'planned',
    relatedCount: 3,
    createdAt: '2026-02-24T10:00:00Z'
  },
  {
    id: '2',
    name: '党员大会 - 接收预备党员',
    type: 'members',
    date: '2026-03-05',
    location: '党员活动室',
    status: 'planned',
    relatedCount: 5,
    createdAt: '2026-02-24T10:00:00Z'
  }
]

// 获取活动列表
router.get('/list', (req, res) => {
  const { type, status } = req.query
  
  let filtered = activities
  if (type) {
    filtered = filtered.filter(a => a.type === type)
  }
  if (status) {
    filtered = filtered.filter(a => a.status === status)
  }

  res.json({
    success: true,
    data: filtered
  })
})

// 获取单个活动
router.get('/:id', (req, res) => {
  const { id } = req.params
  const activity = activities.find(a => a.id === id)
  
  if (!activity) {
    return res.status(404).json({ error: '活动不存在' })
  }

  res.json({
    success: true,
    data: activity
  })
})

// 创建活动
router.post('/create', (req, res) => {
  const { name, type, date, location, description } = req.body
  
  const newActivity: Activity = {
    id: uuidv4(),
    name,
    type,
    date,
    location,
    status: 'planned',
    relatedCount: 0,
    description,
    createdAt: new Date().toISOString()
  }

  activities.push(newActivity)

  res.json({
    success: true,
    data: newActivity
  })
})

// 更新活动
router.put('/:id', (req, res) => {
  const { id } = req.params
  const index = activities.findIndex(a => a.id === id)
  
  if (index === -1) {
    return res.status(404).json({ error: '活动不存在' })
  }

  activities[index] = { ...activities[index], ...req.body }

  res.json({
    success: true,
    data: activities[index]
  })
})

// 删除活动
router.delete('/:id', (req, res) => {
  const { id } = req.params
  activities = activities.filter(a => a.id !== id)

  res.json({
    success: true,
    message: '删除成功'
  })
})

// AI生成活动简介
router.post('/generate-intro', (req, res) => {
  const { name, type, date } = req.body
  
  // 模拟AI生成
  const intro = `本${type === 'committee' ? '支委会' : type === 'members' ? '党员大会' : '活动'}定于${date}召开，主要议题为讨论并确认${name.replace(/.*-/, '')}。

会议议程：
1. 学习相关文件精神
2. 情况介绍
3. 讨论并表决
4. 形成决议

请各相关人员准时参会。`

  res.json({
    success: true,
    data: { intro }
  })
})

export default router
