import { Hono } from 'hono'
import { v4 as uuidv4 } from 'uuid'

const app = new Hono()

// 获取列表
app.get('/list', async (c) => {
  const db = c.env.DB
  const messages = await db.prepare(
    'SELECT * FROM messages ORDER BY created_at DESC'
  ).all()

  return c.json({ success: true, data: messages.results })
})

// 未读数
app.get('/unread-count', async (c) => {
  const db = c.env.DB
  const result = await db.prepare(
    'SELECT COUNT(*) as count FROM messages WHERE read = 0'
  ).first()

  return c.json({ success: true, data: { count: result?.count || 0 } })
})

// 标记已读
app.post('/:id/read', async (c) => {
  const id = c.req.param('id')
  const db = c.env.DB

  await db.prepare('UPDATE messages SET read = 1 WHERE id = ?').bind(id).run()

  return c.json({ success: true, message: '已读' })
})

// 全部已读
app.post('/mark-all-read', async (c) => {
  const db = c.env.DB

  await db.prepare('UPDATE messages SET read = 1').run()

  return c.json({ success: true, message: '全部已读' })
})

// 发送消息
app.post('/send', async (c) => {
  const { title, content, type, userId } = await c.req.json()
  const db = c.env.DB
  const id = uuidv4()

  await db.prepare(
    'INSERT INTO messages (id, title, content, type, user_id, read) VALUES (?, ?, ?, ?, ?, 0)'
  ).bind(id, title, content, type || 'notice', userId).run()

  return c.json({ success: true, data: { id, title, content } })
})

// 删除
app.delete('/:id', async (c) => {
  const id = c.req.param('id')
  const db = c.env.DB

  await db.prepare('DELETE FROM messages WHERE id = ?').bind(id).run()

  return c.json({ success: true, message: '删除成功' })
})

export default app
