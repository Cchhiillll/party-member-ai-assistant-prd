import React, { useState } from 'react'
import { Layout, Menu, theme } from 'antd'
import {
  HomeOutlined,
  RobotOutlined,
  FileTextOutlined,
  MessageOutlined,
  BellOutlined,
  CalendarOutlined,
} from '@ant-design/icons'
import { useNavigate, useLocation } from 'react-router-dom'

const { Header, Sider, Content } = Layout

interface MainLayoutProps {
  children: React.ReactNode
}

const menuItems = [
  {
    key: '/home',
    icon: <HomeOutlined />,
    label: '首页',
  },
  {
    key: '/assistant',
    icon: <RobotOutlined />,
    label: 'AI助手',
  },
  {
    key: '/review',
    icon: <FileTextOutlined />,
    label: '申请书审核',
  },
  {
    key: '/record',
    icon: <MessageOutlined />,
    label: '谈话记录生成',
  },
  {
    key: '/message',
    icon: <BellOutlined />,
    label: '消息提醒',
  },
  {
    key: '/activity',
    icon: <CalendarOutlined />,
    label: '活动管理',
  },
]

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken()

  const handleMenuClick = ({ key }: { key: string }) => {
    navigate(key)
  }

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider collapsible collapsed={collapsed} onCollapse={setCollapsed}>
        <div style={{
          height: 32,
          margin: 16,
          background: 'rgba(255, 255, 255, 0.2)',
          borderRadius: 6,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#fff',
          fontWeight: 'bold'
        }}>
          {collapsed ? '党' : '党员发展AI助手'}
        </div>
        <Menu
          theme="dark"
          selectedKeys={[location.pathname]}
          mode="inline"
          items={menuItems}
          onClick={handleMenuClick}
        />
      </Sider>
      <Layout>
        <Header style={{
          padding: '0 24px',
          background: colorBgContainer,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <h2 style={{ margin: 0 }}>党员发展AI助手</h2>
          <span>欢迎，党务管理员</span>
        </Header>
        <Content style={{ margin: '16px' }}>
          <div style={{
            padding: 24,
            minHeight: 360,
            background: colorBgContainer,
            borderRadius: borderRadiusLG,
          }}>
            {children}
          </div>
        </Content>
      </Layout>
    </Layout>
  )
}

export default MainLayout
