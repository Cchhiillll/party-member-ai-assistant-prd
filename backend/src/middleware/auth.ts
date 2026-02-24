import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'

export interface AuthUser {
  id: string
  username: string
  name: string
  role: string
}

// 扩展 Request 类型
declare global {
  namespace Express {
    interface Request {
      user?: AuthUser
    }
  }
}

// 生成 Token
export function generateToken(user: AuthUser): string {
  return jwt.sign(
    {
      id: user.id,
      username: user.username,
      name: user.name,
      role: user.role
    },
    JWT_SECRET,
    { expiresIn: '24h' }
  )
}

// 验证 Token
export function verifyToken(token: string): AuthUser | null {
  try {
    return jwt.verify(token, JWT_SECRET) as AuthUser
  } catch (error) {
    return null
  }
}

// 认证中间件
export function authMiddleware(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization
  
  if (!authHeader) {
    return res.status(401).json({ error: '未提供认证信息' })
  }

  const token = authHeader.split(' ')[1]
  
  if (!token) {
    return res.status(401).json({ error: 'Token 格式错误' })
  }

  const user = verifyToken(token)
  
  if (!user) {
    return res.status(401).json({ error: 'Token 无效或已过期' })
  }

  req.user = user
  next()
}

// 管理员权限中间件
export function adminMiddleware(req: Request, res: Response, next: NextFunction) {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({ error: '权限不足' })
  }
  next()
}

// 可选认证中间件（不强制要求登录）
export function optionalAuthMiddleware(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization
  
  if (authHeader) {
    const token = authHeader.split(' ')[1]
    if (token) {
      const user = verifyToken(token)
      if (user) {
        req.user = user
      }
    }
  }
  
  next()
}

export default {
  generateToken,
  verifyToken,
  authMiddleware,
  adminMiddleware,
  optionalAuthMiddleware
}
