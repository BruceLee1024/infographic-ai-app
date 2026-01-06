# Railway 部署问题修复

## ✅ 问题已解决

配置文件已添加并推送到 GitHub：
- `backend/railway.json` - Railway 配置
- `backend/nixpacks.toml` - Nixpacks 构建配置

---

## 🚀 立即操作：在 Railway 中重新部署

### 步骤 1：确认 Railway 设置

在 Railway 项目页面，点击 **Settings**：

1. **Root Directory** 必须设置为 `backend`（不是 `./` 或留空）
2. **环境变量** 必须配置以下内容：
   ```
   PORT=3001
   NODE_ENV=production
   DEEPSEEK_API_KEY=你的DeepSeek API密钥
   DATABASE_PATH=./data/infographic.db
   ```

### 步骤 2：重新部署

**方法 A：从 Deployments 页面**
1. 点击 **Deployments** 标签
2. 点击最新部署右侧的 **⋮** 菜单
3. 选择 **Redeploy**

**方法 B：从 Settings 页面**
1. 点击 **Settings** 标签
2. 滚动到底部
3. 点击 **Redeploy** 按钮

**方法 C：触发新部署**
1. 在 GitHub 仓库中做一个小改动（比如修改 README）
2. 提交并推送
3. Railway 会自动触发新部署

### 步骤 3：监控部署

1. 点击 **Deployments** 标签
2. 查看最新部署的日志
3. 等待构建完成（通常 2-5 分钟）

### 步骤 4：获取后端 URL

部署成功后：
1. 点击 **Settings** 标签
2. 找到 **Domains** 部分
3. 如果没有域名，点击 **Generate Domain**
4. 复制生成的域名（格式：`xxx.railway.app`）

### 步骤 5：测试后端

访问：`https://你的域名/health`

应该看到：
```json
{
  "status": "ok",
  "timestamp": "2026-01-06T..."
}
```

---

## 🔧 Railway 配置说明

### railway.json

```json
{
  "build": {
    "builder": "NIXPACKS",
    "buildCommand": "npm install && npm run build"
  },
  "deploy": {
    "startCommand": "npm start"
  }
}
```

### nixpacks.toml

```toml
[phases.setup]
nixPkgs = ["nodejs-18_x"]

[phases.install]
cmds = ["npm install"]

[phases.build]
cmds = ["npm run build"]

[start]
cmd = "npm start"
```

---

## 📋 部署检查清单

确保以下配置正确：

- [x] Railway 配置文件已添加
- [x] 代码已推送到 GitHub
- [ ] Railway Root Directory = `backend`
- [ ] 环境变量已配置：
  - [ ] `PORT=3001`
  - [ ] `NODE_ENV=production`
  - [ ] `DEEPSEEK_API_KEY=你的key`
  - [ ] `DATABASE_PATH=./data/infographic.db`

---

## 🚀 重新部署步骤

1. **在 Railway 中点击 Redeploy**
2. **等待构建完成**（2-5 分钟）
3. **查看部署日志**，确保没有错误
4. **生成域名**（如果还没有）
5. **测试后端**：访问 `https://你的域名/health`

---

## 📊 预期的构建日志

成功的构建应该显示：

```
✓ Installing dependencies
✓ Building TypeScript
✓ Starting server
✓ Server running on port 3001
```

---

## 🐛 如果还有问题

### 检查 1：Root Directory

确保 Root Directory 设置为 `backend`（不是 `./` 或其他）

### 检查 2：环境变量

确保所有必需的环境变量都已配置

### 检查 3：构建日志

查看详细的构建日志，找出具体错误

### 检查 4：本地测试

```bash
cd backend
npm install
npm run build
npm start
```

如果本地可以运行，Railway 也应该可以。

---

## 💡 替代方案

如果 Railway 还是有问题，可以考虑：

### 选项 1：Render

1. 访问 https://render.com
2. 创建 Web Service
3. 连接 GitHub 仓库
4. Root Directory: `backend`
5. Build Command: `npm install && npm run build`
6. Start Command: `npm start`

### 选项 2：Fly.io

1. 访问 https://fly.io
2. 安装 Fly CLI
3. 在 backend 目录运行 `fly launch`
4. 配置环境变量
5. 部署

### 选项 3：Heroku

1. 访问 https://heroku.com
2. 创建新应用
3. 连接 GitHub
4. 配置 buildpack
5. 部署

---

## 📖 相关文档

- [RAILWAY_DEPLOY.md](./RAILWAY_DEPLOY.md) - 完整部署指南
- [DEPLOY_NOW.md](./DEPLOY_NOW.md) - 部署流程

---

**现在可以在 Railway 中重新部署了！** 🚀
