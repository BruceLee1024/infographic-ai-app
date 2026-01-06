import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';

// Railway 使用 /tmp 目录存储临时文件
const DB_PATH = process.env.DATABASE_PATH || (process.env.NODE_ENV === 'production' ? '/tmp/infographic.db' : './data/infographic.db');

// 确保数据目录存在
const dbDir = path.dirname(DB_PATH);
if (!fs.existsSync(dbDir)) {
  try {
    fs.mkdirSync(dbDir, { recursive: true });
  } catch (error) {
    console.error('Failed to create database directory:', error);
  }
}

// 创建数据库连接
export const db = new Database(DB_PATH);

// 初始化数据库表
export function initDatabase() {
  console.log('📦 Initializing database at:', DB_PATH);

  // 用户表
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      email TEXT UNIQUE NOT NULL,
      name TEXT,
      subscription_type TEXT CHECK(subscription_type IN ('subscription', 'lifetime')),
      subscription_active INTEGER DEFAULT 0,
      subscription_expires_at TEXT,
      lemon_customer_id TEXT,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // 订单表
  db.exec(`
    CREATE TABLE IF NOT EXISTS orders (
      id TEXT PRIMARY KEY,
      user_email TEXT NOT NULL,
      lemon_order_id TEXT UNIQUE,
      amount REAL NOT NULL,
      currency TEXT DEFAULT 'USD',
      status TEXT NOT NULL,
      product_type TEXT CHECK(product_type IN ('subscription', 'lifetime')),
      custom_data TEXT,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_email) REFERENCES users(email)
    )
  `);

  // 订阅表
  db.exec(`
    CREATE TABLE IF NOT EXISTS subscriptions (
      id TEXT PRIMARY KEY,
      user_email TEXT NOT NULL,
      lemon_subscription_id TEXT UNIQUE,
      status TEXT NOT NULL,
      renews_at TEXT,
      ends_at TEXT,
      cancelled_at TEXT,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_email) REFERENCES users(email)
    )
  `);

  // Webhook 日志表（用于调试）
  db.exec(`
    CREATE TABLE IF NOT EXISTS webhook_logs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      event_name TEXT NOT NULL,
      payload TEXT NOT NULL,
      processed INTEGER DEFAULT 0,
      error TEXT,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // 激活码表
  db.exec(`
    CREATE TABLE IF NOT EXISTS licenses (
      id TEXT PRIMARY KEY,
      license_key TEXT UNIQUE NOT NULL,
      type TEXT CHECK(type IN ('trial', 'monthly', 'yearly', 'lifetime')) NOT NULL,
      status TEXT CHECK(status IN ('active', 'used', 'expired')) DEFAULT 'active',
      user_email TEXT,
      email TEXT,
      note TEXT,
      activated_at TEXT,
      expires_at TEXT,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // 创建索引
  db.exec(`
    CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
    CREATE INDEX IF NOT EXISTS idx_orders_user_email ON orders(user_email);
    CREATE INDEX IF NOT EXISTS idx_subscriptions_user_email ON subscriptions(user_email);
    CREATE INDEX IF NOT EXISTS idx_licenses_key ON licenses(license_key);
    CREATE INDEX IF NOT EXISTS idx_licenses_status ON licenses(status);
  `);

  console.log('✅ Database initialized successfully');
}

// 辅助函数：生成 UUID
export function generateId(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}
