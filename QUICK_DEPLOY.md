# 快速部署指南

## 第一步：运行设置脚本

```bash
# 给脚本添加执行权限
chmod +x setup.sh

# 运行设置脚本（会自动从 Infographic 项目复制文件）
./setup.sh
```

## 第二步：安装依赖

```bash
# 安装前端依赖
cd frontend
npm install

# 安装后端依赖
cd ../backend
npm install
```

## 第三步：配置环境变量

### 后端配置

```bash
cd backend
cp .env.example .env
```

编辑 `.env` 文件：

```env
PORT=3001
DEEPSEEK_API_KEY=your_deepseek_api_key_here

# 可选：支付功能
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret
```

### 前端配置（生产环境）

```bash
cd frontend
cp .env.example .env
```

编辑 `.env` 文件（开发环境可以不改）：

```env
VITE_API_URL=https://your-backend-domain.com
```

## 第四步：启动服务

### 开发模式

```bash
# 终端 1 - 启动后端
cd backend
npm run dev

# 终端 2 - 启动前端
cd frontend
npm run dev
```

访问：http://localhost:5173

### 生产模式

```bash
# 1. 构建前端
cd frontend
npm run build

# 2. 构建并启动后端
cd ../backend
npm run build
npm start
```

## 部署到生产环境

### 方案 1：使用 Vercel + Railway

#### 前端部署到 Vercel
1. 推送代码到 GitHub
2. 在 Vercel 导入项目
3. 设置：
   - Root Directory: `frontend`
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Environment Variables: `VITE_API_URL=https://your-backend.railway.app`

#### 后端部署到 Railway
1. 在 Railway 创建新项目
2. 连接 GitHub 仓库
3. 设置：
   - Root Directory: `backend`
   - Build Command: `npm install && npm run build`
   - Start Command: `npm start`
   - Environment Variables: 添加 `DEEPSEEK_API_KEY` 等

### 方案 2：使用 Docker

```bash
# 构建并启动
cd backend
docker-compose up -d
```

### 方案 3：VPS 手动部署

```bash
# 1. 上传代码到服务器
scp -r infographic-ai-app user@your-server:/var/www/

# 2. SSH 到服务器
ssh user@your-server

# 3. 安装依赖并构建
cd /var/www/infographic-ai-app
cd frontend && npm install && npm run build
cd ../backend && npm install && npm run build

# 4. 使用 PM2 启动后端
npm install -g pm2
pm2 start backend/dist/index.js --name infographic-api

# 5. 配置 Nginx 代理
# 参考 README.md 中的 Nginx 配置
```

## 常见问题

### Q: 前端无法连接后端？
A: 检查：
1. 后端是否正常启动（访问 http://localhost:3001/api/health）
2. 前端的 VITE_API_URL 是否正确
3. CORS 配置是否正确

### Q: AI 生成失败？
A: 检查：
1. DEEPSEEK_API_KEY 是否正确配置
2. API Key 是否有效
3. 网络是否能访问 DeepSeek API

### Q: 如何更新代码？
A: 
```bash
# 1. 更新源代码（Infographic 项目）
cd ../Infographic
git pull

# 2. 重新运行设置脚本
cd ../infographic-ai-app
./setup.sh

# 3. 重新安装依赖（如果有新依赖）
cd frontend && npm install
cd ../backend && npm install

# 4. 重新构建
cd frontend && npm run build
cd ../backend && npm run build
```

## 获取 DeepSeek API Key

1. 访问 https://platform.deepseek.com/
2. 注册/登录账号
3. 进入 API Keys 页面
4. 创建新的 API Key
5. 复制 Key 到 `.env` 文件

## 技术支持

如有问题，请查看：
- README.md - 完整文档
- DEPLOYMENT.md - 详细部署指南
- 或提交 Issue
