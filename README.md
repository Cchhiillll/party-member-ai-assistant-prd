# 党员发展AI助手

> 面向党务工作者与基层党组织的智能助手

## 🚀 快速开始

### 环境要求

- Node.js >= 18.0.0
- npm >= 9.0.0

### 安装依赖

```bash
# 根目录
npm install

# 前端
cd frontend && npm install

# 后端
cd backend && npm install
```

### 启动开发环境

```bash
# 启动后端 (终端1)
cd backend
npm run dev

# 启动前端 (终端2)
cd frontend
npm run dev
```

### 访问地址

- **前端**: http://localhost:3000
- **后端**: http://localhost:3001
- **健康检查**: http://localhost:3001/health

---

## 📁 项目结构

```
party-member-ai-assistant/
├── frontend/                    # React 前端
│   ├── src/
│   │   ├── components/         # 组件
│   │   │   └── Layout/
│   │   │       └── MainLayout.tsx
│   │   ├── pages/              # 页面
│   │   │   ├── Home.tsx           # 首页工作台
│   │   │   ├── AIAssistant.tsx    # AI助手
│   │   │   ├── ApplicationReview.tsx # 申请书审核
│   │   │   ├── RecordGeneration.tsx  # 谈话记录生成
│   │   │   ├── MessageCenter.tsx     # 消息提醒
│   │   │   └── ActivityManagement.tsx # 活动管理
│   │   ├── App.tsx
│   │   ├── main.tsx
│   │   └── index.css
│   ├── package.json
│   ├── vite.config.ts
│   └── tsconfig.json
│
├── backend/                     # Express 后端
│   ├── src/
│   │   ├── routes/             # 路由
│   │   │   ├── ai.ts              # AI对话接口
│   │   │   ├── application.ts     # 申请书审核接口
│   │   │   ├── record.ts          # 谈话记录接口
│   │   │   ├── message.ts         # 消息接口
│   │   │   └── activity.ts        # 活动接口
│   │   └── index.ts
│   ├── package.json
│   └── tsconfig.json
│
├── 党员发展AI助手-产品需求文档.md
├── 党员发展AI助手-产品需求文档.docx
├── package.json
└── README.md
```

---

## ✨ 功能模块

### 1. PC端AI助手 (P0)
- 智能问答：回答党员发展流程问题
- 快捷问题：预设常用问题
- 流程查询：指导下一步操作

### 2. 入党申请书审核 (P0)
- 文件上传：支持 doc/docx/pdf/txt
- AI审核：完整性、规范性、真实性、正确性
- 评分报告：生成修改建议

### 3. 谈话记录生成 (P0)
- OCR识别：从文档/图片提取信息
- 结构化输出：自动生成标准表格
- 记录管理：增删改查

### 4. 消息提醒 (P1)
- 流程提醒：关键节点自动提醒
- 订阅设置：自定义提醒类型
- 已读管理：标记已读/未读

### 5. 活动管理 (P1)
- 活动列表：支委会/党员大会/党课学习
- AI生成简介：自动生成活动描述
- 智能匹配：关联已有活动

---

## 🔌 API 接口

### AI 助手

```
POST /api/ai/chat          # AI对话
GET  /api/ai/process/:stage # 获取流程信息
```

### 申请书审核

```
POST /api/application/review  # 提交审核
GET  /api/application/list    # 获取列表
POST /api/application/:id/approve # 通过
POST /api/application/:id/reject  # 驳回
```

### 谈话记录

```
GET    /api/record/list      # 列表
GET    /api/record/:id       # 详情
POST   /api/record/generate  # 生成
PUT    /api/record/:id       # 更新
DELETE /api/record/:id       # 删除
```

### 消息管理

```
GET  /api/message/list          # 列表
GET  /api/message/unread-count  # 未读数
POST /api/message/:id/read      # 标记已读
POST /api/message/mark-all-read # 全部已读
POST /api/message/send          # 发送消息
```

### 活动管理

```
GET    /api/activity/list           # 列表
GET    /api/activity/:id            # 详情
POST   /api/activity/create         # 创建
PUT    /api/activity/:id            # 更新
DELETE /api/activity/:id            # 删除
POST   /api/activity/generate-intro # 生成简介
```

---

## 🛠 技术栈

### 前端
- React 18
- TypeScript
- Ant Design 5
- React Router 6
- Zustand (状态管理)
- Axios
- Vite

### 后端
- Node.js
- Express
- TypeScript
- JWT (认证)
- Multer (文件上传)

---

## 📝 开发进度

- [x] 项目初始化
- [x] 前端框架搭建
- [x] 后端框架搭建
- [x] AI助手功能
- [x] 申请书审核功能
- [x] 谈话记录功能
- [x] 消息提醒功能
- [x] 活动管理功能
- [ ] AI接口集成 (OpenAI/Claude/GLM)
- [ ] 数据库集成
- [ ] 用户认证
- [ ] 测试用例

---

## 📄 相关文档

- [产品需求文档](./党员发展AI助手-产品需求文档.md)
- [产品需求文档 (Word)](./党员发展AI助手-产品需求文档.docx)

---

## 📜 License

MIT
