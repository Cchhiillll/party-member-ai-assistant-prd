import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Layout } from 'antd'
import MainLayout from './components/Layout/MainLayout'
import Home from './pages/Home'
import AIAssistant from './pages/AIAssistant'
import ApplicationReview from './pages/ApplicationReview'
import RecordGeneration from './pages/RecordGeneration'
import MessageCenter from './pages/MessageCenter'
import ActivityManagement from './pages/ActivityManagement'
import './App.css'

const { Content } = Layout

function App() {
  return (
    <BrowserRouter>
      <MainLayout>
        <Routes>
          <Route path="/" element={<Navigate to="/home" replace />} />
          <Route path="/home" element={<Home />} />
          <Route path="/assistant" element={<AIAssistant />} />
          <Route path="/review" element={<ApplicationReview />} />
          <Route path="/record" element={<RecordGeneration />} />
          <Route path="/message" element={<MessageCenter />} />
          <Route path="/activity" element={<ActivityManagement />} />
        </Routes>
      </MainLayout>
    </BrowserRouter>
  )
}

export default App
