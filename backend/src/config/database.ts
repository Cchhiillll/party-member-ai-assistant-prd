import sqlite3 from 'sqlite3'
import { open } from 'sqlite'
import { Database } from 'sqlite3'

let db: any = null

export async function initDatabase() {
  db = await open({
    filename: './data/party_member_ai.db',
    driver: sqlite3.Database
  })

  // 创建表
  await db.exec(`
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
      user_id TEXT NOT NULL,
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
  `)

  // 插入默认管理员
  const adminExists = await db.get('SELECT id FROM users WHERE username = ?', ['admin'])
  if (!adminExists) {
    await db.run(
      'INSERT INTO users (id, username, password, name, role) VALUES (?, ?, ?, ?, ?)',
      ['admin', 'admin', 'admin123', '系统管理员', 'admin']
    )
  }

  console.log('✅ Database initialized')
  return db
}

export function getDatabase() {
  return db
}

export default { initDatabase, getDatabase }
