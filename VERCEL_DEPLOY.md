# Vercel 部署指南

## 前端部署到 Vercel

### 方法 1：通过 Vercel Dashboard（推荐）

#### 1. 准备工作

首先确保你的代码已经推送到 GitHub：

```bash
# 初始化 Git（如果还没有）
cd infographic-ai-app
git init
git add .
git commit -m "Initial commit"

# 创建 GitHub 仓库并推送
# 在 GitHub 上创建新仓库，然后：
git remote add origin https://github.com/your-username/infographic-ai-app.git
git branch -M main
git push -u origin main
```

#### 2. 在 Vercel 上导入项目

1. 访问 https://vercel.com
2. 点击 "Add New..." → "Project"
3. 选择你的 GitHub 仓库
4. 配置项目：

**Framework Preset**: Vite

**Root Directory**: `frontend`

**Build Command**: `npm run build`

**Output Directory**: `dist`

**Install Command**: `npm install`

#### 3. 配置环境变量

在 Vercel 项目设置中添加环境变量：

- **Name**: `VITE_API_URL`
- **Value**: 你的后端 API 地址（例如：`https://your-backend.railway.app`）

> 注意：如果后端还没部署，可以先留空或使用 `http://localhost:3001`，后面再更新

#### 4. 部署

点击 "Deploy" 按钮，Vercel 会自动：
- 安装依赖
- 构建项目
- 部署到 CDN

部署完成后，你会得到一个 URL，例如：`https://your-project.vercel.app`

---

### 方法 2：通过 Vercel CLI

#### 1. 安装 Vercel CLI

```bash
npm install -g vercel
```

#### 2. 登录 Vercel

```bash
vercel login
```

#### 3. 部署

```bash
cd infographic-ai-app/frontend
vercel
```

按照提示操作：
- Set up and deploy? **Y**
- Which scope? 选择你的账号
- Link to existing project? **N**
- What's your project's name? `infographic-ai`
- In which directory is your code located? `./`
- Want to override the settings? **N**

#### 4. 配置环境变量

```bash
vercel env add VITE_API_URL
```

输入你的后端 API 地址。

#### 5. 重新部署

```bash
vercel --prod
```

---

## 后端部署（推荐 Railway）

前端部署到 Vercel 后，后端需要部署到支持 Node.js 的平台。推荐使用 Railway：

### Railway 部署步骤

1. 访问 https://railway.app
2. 点击 "New Project" → "Deploy from GitHub repo"
3. 选择你的仓库
4. 配置：
   - **Root Directory**: `backend`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
5. 添加环境变量：
   - `PORT`: 3001
   - `DEEPSEEK_API_KEY`: 你的 API Key
   - `FRONTEND_URL`: 你的 Vercel 前端地址
6. 部署完成后，复制 Railway 提供的 URL

### 更新前端环境变量

1. 回到 Vercel Dashboard
2. 进入项目设置 → Environment Variables
3. 更新 `VITE_API_URL` 为 Railway 的后端 URL
4. 重新部署前端

---

## 完整部署流程

### 第一步：部署后端

1. **Railway 部署后端**
   ```
   Root Directory: backend
   Build: npm install && npm run build
   Start: npm start
   ```

2. **配置环境变量**
   ```
   PORT=3001
   DEEPSEEK_API_KEY=your_key
   FRONTEND_URL=https://your-project.vercel.app
   ```

3. **获取后端 URL**
   例如：`https://your-backend.railway.app`

### 第二步：部署前端

1. **Vercel 部署前端**
   ```
   Root Directory: frontend
   Framework: Vite
   Build: npm run build
   Output: dist
   ```

2. **配置环境变量**
   ```
   VITE_API_URL=https://your-backend.railway.app
   ```

3. **部署完成**
   访问：`https://your-project.vercel.app`

---

## 自动部署

### 设置自动部署

Vercel 会自动监听 GitHub 仓库的变化：

- **Push to main**: 自动部署到生产环境
- **Pull Request**: 自动创建预览部署

### 配置分支部署

在 Vercel Dashboard → Settings → Git：
- **Production Branch**: `main`
- **Preview Branches**: 所有分支

---

## 常见问题

### Q1: 前端无法连接后端？

**检查清单**：
1. ✅ 后端是否正常运行？访问 `https://your-backend.railway.app/health`
2. ✅ `VITE_API_URL` 是否正确配置？
3. ✅ 后端 CORS 是否允许前端域名？
4. ✅ 环境变量更新后是否重新部署？

**解决方案**：
```bash
# 在后端 .env 中添加
FRONTEND_URL=https://your-project.vercel.app

# 重新部署前端
cd frontend
vercel --prod
```

### Q2: 构建失败？

**常见原因**：
1. 依赖安装失败
2. TypeScript 类型错误
3. 环境变量缺失

**解决方案**：
```bash
# 本地测试构建
cd frontend
npm run build

# 检查错误并修复
# 然后重新推送到 GitHub
```

### Q3: 页面刷新 404？

这是因为 SPA 路由问题。已在 `vercel.json` 中配置了重写规则，应该不会出现。

如果还有问题，检查 `vercel.json` 是否存在：
```json
{
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

### Q4: 环境变量不生效？

**注意**：
- Vite 环境变量必须以 `VITE_` 开头
- 更新环境变量后必须重新部署
- 环境变量在构建时注入，不是运行时

**验证**：
```bash
# 本地测试
echo "VITE_API_URL=https://your-backend.railway.app" > .env
npm run build
npm run preview
```

---

## 性能优化

### 1. 启用 Gzip 压缩

Vercel 默认启用，无需配置。

### 2. 配置缓存

在 `vercel.json` 中添加：
```json
{
  "headers": [
    {
      "source": "/assets/(.*)",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=31536000, immutable"
        }
      ]
    }
  ]
}
```

### 3. 代码分割

Vite 已自动配置，查看 `vite.config.ts`：
```typescript
build: {
  rollupOptions: {
    output: {
      manualChunks: {
        'react-vendor': ['react', 'react-dom'],
        'antd-vendor': ['antd', '@ant-design/icons'],
      }
    }
  }
}
```

---

## 监控和日志

### Vercel Analytics

1. 在 Vercel Dashboard 启用 Analytics
2. 查看访问量、性能指标等

### 查看部署日志

1. Vercel Dashboard → Deployments
2. 点击具体部署查看日志
3. 查看构建日志和运行时日志

---

## 自定义域名

### 添加自定义域名

1. Vercel Dashboard → Settings → Domains
2. 添加你的域名（例如：`infographic.yourdomain.com`）
3. 按照提示配置 DNS：
   - **Type**: CNAME
   - **Name**: infographic
   - **Value**: cname.vercel-dns.com

4. 等待 DNS 生效（通常几分钟）
5. Vercel 自动配置 HTTPS

---

## 回滚部署

如果新部署有问题：

1. Vercel Dashboard → Deployments
2. 找到之前的稳定版本
3. 点击 "..." → "Promote to Production"

---

## 成本

Vercel 免费计划包括：
- ✅ 无限部署
- ✅ 100GB 带宽/月
- ✅ 自动 HTTPS
- ✅ 全球 CDN
- ✅ 预览部署

对于个人项目完全够用！

---

## 下一步

1. ✅ 部署前端到 Vercel
2. ✅ 部署后端到 Railway
3. ✅ 配置环境变量
4. ✅ 测试功能
5. ✅ 添加自定义域名（可选）
6. ✅ 启用 Analytics（可选）

**祝你部署顺利！** 🚀
