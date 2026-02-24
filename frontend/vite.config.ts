import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// 生产环境使用 Cloudflare Workers API
// 开发环境使用本地代理
const apiBase = process.env.NODE_ENV === 'production' 
  ? 'https://party-member-ai.chillcchhiillll.workers.dev'
  : 'http://localhost:3001'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    proxy: {
      '/health': apiBase,
      '/api': {
        target: apiBase,
        changeOrigin: true
      }
    }
  },
  build: {
    // 生产环境构建配置
    outDir: 'dist',
    assetsDir: 'assets'
  }
})
