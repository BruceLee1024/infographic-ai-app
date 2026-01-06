import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { webhookRouter } from './routes/webhook';
import { subscriptionRouter } from './routes/subscription';
import { paymentRouter } from './routes/payment';
import { licenseRouter } from './routes/license';
import { initDatabase } from './db/init';

// 加载环境变量
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// 初始化数据库
initDatabase();

// CORS 配置
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
}));

// Webhook 路由需要原始 body（用于签名验证）
app.use('/api/webhooks', express.raw({ type: 'application/json' }), webhookRouter);

// 其他路由使用 JSON 解析
app.use(express.json());

// 健康检查
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// API 路由
app.use('/api/subscription', subscriptionRouter);
app.use('/api/payment', paymentRouter);
app.use('/api/license', licenseRouter);

// 错误处理
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    error: err.message || 'Internal Server Error',
  });
});

// 启动服务器
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔗 Frontend URL: ${process.env.FRONTEND_URL || 'http://localhost:5173'}`);
});
