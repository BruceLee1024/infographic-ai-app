# 🚀 Railway 立即部署

## ✅ 已完成

- ✅ 添加 `railway.json` 配置
- ✅ 添加 `nixpacks.toml` 配置
- ✅ 添加 `Procfile` 文件
- ✅ 代码已推送到 GitHub

---

## 📋 现在在 Railway 操作（3 步）

### 第 1 步：确认设置

进入你的 Railway 项目 → **Settings**：

1. **Root Directory** 
   - 必须设置为：`backend`
   - ⚠️ 不要留空，不要写 `./`

2. **环境变量**（Variables 标签）
   ```
   NODE_ENV=production
   DEEPSEEK_API_KEY=你的DeepSeek密钥
   DATABASE_PATH=./data/infographic.db
   ```
   
   注意：
   - ✅ PORT 不需要设置（Railway 自动处理）
   - ✅ FRONTEND_URL 可选（用于 CORS）

### 第 2 步：重新部署

**选择以下任一方法：**

**方法 A - 从 Deployments 页面**
1. 点击 **Deployments** 标签
2. 找到最新的部署
3. 点击右侧的 **⋮** 菜单
4. 选择 **Redeploy**

**方法 B - 从 Settings 页面**
1. 点击 **Settings** 标签
2. 滚动到页面底部
3. 点击 **Redeploy** 按钮

**方法 C - 触发新部署**
1. 在 Railway 项目页面
2. 点击右上角的 **Deploy** 按钮

### 第 3 步：等待并测试

1. **查看日志**
   - 点击 **Deployments** 标签
   - 点击正在进行的部署
   - 查看实时日志（2-5 分钟）

2. **预期的日志输出**
   ```
   ===== Nixpacks =====
   → Installing Node.js 18.x
   → Running npm ci
   → Running npm run build
   → Build completed
   
   ===== Starting =====
   → Running npm start
   → Server running on http://localhost:XXXX
   → Environment: production
   ```

3. **获取域名**
   - 部署成功后，点击 **Settings** 标签
   - 找到 **Domains** 部分
   - 如果没有域名，点击 **Generate Domain**
   - 复制域名（格式：`xxx.railway.app`）

4. **测试后端**
   - 访问：`https://你的域名/health`
   - 应该看到：
     ```json
     {
       "status": "ok",
       "timestamp": "2026-01-06T..."
     }
     ```

---

## ✅ 成功标志

如果看到以下内容，说明部署成功：

1. ✅ 部署状态显示 **Active** 或 **Success**
2. ✅ 日志中显示 "Server running"
3. ✅ `/health` 端点返回 200 状态码
4. ✅ 可以访问生成的域名

---

## ⚠️ 如果还是失败

### 检查 1：Root Directory 设置

**问题**：Railway 找不到 package.json

**解决**：
1. Settings → Service
2. Root Directory 必须是 `backend`
3. 不要有前后斜杠
4. 保存后重新部署

### 检查 2：查看详细错误

**操作**：
1. 点击失败的部署
2. 查看完整日志
3. 找到红色的错误信息
4. 根据错误信息调整

### 检查 3：环境变量

**确认**：
1. Variables 标签
2. 确保 DEEPSEEK_API_KEY 已设置
3. 确保没有拼写错误

### 检查 4：本地测试

**验证代码没问题**：
```bash
cd backend
npm install
npm run build
npm start
```

如果本地可以运行，Railway 也应该可以。

---

## 🔄 替代方案：Render

如果 Railway 还是有问题，可以试试 Render（更简单）：

1. 访问 https://render.com
2. 注册/登录
3. 点击 **New +** → **Web Service**
4. 连接 GitHub 仓库：`BruceLee1024/infographic-ai-app`
5. 配置：
   - **Name**: `infographic-ai-backend`
   - **Root Directory**: `backend`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
6. 添加环境变量（同上）
7. 点击 **Create Web Service**

Render 通常更稳定，而且免费套餐也够用。

---

## 📖 相关文档

- [RAILWAY_QUICK_FIX.md](./RAILWAY_QUICK_FIX.md) - 快速修复指南
- [RAILWAY_FIX.md](./RAILWAY_FIX.md) - 详细修复指南
- [RAILWAY_DEPLOY.md](./RAILWAY_DEPLOY.md) - 完整部署教程

---

## 📞 下一步

部署成功后：

1. **保存后端 URL**
   - 例如：`https://infographic-ai-backend-production.up.railway.app`

2. **部署前端**
   - 按照 [VERCEL_DEPLOY.md](./VERCEL_DEPLOY.md) 操作
   - 在 Vercel 中设置环境变量：
     ```
     VITE_API_URL=你的后端URL
     ```

3. **测试完整流程**
   - 访问前端网站
   - 测试 AI 生成功能
   - 确认前后端通信正常

---

**配置已更新并推送，现在去 Railway 重新部署吧！** 🚀
