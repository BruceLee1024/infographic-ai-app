# Railway 后端部署指南

## 🚀 快速部署到 Railway

### 第一步：访问 Railway

打开 https://railway.app

### 第二步：登录/注册

1. 点击 **Login** 或 **Start a New Project**
2. 选择 **Login with GitHub**
3. 授权 Railway 访问你的 GitHub

### 第三步：创建新项目

1. 点击 **New Project**
2. 选择 **Deploy from GitHub repo**
3. 如果是第一次使用，需要：
   - 点击 **Configure GitHub App**
   - 选择你的 GitHub 账号
   - 选择 **Only select repositories**
   - 选择 `infographic-ai-app` 仓库
   - 点击 **Install & Authorize**

4. 回到 Railway，选择 `BruceLee1024/infographic-ai-app`

### 第四步：配置项目

Railway 会自动检测到这是一个 Node.js 项目。

#### 重要配置：

1. **点击项目卡片** 进入项目详情

2. **设置 Root Directory**：
   - 点击 **Settings** 标签
   - 找到 **Root Directory**
   - 输入：`backend`
   - 点击 **Save**

3. **配置构建命令**（通常自动检测，如果没有则手动设置）：
   - Build Command: `npm install && npm run build`
   - Start Command: `npm start`

### 第五步：添加环境变量

1. 点击 **Variables** 标签
2. 点击 **+ New Variable** 添加以下变量：

#### 必需的环境变量：

```
PORT=3001
NODE_ENV=production
DEEPSEEK_API_KEY=你的DeepSeek_API_Key
DATABASE_PATH=./data/infographic.db
```

#### 可选的环境变量（如果需要支付功能）：

```
STRIPE_SECRET_KEY=你的Stripe密钥
STRIPE_WEBHOOK_SECRET=你的Stripe_Webhook密钥
```

#### FRONTEND_URL（先留空，等前端部署后再填）：

```
FRONTEND_URL=
```

> 💡 提示：FRONTEND_URL 等前端部署完成后再填写

### 第六步：部署

1. 环境变量配置完成后，Railway 会自动开始部署
2. 等待部署完成（通常 2-5 分钟）
3. 查看部署日志，确保没有错误

### 第七步：获取后端 URL

部署成功后：

1. 在项目页面，点击 **Settings** 标签
2. 找到 **Domains** 部分
3. 点击 **Generate Domain**
4. Railway 会生成一个域名，例如：
   ```
   https://infographic-ai-app-production.up.railway.app
   ```

5. **复制这个 URL**，下一步部署前端时需要用到！

### 第八步：测试后端

访问你的后端 URL + `/health`，例如：
```
https://your-backend.railway.app/health
```

应该看到类似这样的响应：
```json
{
  "status": "ok",
  "timestamp": "2026-01-06T..."
}
```

---

## 📋 配置检查清单

部署前确保：

- [ ] 已登录 Railway
- [ ] 已授权 GitHub 仓库访问
- [ ] Root Directory 设置为 `backend`
- [ ] 环境变量已配置：
  - [ ] `PORT=3001`
  - [ ] `NODE_ENV=production`
  - [ ] `DEEPSEEK_API_KEY=你的key`
  - [ ] `DATABASE_PATH=./data/infographic.db`
- [ ] 已生成域名
- [ ] 后端 URL 已复制

---

## 🔑 获取 DeepSeek API Key

如果你还没有 DeepSeek API Key：

1. 访问 https://platform.deepseek.com/
2. 注册/登录账号
3. 进入 **API Keys** 页面
4. 点击 **Create API Key**
5. 复制生成的 Key
6. 粘贴到 Railway 的 `DEEPSEEK_API_KEY` 环境变量

---

## 📊 Railway 配置示例

### 环境变量配置：

| 变量名 | 值 | 说明 |
|--------|-----|------|
| `PORT` | `3001` | 服务端口 |
| `NODE_ENV` | `production` | 运行环境 |
| `DEEPSEEK_API_KEY` | `sk-xxx...` | DeepSeek API 密钥 |
| `DATABASE_PATH` | `./data/infographic.db` | 数据库路径 |
| `FRONTEND_URL` | （稍后填写） | 前端地址（CORS） |

---

## 🐛 常见问题

### Q1: 部署失败？

**检查**：
1. Root Directory 是否设置为 `backend`
2. 环境变量是否正确配置
3. 查看部署日志中的错误信息

**解决**：
```bash
# 本地测试构建
cd backend
npm install
npm run build
npm start
```

### Q2: 无法访问后端？

**检查**：
1. 是否已生成域名？
2. 部署是否成功？
3. 访问 `/health` 端点测试

### Q3: 数据库错误？

**原因**：Railway 的文件系统是临时的，重启后数据会丢失。

**解决方案**：
1. 使用 Railway 的 Volume（持久化存储）
2. 或使用外部数据库（如 PostgreSQL）

**添加 Volume**：
1. 在 Railway 项目中点击 **+ New**
2. 选择 **Volume**
3. 设置 Mount Path: `/app/data`
4. 重新部署

### Q4: CORS 错误？

**原因**：`FRONTEND_URL` 未配置或配置错误

**解决**：
1. 等前端部署完成
2. 获取前端 URL
3. 在 Railway 更新 `FRONTEND_URL`
4. 重新部署

---

## 🔄 更新后端代码

当你更新代码并推送到 GitHub 后：

1. Railway 会自动检测到更新
2. 自动重新部署
3. 无需手动操作

如果需要手动重新部署：
1. 进入 Railway 项目
2. 点击 **Deployments** 标签
3. 点击 **Redeploy**

---

## 💰 Railway 定价

**免费计划**：
- ✅ $5 免费额度/月
- ✅ 500 小时运行时间
- ✅ 自动休眠（无流量时）
- ✅ 自动唤醒（有请求时）

对于个人项目完全够用！

---

## 📈 监控和日志

### 查看日志

1. Railway 项目页面
2. 点击 **Deployments** 标签
3. 选择最新的部署
4. 查看实时日志

### 查看指标

1. 点击 **Metrics** 标签
2. 查看：
   - CPU 使用率
   - 内存使用
   - 网络流量
   - 请求数量

---

## 🎯 部署完成后

后端部署成功后，你会得到：

✅ 后端 URL：`https://your-backend.railway.app`

**下一步**：

1. 复制后端 URL
2. 回到 Railway，更新 `FRONTEND_URL` 环境变量
3. 前往 Vercel 部署前端
4. 在 Vercel 配置 `VITE_API_URL` 为后端 URL

---

## 📖 相关文档

- [VERCEL_DEPLOY.md](./VERCEL_DEPLOY.md) - 前端部署指南
- [DEPLOY_NOW.md](./DEPLOY_NOW.md) - 完整部署流程
- [DEPLOY_QUICK_REF.md](./DEPLOY_QUICK_REF.md) - 快速参考

---

**祝你部署顺利！** 🚀
