# 部署指南

## 快速部署

### 1. 安装依赖

```bash
# 前端
cd frontend
npm install

# 后端
cd ../backend
npm install
```

### 2. 配置环境变量

#### 后端 (.env)
```bash
cd backend
cp .env.example .env
# 编辑 .env 文件，填入你的配置
```

必需配置：
- `DEEPSEEK_API_KEY`: DeepSeek API 密钥
- `PORT`: 后端端口（默认 3001）

可选配置：
- `STRIPE_SECRET_KEY`: Stripe 支付密钥
- `STRIPE_WEBHOOK_SECRET`: Stripe Webhook 密钥

#### 前端 (.env)
```bash
cd frontend
cp .env.example .env
# 生产环境需要修改 VITE_API_URL
```

### 3. 启动服务

#### 开发模式
```bash
# 终端 1 - 启动后端
cd backend
npm run dev

# 终端 2 - 启动前端
cd frontend
npm run dev
```

访问 http://localhost:5173

#### 生产模式
```bash
# 构建前端
cd frontend
npm run build

# 启动后端
cd backend
npm run build
npm start
```

## Docker 部署

```bash
cd backend
docker-compose up -d
```

## 云平台部署

### Vercel (前端)
1. 连接 GitHub 仓库
2. 设置构建命令: `cd frontend && npm run build`
3. 设置输出目录: `frontend/dist`
4. 配置环境变量: `VITE_API_URL`

### Railway/Render (后端)
1. 连接 GitHub 仓库
2. 设置构建命令: `cd backend && npm install && npm run build`
3. 设置启动命令: `cd backend && npm start`
4. 配置环境变量

## 注意事项

1. 确保前端的 `VITE_API_URL` 指向正确的后端地址
2. 生产环境建议使用 HTTPS
3. 配置 CORS 允许前端域名访问后端
4. 定期备份 `backend/data` 目录
