# Infographic AI - 前端

## 本地开发

```bash
npm install
npm run dev
```

访问 http://localhost:5173

## 构建

```bash
npm run build
```

构建产物在 `dist/` 目录

## 部署到 Vercel

### 方法 1：使用脚本（推荐）

```bash
cd ..
./deploy-vercel.sh
```

### 方法 2：手动部署

```bash
# 安装 Vercel CLI
npm install -g vercel

# 登录
vercel login

# 部署
vercel

# 部署到生产环境
vercel --prod
```

### 方法 3：通过 GitHub

1. 推送代码到 GitHub
2. 在 Vercel Dashboard 导入项目
3. 设置 Root Directory 为 `frontend`
4. 配置环境变量 `VITE_API_URL`
5. 部署

## 环境变量

在 Vercel Dashboard 或本地 `.env` 文件中配置：

```env
VITE_API_URL=https://your-backend-url.com
```

## 详细文档

查看 [VERCEL_DEPLOY.md](../VERCEL_DEPLOY.md) 获取完整部署指南。
