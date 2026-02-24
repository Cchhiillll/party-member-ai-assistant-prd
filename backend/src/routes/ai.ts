import { Router } from 'express'

const router = Router()

// 模拟AI对话
router.post('/chat', async (req, res) => {
  const { message, context } = req.body
  
  // 这里可以接入真实的AI API (OpenAI/Claude/GLM)
  const responses: Record<string, string> = {
    '申请书': `您好！提交入党申请书后，接下来的流程是：
1. 等待党办接口人审批您的申请书（预计3-5个工作日）
2. 审批通过后，支部接口人会与您进行入党谈话
3. 谈话结束后，支部接口人会录入谈话记录
4. 后续会通知您是否进入积极分子培养阶段`,
    '流程': `党员发展完整流程：
📋 入党申请流程
→ 确认入党积极分子流程  
→ 确认发展对象流程
→ 确认预备党员流程
→ 建档流程
→ 确认正式党员流程
→ 归档流程`,
    'default': '感谢您的提问！我是党员发展AI助手，可以为您解答党员发展流程相关问题。'
  }

  let response = responses.default
  for (const [key, value] of Object.entries(responses)) {
    if (message.includes(key)) {
      response = value
      break
    }
  }

  res.json({
    success: true,
    data: {
      message: response,
      timestamp: new Date().toISOString()
    }
  })
})

// 获取流程信息
router.get('/process/:stage', (req, res) => {
  const { stage } = req.params
  
  const processInfo: Record<string, any> = {
    'application': {
      name: '入党申请流程',
      steps: [
        { name: '提交申请', status: 'completed' },
        { name: '审核申请书', status: 'pending' },
        { name: '入党谈话', status: 'pending' },
        { name: '录入谈话记录', status: 'pending' }
      ]
    },
    'activist': {
      name: '确认入党积极分子流程',
      steps: [
        { name: '党办发起', status: 'pending' },
        { name: '支委会确认', status: 'pending' },
        { name: '指定培养人', status: 'pending' }
      ]
    }
  }

  res.json({
    success: true,
    data: processInfo[stage] || {}
  })
})

export default router
