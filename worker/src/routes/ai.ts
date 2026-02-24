import { Hono } from 'hono'

const app = new Hono()

// AI 对话
app.post('/chat', async (c) => {
  const { message, context, provider } = await c.req.json()

  let response: string

  // 尝试使用真实 API
  try {
    if (provider === 'openai' && c.env.OPENAI_API_KEY) {
      response = await chatOpenAI(c.env.OPENAI_API_KEY, message, context)
    } else if (c.env.GLM_API_KEY) {
      response = await chatGLM(c.env.GLM_API_KEY, message, context)
    } else {
      // 降级到本地响应
      response = getLocalResponse(message)
    }
  } catch (error) {
    console.error('AI API Error:', error)
    response = getLocalResponse(message)
  }

  return c.json({
    success: true,
    data: {
      message: response,
      timestamp: new Date().toISOString()
    }
  })
})

// 获取流程信息
app.get('/process/:stage', (c) => {
  const stage = c.req.param('stage')

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
    },
    'development': {
      name: '确认发展对象流程',
      steps: [
        { name: '党办发起', status: 'pending' },
        { name: '支委会确认', status: 'pending' },
        { name: '政审', status: 'pending' },
        { name: '填写材料', status: 'pending' }
      ]
    },
    'probationary': {
      name: '确认预备党员流程',
      steps: [
        { name: '党办发起', status: 'pending' },
        { name: '党员大会', status: 'pending' },
        { name: '上级审批', status: 'pending' }
      ]
    }
  }

  return c.json({
    success: true,
    data: processInfo[stage] || {}
  })
})

// OpenAI 调用
async function chatOpenAI(apiKey: string, message: string, context?: string): Promise<string> {
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: '你是党员发展AI助手，专门解答党员发展流程相关问题。请用中文简洁回答。'
        },
        ...(context ? [{ role: 'user' as const, content: context }] : []),
        { role: 'user', content: message }
      ]
    })
  })

  const data = await response.json() as any
  return data.choices[0].message.content
}

// GLM 调用
async function chatGLM(apiKey: string, message: string, context?: string): Promise<string> {
  const response = await fetch('https://open.bigmodel.cn/api/paas/v4/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: 'glm-4',
      messages: [
        {
          role: 'system',
          content: '你是党员发展AI助手，专门解答党员发展流程相关问题。请用中文简洁回答。'
        },
        ...(context ? [{ role: 'user' as const, content: context }] : []),
        { role: 'user', content: message }
      ]
    })
  })

  const data = await response.json() as any
  return data.choices[0].message.content
}

// 本地降级响应
function getLocalResponse(message: string): string {
  const responses: Record<string, string> = {
    '申请书': `您好！提交入党申请书后，接下来的流程是：
1. 等待党办接口人审批您的申请书（预计3-5个工作日）
2. 审批通过后，支部接口人会与您进行入党谈话
3. 谈话结束后，支部接口人会录入谈话记录
4. 后续会通知您是否进入积极分子培养阶段

💡 提醒：您可以随时在这里询问流程进展`,
    '流程': `党员发展完整流程：
📋 入党申请流程 → 确认入党积极分子流程 → 确认发展对象流程 → 确认预备党员流程 → 建档流程 → 确认正式党员流程 → 归档流程`,
    '材料': `根据发展阶段不同，所需材料包括：
- 入党申请书
- 思想汇报
- 培养联系人意见
- 政审材料
- 党校培训结业证书等`,
    '积极分子': `确认入党积极分子后：
1. 需要参加党校培训
2. 定期向党组织汇报思想
3. 培养2名正式党员作为培养联系人
4. 经过1年以上培养考察`
  }

  for (const [key, value] of Object.entries(responses)) {
    if (message.includes(key)) {
      return value
    }
  }

  return '感谢您的提问！我是党员发展AI助手，可以为您解答党员发展流程相关问题。请详细描述您的问题。'
}

export default app
