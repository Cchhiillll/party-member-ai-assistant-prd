import request from 'supertest'
import app from '../src/index'

describe('API Tests', () => {
  
  describe('GET /health', () => {
    it('should return ok status', async () => {
      const response = await request(app).get('/health')
      expect(response.status).toBe(200)
      expect(response.body.status).toBe('ok')
    })
  })

  describe('AI Routes', () => {
    it('should respond to chat message', async () => {
      const response = await request(app)
        .post('/api/ai/chat')
        .send({ message: '入党申请书怎么写？' })
      
      expect(response.status).toBe(200)
      expect(response.body.success).toBe(true)
      expect(response.body.data.message).toBeDefined()
    })

    it('should return process info', async () => {
      const response = await request(app).get('/api/ai/process/application')
      
      expect(response.status).toBe(200)
      expect(response.body.success).toBe(true)
    })
  })

  describe('Application Routes', () => {
    it('should review application', async () => {
      const response = await request(app)
        .post('/api/application/review')
        .send({ 
          content: '敬爱的党组织：我志愿加入中国共产党...',
          fileName: 'test.docx'
        })
      
      expect(response.status).toBe(200)
      expect(response.body.success).toBe(true)
      expect(response.body.data.score).toBeDefined()
    })

    it('should return application list', async () => {
      const response = await request(app).get('/api/application/list')
      
      expect(response.status).toBe(200)
      expect(response.body.success).toBe(true)
      expect(Array.isArray(response.body.data)).toBe(true)
    })
  })

  describe('Record Routes', () => {
    it('should return record list', async () => {
      const response = await request(app).get('/api/record/list')
      
      expect(response.status).toBe(200)
      expect(response.body.success).toBe(true)
    })

    it('should generate new record', async () => {
      const response = await request(app)
        .post('/api/record/generate')
        .send({
          interviewee: '测试用户',
          talkType: '入党申请谈话',
          talkDate: '2026-02-24',
          talker: '测试谈话人'
        })
      
      expect(response.status).toBe(200)
      expect(response.body.success).toBe(true)
      expect(response.body.data.id).toBeDefined()
    })
  })

  describe('Message Routes', () => {
    it('should return message list', async () => {
      const response = await request(app).get('/api/message/list')
      
      expect(response.status).toBe(200)
      expect(response.body.success).toBe(true)
    })

    it('should return unread count', async () => {
      const response = await request(app).get('/api/message/unread-count')
      
      expect(response.status).toBe(200)
      expect(response.body.success).toBe(true)
      expect(response.body.data.count).toBeDefined()
    })
  })

  describe('Activity Routes', () => {
    it('should return activity list', async () => {
      const response = await request(app).get('/api/activity/list')
      
      expect(response.status).toBe(200)
      expect(response.body.success).toBe(true)
    })

    it('should create new activity', async () => {
      const response = await request(app)
        .post('/api/activity/create')
        .send({
          name: '测试活动',
          type: 'committee',
          date: '2026-02-28',
          location: '测试地点'
        })
      
      expect(response.status).toBe(200)
      expect(response.body.success).toBe(true)
    })

    it('should generate activity intro', async () => {
      const response = await request(app)
        .post('/api/activity/generate-intro')
        .send({
          name: '支委会',
          type: 'committee',
          date: '2026-02-28'
        })
      
      expect(response.status).toBe(200)
      expect(response.body.success).toBe(true)
      expect(response.body.data.intro).toBeDefined()
    })
  })
})
