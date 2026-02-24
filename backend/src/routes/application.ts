import { Router } from 'express'

const router = Router()

// 模拟申请书审核
router.post('/review', async (req, res) => {
  const { content, fileName } = req.body
  
  // 模拟AI审核过程
  const result = {
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
        suggestions: ['内容与模板相似度较高(68%)', '建议增加个人真实经历和感悟']
      },
      {
        name: '正确性',
        score: 65,
        passed: false,
        suggestions: ['部分表述需要修正', '建议核实政治术语使用']
      }
    ]
  }

  res.json({
    success: true,
    data: result
  })
})

// 获取待审核列表
router.get('/list', (req, res) => {
  const applications = [
    { id: '1', name: '李四', submitDate: '2026-02-20', status: 'pending' },
    { id: '2', name: '王五', submitDate: '2026-02-21', status: 'pending' },
    { id: '3', name: '赵六', submitDate: '2026-02-22', status: 'reviewed' },
  ]
  
  res.json({
    success: true,
    data: applications
  })
})

// 审核操作
router.post('/:id/approve', (req, res) => {
  const { id } = req.params
  res.json({
    success: true,
    message: `申请书 ${id} 已通过审核`
  })
})

router.post('/:id/reject', (req, res) => {
  const { id } = req.params
  res.json({
    success: true,
    message: `申请书 ${id} 已驳回`
  })
})

export default router
