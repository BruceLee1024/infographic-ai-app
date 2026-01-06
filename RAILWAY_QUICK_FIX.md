# Railway 快速修复指南

## 🎯 问题

Railway 报错：`Railpack could not determine how to build the app`

## ✅ 解决方案

配置文件已添加到 GitHub，现在需要在 Railway 中重新部署。

---

## 📋 立即操作（3 步）

### 1️⃣ 检查 Railway 设置

进入 Railway 项目 → **Settings**：

- **Root Directory** = `backend` ✅
- **环境变量**：
  ```
  NODE_ENV=production
  DEEPSEEK_API_KEY=你的密钥
  DATABASE_PATH=./data/infographic.db
  ```
  （注意：PORT 不需要手动设置，Railway 会自动处理）

### 2️⃣ 重新部署

**方法 A（推荐）**：
- 点击 **Deployments** 标签
- 点击最新部署的 **⋮** 菜单
- 选择 **Redeploy**

**方法 B**：
- 点击 **Settings** 标签
- 滚动到底部
- 点击 **Redeploy** 按钮

### 3️⃣ 等待并测试

1. 查看部署日志（2-5 分钟）
2. 部署成功后，点击 **Settings** → **Domains**
3. 如果没有域名，点击 **Generate Domain**
4. 测试：访问 `https://你的域名/health`

---

## 🎉 成功标志

访问 `/health` 应该返回：
```json
{
  "status": "ok",
  "timestamp": "2026-01-06T..."
}
```

---

## ⚠️ 如果还是失败

### 检查 Root Directory
- 必须是 `backend`（不要有斜杠）
- 不能是 `./` 或留空

### 查看构建日志
- 点击失败的部署
- 查看详细错误信息
- 确认是否找到了 `railway.json` 和 `nixpacks.toml`

### 最后手段：删除重建
1. 删除当前 Railway 项目
2. 创建新项目
3. 连接 GitHub 仓库
4. Root Directory 设置为 `backend`
5. 添加环境变量
6. 部署

---

## 📖 详细文档

- [RAILWAY_FIX.md](./RAILWAY_FIX.md) - 完整修复指南
- [RAILWAY_DEPLOY.md](./RAILWAY_DEPLOY.md) - 部署教程

---

**配置已就绪，去 Railway 点击 Redeploy 吧！** 🚀
