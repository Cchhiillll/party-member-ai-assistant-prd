import { Hono } from 'hono'

const app = new Hono()

// 申请书审核
app.post('/review', async (c) => {
  const { content, fileName } = await c.req.json()
  const db = c.env.DB

  // 模拟 AI 审核
  const result = {
    score: 72,
    status: 'need_revision',
    dimensions: [
      { name: '完整性', score: 80, passed: true, suggestions: ['入党动机表述清晰', '对党的认识较全面'] },
      { name: '规范性', score: 85, passed: true, suggestions: ['格式规范', '段落结构合理'] },
      { name: '真实性', score: 60, passed: false, suggestions: ['内容与模板相似度较高', '建议增加个人真实经历'] },
      { name: '正确性', score: 65, passed: false, suggestions: ['部分表述需要修正', '建议核实政治术语使用'] }
    ]
  }

  return c.json({ success: true, data: result })
})

// 获取列表
app.get('/list', async (c) => {
  const db = c.env.DB
  const applications = await db.prepare(
    'SELECT * FROM applications ORDER BY created_at DESC'
  ).all()

  return c.json({ success: true, data: applications.results })
})

// 通过
app.post('/:id/approve', async (c) => {
  const id = c.req.param('id')
  const db = c.env.DB

  await db.prepare(
    "UPDATE applications SET status = 'approved', reviewed_at = ? WHERE id = ?"
  ).bind(new Date().toISOString(), id).run()

  return c.json({ success: true, message: '已通过' })
})

// 驳回
app.post('/:id/reject', async (c) => {
  const id = c.req.param('id')
  const db = c.env.DB

  await db.prepare(
    "UPDATE applications SET status = 'rejected', reviewed_at = ? WHERE id = ?"
  ).bind(new Date().toISOString(), id).run()

  return c.json({ success: true, message: '已驳回' })
})

export default app
