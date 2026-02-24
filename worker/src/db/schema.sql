-- 党员发展AI助手 数据库 Schema

-- 用户表
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  name TEXT NOT NULL,
  role TEXT DEFAULT 'user',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 申请书表
CREATE TABLE IF NOT EXISTS applications (
  id TEXT PRIMARY KEY,
  user_id TEXT,
  content TEXT,
  file_path TEXT,
  status TEXT DEFAULT 'pending',
  review_result TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  reviewed_at DATETIME,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

-- 谈话记录表
CREATE TABLE IF NOT EXISTS talk_records (
  id TEXT PRIMARY KEY,
  interviewee TEXT NOT NULL,
  talk_type TEXT NOT NULL,
  talk_date TEXT NOT NULL,
  talker TEXT NOT NULL,
  content TEXT,
  status TEXT DEFAULT 'draft',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 消息表
CREATE TABLE IF NOT EXISTS messages (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  type TEXT DEFAULT 'notice',
  user_id TEXT,
  read INTEGER DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

-- 活动表
CREATE TABLE IF NOT EXISTS activities (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  type TEXT NOT NULL,
  date TEXT NOT NULL,
  location TEXT,
  description TEXT,
  status TEXT DEFAULT 'planned',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 党员发展流程表
CREATE TABLE IF NOT EXISTS member_processes (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  stage TEXT NOT NULL,
  status TEXT DEFAULT 'pending',
  started_at DATETIME,
  completed_at DATETIME,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

-- 插入默认管理员
INSERT OR IGNORE INTO users (id, username, password, name, role) 
VALUES ('admin', 'admin', '$2a$10$YourHashedPasswordHere', '系统管理员', 'admin');

-- 插入示例消息
INSERT OR IGNORE INTO messages (id, title, content, type, read, created_at) 
VALUES 
  ('1', '欢迎使用', '欢迎使用党员发展AI助手！', 'notice', 0, datetime('now')),
  ('2', '系统更新', '系统已更新到最新版本', 'notice', 0, datetime('now'));

-- 插入示例活动
INSERT OR IGNORE INTO activities (id, name, type, date, location, status, created_at) 
VALUES 
  ('1', '支委会 - 确认入党积极分子', 'committee', '2026-03-01', '支部会议室', 'planned', datetime('now')),
  ('2', '党员大会 - 接收预备党员', 'members', '2026-03-15', '党员活动室', 'planned', datetime('now'));
