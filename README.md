# Infographic AI - 智能信息图生成应用

基于 AntV Infographic 的 AI 驱动信息图生成工具。

## 功能特性

- 🤖 **AI 智能生成**：使用 DeepSeek API 自动生成信息图
- 🎨 **灵活组合**：自由组合结构布局和数据项
- 🎭 **模板管理**：内置丰富模板，支持自定义模板
- 💡 **AI 优化建议**：智能分析并提供优化建议
- 🎯 **品牌配色**：保存和管理品牌配色方案
- 📦 **批量生成**：一次生成多个版本
- 📥 **多格式导出**：支持 PNG（1-5x 高清）和 SVG 导出
- 🔑 **激活码系统**：支持许可证管理
- 💳 **支付集成**：集成支付功能

## 项目结构

```
infographic-ai-app/
├── frontend/          # 前端应用（Vite + React）
│   ├── src/
│   │   ├── components/    # 组件
│   │   ├── services/      # 服务层
│   │   ├── App.tsx        # 主应用
│   │   ├── LandingPage.tsx
│   │   └── ProductApp.tsx
│   ├── package.json
│   └── vite.config.ts
├── backend/           # 后端服务（Express + TypeScript）
│   ├── src/
│   │   ├── routes/        # API 路由
│   │   ├── index.ts       # 入口文件
│   │   └── ...
│   ├── package.json
│   └── tsconfig.json
└── README.md
```

## 快速开始

### 前置要求

- Node.js >= 18
- npm 或 yarn

### 1. 安装依赖

```bash
# 安装前端依赖
cd frontend
npm install

# 安装后端依赖
cd ../backend
npm install
```

### 2. 配置环境变量

#### 后端配置

复制 `backend/.env.example` 到 `backend/.env`，并配置：

```env
PORT=3001
DEEPSEEK_API_KEY=your_deepseek_api_key
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret
```

### 3. 启动服务

#### 开发模式

```bash
# 启动后端（终端 1）
cd backend
npm run dev

# 启动前端（终端 2）
cd frontend
npm run dev
```

前端访问：http://localhost:5173
后端 API：http://localhost:3001

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

## 部署指南

### 快速部署到 Vercel（推荐）

前端部署到 Vercel 非常简单：

```bash
# 使用部署脚本
./deploy-vercel.sh
```

或者通过 Vercel Dashboard：
1. 访问 https://vercel.com
2. 导入 GitHub 仓库
3. 设置 Root Directory 为 `frontend`
4. 配置环境变量 `VITE_API_URL`
5. 点击部署

**详细步骤请查看 [VERCEL_DEPLOY.md](./VERCEL_DEPLOY.md)**

### 使用 Docker

```bash
# 构建镜像
docker-compose build

# 启动服务
docker-compose up -d
```

### 手动部署

#### 前端部署（Vercel/Netlify）

1. 构建前端：
```bash
cd frontend
npm run build
```

2. 将 `dist` 目录部署到静态托管服务

3. 配置环境变量：
```
VITE_API_URL=https://your-backend-api.com
```

#### 后端部署（Railway/Render/VPS）

1. 构建后端：
```bash
cd backend
npm run build
```

2. 启动服务：
```bash
npm start
```

3. 配置环境变量（同上）

### Nginx 配置示例

```nginx
server {
    listen 80;
    server_name your-domain.com;

    # 前端
    location / {
        root /var/www/infographic-ai/frontend/dist;
        try_files $uri $uri/ /index.html;
    }

    # 后端 API
    location /api {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

## API 文档

### 激活码相关

- `POST /api/license/activate` - 激活许可证
- `POST /api/license/validate` - 验证许可证

### 支付相关

- `POST /api/payment/create-checkout-session` - 创建支付会话
- `POST /api/webhook` - Stripe Webhook

## 技术栈

### 前端
- React 19
- TypeScript
- Vite
- Ant Design
- @antv/infographic
- Monaco Editor

### 后端
- Node.js
- Express
- TypeScript
- Stripe

## 许可证

MIT License

## 支持

如有问题，请提交 Issue 或联系支持团队。
