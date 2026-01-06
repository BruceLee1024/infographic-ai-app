# 🚀 立即部署指南

你的 GitHub 仓库：https://github.com/BruceLee1024/infographic-ai-app.git

## 第一步：推送代码到 GitHub

代码已经在本地提交，现在推送到 GitHub：

```bash
cd infographic-ai-app
git push -u origin main
```

如果推送失败，检查网络连接或使用 SSH：

```bash
# 使用 SSH（如果配置了 SSH key）
git remote set-url origin git@github.com:BruceLee1024/infographic-ai-app.git
git push -u origin main
```

---

## 第二步：部署后端到 Railway

### 1. 访问 Railway

打开 https://railway.app

### 2. 创建新项目

1. 点击 "New Project"
2. 选择 "Deploy from GitHub repo"
3. 选择 `BruceLee1024/infographic-ai-app`

### 3. 配置项目

在 Railway 项目设置中：

**Root Directory**: `backend`

**Build Command**: `npm install && npm run build`

**Start Command**: `npm start`

### 4. 添加环境变量

在 Railway → Variables 中添加：

```
PORT=3001
NODE_ENV=production
DEEPSEEK_API_KEY=你的DeepSeek_API_Key
FRONTEND_URL=https://你的项目名.vercel.app
DATABASE_PATH=./data/infographic.db
```

> 💡 提示：FRONTEND_URL 先留空，等前端部署后再填

### 5. 部署

点击 "Deploy" 按钮

### 6. 获取后端 URL

部署完成后，Railway 会提供一个 URL，例如：
```
https://infographic-ai-app-production.up.railway.app
```

**复制这个 URL，下一步需要用到！**

---

## 第三步：部署前端到 Vercel

### 1. 访问 Vercel

打开 https://vercel.com

### 2. 导入项目

1. 点击 "Add New..." → "Project"
2. 选择 "Import Git Repository"
3. 选择 `BruceLee1024/infographic-ai-app`

### 3. 配置项目

**Framework Preset**: Vite

**Root Directory**: `frontend`

**Build Command**: `npm run build`

**Output Directory**: `dist`

**Install Command**: `npm install`

### 4. 添加环境变量

在 Environment Variables 中添加：

**Name**: `VITE_API_URL`

**Value**: `https://你的后端URL.railway.app`（使用第二步获取的 Railway URL）

例如：
```
VITE_API_URL=https://infographic-ai-app-production.up.railway.app
```

### 5. 部署

点击 "Deploy" 按钮

### 6. 获取前端 URL

部署完成后，Vercel 会提供一个 URL，例如：
```
https://infographic-ai-app.vercel.app
```

---

## 第四步：更新后端 CORS 配置

### 1. 回到 Railway

打开你的 Railway 项目

### 2. 更新环境变量

找到 `FRONTEND_URL` 变量，更新为 Vercel 提供的前端 URL：

```
FRONTEND_URL=https://infographic-ai-app.vercel.app
```

### 3. 重新部署

保存后，Railway 会自动重新部署

---

## 第五步：测试

### 1. 访问前端

打开 Vercel 提供的 URL：
```
https://infographic-ai-app.vercel.app
```

### 2. 测试功能

1. ✅ 页面是否正常加载
2. ✅ 输入创意描述，点击"开始创作"
3. ✅ 在设置中输入 DeepSeek API Key
4. ✅ 测试 AI 生成功能
5. ✅ 测试导出功能

### 3. 检查后端连接

打开浏览器控制台（F12），查看是否有 API 错误

如果有错误：
- 检查 `VITE_API_URL` 是否正确
- 检查后端是否正常运行
- 检查 CORS 配置

---

## 🎯 部署检查清单

### ✅ 代码推送

- [ ] 代码已推送到 GitHub
- [ ] 仓库地址：https://github.com/BruceLee1024/infographic-ai-app.git

### ✅ 后端部署（Railway）

- [ ] 项目已创建
- [ ] Root Directory 设置为 `backend`
- [ ] 环境变量已配置：
  - [ ] `PORT=3001`
  - [ ] `DEEPSEEK_API_KEY=你的key`
  - [ ] `FRONTEND_URL=前端URL`
- [ ] 部署成功
- [ ] 后端 URL 已复制

### ✅ 前端部署（Vercel）

- [ ] 项目已导入
- [ ] Root Directory 设置为 `frontend`
- [ ] 环境变量已配置：
  - [ ] `VITE_API_URL=后端URL`
- [ ] 部署成功
- [ ] 前端 URL 已复制

### ✅ 连接配置

- [ ] 后端 `FRONTEND_URL` 已更新为前端 URL
- [ ] 后端已重新部署
- [ ] 前端可以正常访问后端 API

### ✅ 功能测试

- [ ] 页面正常加载
- [ ] AI 生成功能正常
- [ ] 导出功能正常
- [ ] 无控制台错误

---

## 🔑 获取 DeepSeek API Key

1. 访问 https://platform.deepseek.com/
2. 注册/登录账号
3. 进入 API Keys 页面
4. 创建新的 API Key
5. 复制 Key 到 Railway 环境变量

---

## 📊 部署架构

```
用户浏览器
    ↓
Vercel (前端)
https://infographic-ai-app.vercel.app
    ↓ API 请求
Railway (后端)
https://infographic-ai-app-production.up.railway.app
    ↓
DeepSeek API
https://api.deepseek.com
```

---

## 🐛 常见问题

### Q1: 推送代码失败？

**解决方案**：
```bash
# 检查网络连接
ping github.com

# 或使用 SSH
git remote set-url origin git@github.com:BruceLee1024/infographic-ai-app.git
git push -u origin main
```

### Q2: Vercel 构建失败？

**检查**：
1. Root Directory 是否设置为 `frontend`
2. 本地是否能成功构建：`cd frontend && npm run build`
3. 查看 Vercel 构建日志

### Q3: 前端无法连接后端？

**检查**：
1. `VITE_API_URL` 是否正确（不要有尾部斜杠）
2. 后端是否正常运行：访问 `https://你的后端URL/health`
3. 浏览器控制台是否有 CORS 错误
4. 后端 `FRONTEND_URL` 是否正确

### Q4: AI 生成失败？

**检查**：
1. DeepSeek API Key 是否正确
2. API Key 是否有余额
3. 网络是否能访问 DeepSeek API

---

## 📱 自定义域名（可选）

### Vercel 自定义域名

1. Vercel Dashboard → Settings → Domains
2. 添加你的域名
3. 配置 DNS：
   - Type: CNAME
   - Name: 你的子域名
   - Value: cname.vercel-dns.com
4. 等待 DNS 生效

### Railway 自定义域名

1. Railway Dashboard → Settings → Domains
2. 添加你的域名
3. 配置 DNS 记录
4. 等待生效

---

## 🎉 部署完成！

恭喜！你的应用已经成功部署到生产环境。

**前端地址**: https://infographic-ai-app.vercel.app

**后端地址**: https://你的后端URL.railway.app

现在你可以：
- ✅ 分享给其他人使用
- ✅ 绑定自定义域名
- ✅ 监控访问量和性能
- ✅ 持续更新和改进

---

## 📖 更多资源

- [VERCEL_DEPLOY.md](./VERCEL_DEPLOY.md) - 详细部署指南
- [DEPLOY_QUICK_REF.md](./DEPLOY_QUICK_REF.md) - 快速参考
- [README.md](./README.md) - 项目说明

---

**祝你部署顺利！** 🚀

如有问题，请查看文档或提交 Issue。
