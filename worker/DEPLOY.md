# Cloudflare Workers 部署指南

## 党员发展AI助手 - Workers 版本

---

## 1. 安装依赖

```bash
cd worker
npm install
```

---

## 2. 安装 Wrangler CLI

```bash
npm install -g wrangler
```

---

## 3. 登录 Cloudflare

```bash
wrangler login
```

浏览器会打开，登录你的 Cloudflare 账号

---

## 4. 创建 D1 数据库

```bash
# 创建数据库
wrangler d1 create party-member-ai

# 记录返回的 database_id，更新到 wrangler.toml
```

**返回示例：**
```
✅ Successfully created DB 'party-member-ai'
database_id = "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
```

**更新 wrangler.toml：**
```toml
[[d1_databases]]
binding = "DB"
database_name = "party-member-ai"
database_id = "你的database_id"  # 替换这里
```

---

## 5. 初始化数据库

```bash
# 执行 schema
wrangler d1 execute party-member-ai --file=./src/db/schema.sql
```

---

## 6. 配置密钥

```bash
# 设置 AI API Key
wrangler secret put OPENAI_API_KEY
# 或
wrangler secret put GLM_API_KEY

# 设置 JWT 密钥
wrangler secret put JWT_SECRET
```

输入后会提示你输入值

---

## 7. 本地开发

```bash
wrangler dev
```

访问：http://localhost:8787

---

## 8. 部署到生产

```bash
wrangler deploy
```

部署成功后会返回 Worker URL：
```
https://party-member-ai.你的账号.workers.dev
```

---

## 9. 配置前端

更新前端 API 地址：

```typescript
// frontend/src/services/api.ts
const API_BASE = 'https://party-member-ai.你的账号.workers.dev'
```

---

## 10. 自定义域名（可选）

```bash
# 添加域名
wrangler domains add your-domain.com

# 或在 Cloudflare Dashboard 配置
```

---

## 常用命令

| 命令 | 说明 |
|-----|------|
| `wrangler dev` | 本地开发 |
| `wrangler deploy` | 部署 |
| `wrangler tail` | 实时日志 |
| `wrangler d1 list` | 列出数据库 |
| `wrangler secret list` | 列出密钥 |

---

## 文件结构

```
worker/
├── src/
│   ├── index.ts          # 入口
│   ├── routes/           # 路由
│   │   ├── ai.ts
│   │   ├── application.ts
│   │   ├── record.ts
│   │   ├── message.ts
│   │   ├── activity.ts
│   │   └── auth.ts
│   └── db/
│       └── schema.sql    # 数据库结构
├── wrangler.toml         # Cloudflare 配置
├── package.json
└── tsconfig.json
```

---

## API 端点

| 端点 | 说明 |
|-----|------|
| `GET /health` | 健康检查 |
| `POST /api/auth/login` | 登录 |
| `POST /api/auth/register` | 注册 |
| `POST /api/ai/chat` | AI 对话 |
| `POST /api/application/review` | 申请书审核 |
| `GET /api/record/list` | 谈话记录列表 |
| `GET /api/message/list` | 消息列表 |
| `GET /api/activity/list` | 活动列表 |

---

## 注意事项

1. **API Key 安全**：不要把 API Key 写在代码里，用 `wrangler secret put` 设置
2. **数据库 ID**：每个环境（开发/生产）需要不同的数据库
3. **CORS**：在 `index.ts` 中配置允许的前端域名
4. **日志**：`wrangler tail` 可以看实时日志

---

## 下一步

1. 提供你的 AI API Key
2. 我帮你配置密钥
3. 执行部署命令
