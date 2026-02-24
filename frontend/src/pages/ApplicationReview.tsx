import React, { useState } from 'react'
import { Card, Upload, Button, Progress, Tag, List, Input, Space, message } from 'antd'
import { InboxOutlined, CheckCircleOutlined, WarningOutlined, FileTextOutlined } from '@ant-design-icons'
import type { UploadProps } from 'antd'

const { TextArea } = Input
const { Dragger } = Upload

interface ReviewResult {
  score: number
  status: 'pass' | 'need_revision' | 'reject'
  dimensions: {
    name: string
    score: number
    passed: boolean
    suggestions: string[]
  }[]
}

const ApplicationReview: React.FC = () => {
  const [content, setContent] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<ReviewResult | null>(null)

  const uploadProps: UploadProps = {
    name: 'file',
    multiple: false,
    accept: '.doc,.docx,.pdf,.txt',
    beforeUpload: (file) => {
      message.info(`已选择文件: ${file.name}`)
      return false
    },
  }

  const handleReview = () => {
    if (!content.trim()) {
      message.warning('请输入申请书内容或上传文件')
      return
    }

    setLoading(true)
    
    // 模拟审核过程
    setTimeout(() => {
      const reviewResult: ReviewResult = {
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
      
      setResult(reviewResult)
      setLoading(false)
    }, 2000)
  }

  const getStatusTag = (status: string) => {
    switch (status) {
      case 'pass':
        return <Tag color="success" icon={<CheckCircleOutlined />}>通过</Tag>
      case 'need_revision':
        return <Tag color="warning" icon={<WarningOutlined />}>需修改</Tag>
      case 'reject':
        return <Tag color="error">不通过</Tag>
      default:
        return null
    }
  }

  return (
    <div>
      <Card title="入党申请书AI审核">
        <div style={{ marginBottom: 24 }}>
          <Dragger {...uploadProps}>
            <p className="ant-upload-drag-icon">
              <InboxOutlined />
            </p>
            <p className="ant-upload-text">点击或拖拽文件到此区域上传</p>
            <p className="ant-upload-hint">支持 .doc, .docx, .pdf, .txt 格式</p>
          </Dragger>
        </div>

        <div style={{ marginBottom: 24 }}>
          <p style={{ marginBottom: 8 }}>或直接输入申请书内容：</p>
          <TextArea
            rows={8}
            placeholder="请粘贴入党申请书内容..."
            value={content}
            onChange={e => setContent(e.target.value)}
          />
        </div>

        <Button type="primary" size="large" onClick={handleReview} loading={loading}>
          开始审核
        </Button>
      </Card>

      {result && (
        <Card title="审核结果" style={{ marginTop: 24 }}>
          <div style={{ textAlign: 'center', marginBottom: 24 }}>
            <Progress
              type="circle"
              percent={result.score}
              format={percent => (
                <div>
                  <div style={{ fontSize: 32, fontWeight: 'bold' }}>{percent}</div>
                  <div>综合评分</div>
                </div>
              )}
              strokeColor={result.score >= 80 ? '#52c41a' : result.score >= 60 ? '#faad14' : '#f5222d'}
            />
            <div style={{ marginTop: 16 }}>
              {getStatusTag(result.status)}
            </div>
          </div>

          <List
            itemLayout="horizontal"
            dataSource={result.dimensions}
            renderItem={item => (
              <List.Item>
                <List.Item.Meta
                  avatar={
                    item.passed ? (
                      <CheckCircleOutlined style={{ fontSize: 24, color: '#52c41a' }} />
                    ) : (
                      <WarningOutlined style={{ fontSize: 24, color: '#faad14' }} />
                    )
                  }
                  title={
                    <Space>
                      <span>{item.name}</span>
                      <Tag color={item.passed ? 'success' : 'warning'}>{item.score}分</Tag>
                    </Space>
                  }
                  description={
                    <ul style={{ margin: 0, paddingLeft: 20 }}>
                      {item.suggestions.map((s, i) => (
                        <li key={i}>{s}</li>
                      ))}
                    </ul>
                  }
                />
              </List.Item>
            )}
          />

          <div style={{ marginTop: 24, textAlign: 'center' }}>
            <Space>
              <Button type="primary">通过审核</Button>
              <Button>返回修改</Button>
              <Button danger>驳回</Button>
            </Space>
          </div>
        </Card>
      )}
    </div>
  )
}

export default ApplicationReview
