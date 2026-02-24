import { Hono } from 'hono'
import { setCookie, getCookie } from 'hono/cookie'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { v4 as uuidv4 } from 'uuid'

const app = new Hono()

// 登录
app.post('/login', async (c) => {
  const { username, password } = await c.req.json()
  const db = c.env.DB

  // 查询用户
  const user = await db.prepare(
    'SELECT * FROM users WHERE username = ?'
  ).bind(username).first()

  if (!user) {
    return c.json({ error: '用户不存在' }, 401)
  }

  // 验证密码
  const valid = await bcrypt.compare(password, user.password as string)
  if (!valid) {
    return c.json({ error: '密码错误' }, 401)
  }

  // 生成 Token
  const token = jwt.sign(
    { id: user.id, username: user.username, role: user.role },
    c.env.JWT_SECRET || 'default-secret',
    { expiresIn: '24h' }
  )

  return c.json({
    success: true,
    data: {
      token,
      user: {
        id: user.id,
        username: user.username,
        name: user.name,
        role: user.role
      }
    }
  })
})

// 注册
app.post('/register', async (c) => {
  const { username, password, name } = await c.req.json()
  const db = c.env.DB

  // 检查用户是否存在
  const existing = await db.prepare(
    'SELECT id FROM users WHERE username = ?'
  ).bind(username).first()

  if (existing) {
    return c.json({ error: '用户名已存在' }, 400)
  }

  // 创建用户
  const id = uuidv4()
  const hashedPassword = await bcrypt.hash(password, 10)

  await db.prepare(
    'INSERT INTO users (id, username, password, name, role) VALUES (?, ?, ?, ?, ?)'
  ).bind(id, username, hashedPassword, name, 'user').run()

  return c.json({
    success: true,
    message: '注册成功'
  })
})

// 获取当前用户
app.get('/me', async (c) => {
  const auth = c.req.header('Authorization')
  
  if (!auth) {
    return c.json({ error: '未登录' }, 401)
  }

  const token = auth.replace('Bearer ', '')
  
  try {
    const decoded = jwt.verify(token, c.env.JWT_SECRET || 'default-secret') as any
    const db = c.env.DB
    
    const user = await db.prepare(
      'SELECT id, username, name, role FROM users WHERE id = ?'
    ).bind(decoded.id).first()

    return c.json({ success: true, data: user })
  } catch (e) {
    return c.json({ error: 'Token 无效' }, 401)
  }
})

export default app
