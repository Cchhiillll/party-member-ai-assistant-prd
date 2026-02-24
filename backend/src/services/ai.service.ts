import axios from 'axios'

interface AIConfig {
  provider: 'openai' | 'anthropic' | 'glm'
  apiKey: string
  baseUrl?: string
}

class AIService {
  private config: AIConfig

  constructor() {
    this.config = {
      provider: (process.env.AI_PROVIDER as AIConfig['provider']) || 'glm',
      apiKey: process.env.GLM_API_KEY || process.env.OPENAI_API_KEY || '',
      baseUrl: process.env.GLM_BASE_URL || process.env.OPENAI_BASE_URL
    }
  }

  async chat(message: string, context?: string): Promise<string> {
    switch (this.config.provider) {
      case 'openai':
        return this.chatOpenAI(message, context)
      case 'anthropic':
        return this.chatAnthropic(message, context)
      case 'glm':
      default:
        return this.chatGLM(message, context)
    }
  }

  private async chatOpenAI(message: string, context?: string): Promise<string> {
    try {
      const response = await axios.post(
        `${this.config.baseUrl}/chat/completions`,
        {
          model: 'gpt-4',
          messages: [
            {
              role: 'system',
              content: '你是党员发展AI助手，专门解答党员发展流程相关问题。请用中文回答。'
            },
            ...(context ? [{ role: 'user' as const, content: context }] : []),
            { role: 'user', content: message }
          ]
        },
        {
          headers: {
            'Authorization': `Bearer ${this.config.apiKey}`,
            'Content-Type': 'application/json'
          }
        }
      )
      return response.data.choices[0].message.content
    } catch (error) {
      console.error('OpenAI API error:', error)
      return this.getFallbackResponse(message)
    }
  }

  private async chatAnthropic(message: string, context?: string): Promise<string> {
    try {
      const response = await axios.post(
        'https://api.anthropic.com/v1/messages',
        {
          model: 'claude-3-sonnet-20240229',
          max_tokens: 1024,
          system: '你是党员发展AI助手，专门解答党员发展流程相关问题。请用中文回答。',
          messages: [
            ...(context ? [{ role: 'user' as const, content: context }] : []),
            { role: 'user', content: message }
          ]
        },
        {
          headers: {
            'x-api-key': this.config.apiKey,
            'anthropic-version': '2023-06-01',
            'Content-Type': 'application/json'
          }
        }
      )
      return response.data.content[0].text
    } catch (error) {
      console.error('Anthropic API error:', error)
      return this.getFallbackResponse(message)
    }
  }

  private async chatGLM(message: string, context?: string): Promise<string> {
    try {
      const response = await axios.post(
        `${this.config.baseUrl}/chat/completions`,
        {
          model: 'glm-4',
          messages: [
            {
              role: 'system',
              content: '你是党员发展AI助手，专门解答党员发展流程相关问题。请用中文回答。'
            },
            ...(context ? [{ role: 'user' as const, content: context }] : []),
            { role: 'user', content: message }
          ]
        },
        {
          headers: {
            'Authorization': `Bearer ${this.config.apiKey}`,
            'Content-Type': 'application/json'
          }
        }
      )
      return response.data.choices[0].message.content
    } catch (error) {
      console.error('GLM API error:', error)
      return this.getFallbackResponse(message)
    }
  }

  private getFallbackResponse(message: string): string {
    // 降级响应
    const responses: Record<string, string> = {
      '申请书': `您好！提交入党申请书后，接下来的流程是：
1. 等待党办接口人审批您的申请书（预计3-5个工作日）
2. 审批通过后，支部接口人会与您进行入党谈话
3. 谈话结束后，支部接口人会录入谈话记录
4. 后续会通知您是否进入积极分子培养阶段`,
      '流程': `党员发展完整流程：
📋 入党申请流程 → 确认入党积极分子流程 → 确认发展对象流程 → 确认预备党员流程 → 建档流程 → 确认正式党员流程 → 归档流程`,
      '材料': `根据发展阶段不同，所需材料包括：入党申请书、思想汇报、培养联系人意见、政审材料、党校培训结业证书等。`
    }

    for (const [key, value] of Object.entries(responses)) {
      if (message.includes(key)) {
        return value
      }
    }

    return '感谢您的提问！我是党员发展AI助手，可以为您解答党员发展流程相关问题。请详细描述您的问题。'
  }

  // 申请书审核
  async reviewApplication(content: string): Promise<{
    score: number
    status: string
    dimensions: Array<{
      name: string
      score: number
      passed: boolean
      suggestions: string[]
    }>
  }> {
    // 模拟AI审核 - 实际应调用AI API
    return {
      score: 72,
      status: 'need_revision',
      dimensions: [
        {
          name: '完整性',
          score: 80,
          passed: true,
          suggestions: ['入党动机表述清晰', '对党的认识较全面']
        },
        {
          name: '规范性',
          score: 85,
          passed: true,
          suggestions: ['格式规范', '段落结构合理']
        },
        {
          name: '真实性',
          score: 60,
          passed: false,
          suggestions: ['内容与模板相似度较高', '建议增加个人真实经历']
        },
        {
          name: '正确性',
          score: 65,
          passed: false,
          suggestions: ['部分表述需要修正', '建议核实政治术语使用']
        }
      ]
    }
  }

  // 生成活动简介
  async generateActivityIntro(name: string, type: string, date: string): Promise<string> {
    const typeNames: Record<string, string> = {
      'committee': '支委会',
      'members': '党员大会',
      'study': '党课学习',
      'other': '活动'
    }

    return `本${typeNames[type] || '活动'}定于${date}召开，主要议题为${name}。

会议议程：
1. 学习相关文件精神
2. 情况介绍
3. 讨论并表决
4. 形成决议

请各相关人员准时参会。`
  }
}

export default new AIService()
