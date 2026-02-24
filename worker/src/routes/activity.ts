import { Hono } from 'hono'
import { v4 as uuidv4 } from 'uuid'

const app = new Hono()

// 获取列表
app.get('/list', async (c) => {
  const { type, status } = c.req.query()
  const db = c.env.DB

  let sql = 'SELECT * FROM activities'
  const conditions: string[] = []
  const params: any[] = []

  if (type) {
    conditions.push('type = ?')
    params.push(type)
  }
  if (status) {
    conditions.push('status = ?')
    params.push(status)
  }

  if (conditions.length > 0) {
    sql += ' WHERE ' + conditions.join(' AND ')
  }
  sql += ' ORDER BY date DESC'

  const activities = await db.prepare(sql).bind(...params).all()

  return c.json({ success: true, data: activities.results })
})

// 获取详情
app.get('/:id', async (c) => {
  const id = c.req.param('id')
  const db = c.env.DB

  const activity = await db.prepare(
    'SELECT * FROM activities WHERE id = ?'
  ).bind(id).first()

  if (!activity) {
    return c.json({ error: '活动不存在' }, 404)
  }

  return c.json({ success: true, data: activity })
})

// 创建
app.post('/create', async (c) => {
  const { name, type, date, location, description } = await c.req.json()
  const db = c.env.DB
  const id = uuidv4()

  await db.prepare(
    'INSERT INTO activities (id, name, type, date, location, description, status) VALUES (?, ?, ?, ?, ?, ?, ?)'
  ).bind(id, name, type, date, location, description, 'planned').run()

  return c.json({
    success: true,
    data: { id, name, type, date, location, status: 'planned' }
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
    `UPDATE activities SET ${fields} WHERE id = ?`
  ).bind(...values).run()

  return c.json({ success: true, message: '更新成功' })
})

// 删除
app.delete('/:id', async (c) => {
  const id = c.req.param('id')
  const db = c.env.DB

  await db.prepare('DELETE FROM activities WHERE id = ?').bind(id).run()

  return c.json({ success: true, message: '删除成功' })
})

// AI 生成简介
app.post('/generate-intro', async (c) => {
  const { name, type, date } = await c.req.json()

  const typeNames: Record<string, string> = {
    'committee': '支委会',
    'members': '党员大会',
    'study': '党课学习',
    'other': '活动'
  }

  const intro = `本${typeNames[type] || '活动'}定于${date}召开，主要议题为${name}。

会议议程：
1. 学习相关文件精神
2. 情况介绍
3. 讨论并表决
4. 形成决议

请各相关人员准时参会。`

  return c.json({ success: true, data: { intro } })
})

export default app
