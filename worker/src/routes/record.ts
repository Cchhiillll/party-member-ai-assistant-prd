import { Hono } from 'hono'
import { v4 as uuidv4 } from 'uuid'

const app = new Hono()

// 获取列表
app.get('/list', async (c) => {
  const db = c.env.DB
  const records = await db.prepare(
    'SELECT * FROM talk_records ORDER BY created_at DESC'
  ).all()

  return c.json({ success: true, data: records.results })
})

// 获取详情
app.get('/:id', async (c) => {
  const id = c.req.param('id')
  const db = c.env.DB

  const record = await db.prepare(
    'SELECT * FROM talk_records WHERE id = ?'
  ).bind(id).first()

  if (!record) {
    return c.json({ error: '记录不存在' }, 404)
  }

  return c.json({ success: true, data: record })
})

// 生成谈话记录
app.post('/generate', async (c) => {
  const { interviewee, talkType, talkDate, talker, content } = await c.req.json()
  const db = c.env.DB
  const id = uuidv4()

  await db.prepare(
    'INSERT INTO talk_records (id, interviewee, talk_type, talk_date, talker, content, status) VALUES (?, ?, ?, ?, ?, ?, ?)'
  ).bind(id, interviewee, talkType, talkDate, talker, content || 'AI生成的结构化内容...', 'draft').run()

  return c.json({
    success: true,
    data: { id, interviewee, talkType, talkDate, talker, status: 'draft' }
  })
})

// 更新
app.put('/:id', async (c) => {
  const id = c.req.param('id')
  const body = await c.req.json()
  const db = c.env.DB

  const fields = Object.keys(body).map(k => `${k} = ?`).join(', ')
  const values = [...Object.values(body), id]

  await db.prepare(
    `UPDATE talk_records SET ${fields} WHERE id = ?`
  ).bind(...values).run()

  return c.json({ success: true, message: '更新成功' })
})

// 删除
app.delete('/:id', async (c) => {
  const id = c.req.param('id')
  const db = c.env.DB

  await db.prepare('DELETE FROM talk_records WHERE id = ?').bind(id).run()

  return c.json({ success: true, message: '删除成功' })
})

export default app
