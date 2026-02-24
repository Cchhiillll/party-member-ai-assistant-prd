import React, { useEffect, useState } from 'react'
import { Card, Row, Col, Statistic, Progress, Alert } from 'antd'
import {
  UserOutlined,
  FileTextOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  HeartOutlined,
} from '@ant-design/icons'

interface HealthStatus {
  status: string
  timestamp: string
  environment: string
}

const Home: React.FC = () => {
  const [health, setHealth] = useState<HealthStatus | null>(null)
  const [loading, setLoading] = useState(true)

  const API_BASE = 'https://party-member-ai.chillcchhiillll.workers.dev'

  useEffect(() => {
    fetch(API_BASE + '/health')
      .then(res => res.json())
      .then(data => setHealth(data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div>
      <h2 style={{ marginBottom: 24 }}>工作台</h2>
      
      {/* Health Status */}
      <Card style={{ marginBottom: 24 }} loading={loading}>
        <Card.Meta
          title={<><HeartOutlined /> 系统状态</>}
          description={
            health ? (
              <pre style={{ 
                background: '#f5f5f5', 
                padding: 12, 
                borderRadius: 6,
                fontSize: 14 
              }}>
                {JSON.stringify(health, null, 2)}
              </pre>
            ) : (
              '加载中...'
            )
          }
        />
      </Card>

      <Row gutter={16}>
        <Col span={6}>
          <Card>
            <Statistic
              title="待审核申请书"
              value={5}
              prefix={<FileTextOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="待安排谈话"
              value={3}
              prefix={<UserOutlined />}
              valueStyle={{ color: '#faad14' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="本月发展党员"
              value={12}
              prefix={<CheckCircleOutlined />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="预备党员即将转正"
              value={2}
              prefix={<ClockCircleOutlined />}
              valueStyle={{ color: '#eb2f96' }}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={16} style={{ marginTop: 24 }}>
        <Col span={12}>
          <Card title="发展流程进度">
            <div style={{ marginBottom: 16 }}>
              <span>入党申请阶段</span>
              <Progress percent={80} size="small" />
            </div>
            <div style={{ marginBottom: 16 }}>
              <span>积极分子培养阶段</span>
              <Progress percent={45} size="small" />
            </div>
            <div style={{ marginBottom: 16 }}>
              <span>发展对象阶段</span>
              <Progress percent={30} size="small" />
            </div>
            <div>
              <span>预备党员阶段</span>
              <Progress percent={15} size="small" />
            </div>
          </Card>
        </Col>
        <Col span={12}>
          <Card title="待办事项">
            <div style={{ padding: '8px 0' }}>
              <p>• 李四的入党申请书待审核</p>
              <p>• 王五的谈话记录待录入</p>
              <p>• 张三即将进入预备期</p>
              <p>• 周五召开支委会</p>
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  )
}

export default Home
