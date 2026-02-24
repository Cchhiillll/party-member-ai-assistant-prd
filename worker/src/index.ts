import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { logger } from 'hono/logger'
import { prettyJSON } from 'hono/pretty-json'

import aiRouter from './routes/ai'
import applicationRouter from './routes/application'
import recordRouter from './routes/record'
import messageRouter from './routes/message'
import activityRouter from './routes/activity'
import authRouter from './routes/auth'

// 定义环境变量类型
type Bindings = {
  DB: D1Database
  AI: any
  OPENAI_API_KEY: string
  GLM_API_KEY: string
  JWT_SECRET: string
  ENVIRONMENT: string
}

const app = new Hono<{ Bindings: Bindings }>()

// 中间件
app.use('*', logger())
app.use('*', prettyJSON())
app.use('*', cors({
  origin: ['http://localhost:3000', 'http://localhost:8787'],
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowHeaders: ['Content-Type', 'Authorization'],
}))

// 健康检查
app.get('/health', (c) => {
  return c.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    environment: c.env.ENVIRONMENT 
  })
})

// 路由
app.route('/api/auth', authRouter)
app.route('/api/ai', aiRouter)
app.route('/api/application', applicationRouter)
app.route('/api/record', recordRouter)
app.route('/api/message', messageRouter)
app.route('/api/activity', activityRouter)

// 404
app.notFound((c) => {
  return c.json({ error: 'Not Found' }, 404)
})

// 错误处理
app.onError((err, c) => {
  console.error('Error:', err)
  return c.json({ error: 'Internal Server Error' }, 500)
})

export default app
