# 部署快速参考

## 🚀 一键部署

### Vercel（前端）

```bash
./deploy-vercel.sh
```

或访问：https://vercel.com/new

### Railway（后端）

访问：https://railway.app/new

---

## 📋 部署清单

### ✅ 前端（Vercel）

- [ ] 推送代码到 GitHub
- [ ] 在 Vercel 导入项目
- [ ] 设置 Root Directory: `frontend`
- [ ] 配置环境变量: `VITE_API_URL`
- [ ] 部署

### ✅ 后端（Railway）

- [ ] 在 Railway 导入项目
- [ ] 设置 Root Directory: `backend`
- [ ] 配置环境变量:
  - `PORT=3001`
  - `DEEPSEEK_API_KEY=your_key`
  - `FRONTEND_URL=https://your-vercel-app.vercel.app`
- [ ] 部署
- [ ] 复制后端 URL

### ✅ 连接前后端

- [ ] 更新 Vercel 的 `VITE_API_URL` 为后端 URL
- [ ] 重新部署前端
- [ ] 测试功能

---

## 🔑 环境变量

### 前端（Vercel）

| 变量 | 说明 | 示例 |
|------|------|------|
| `VITE_API_URL` | 后端 API 地址 | `https://your-backend.railway.app` |

### 后端（Railway）

| 变量 | 说明 | 必需 |
|------|------|------|
| `PORT` | 端口号 | ✅ |
| `DEEPSEEK_API_KEY` | DeepSeek API 密钥 | ✅ |
| `FRONTEND_URL` | 前端地址（CORS） | ✅ |
| `STRIPE_SECRET_KEY` | Stripe 密钥 | ❌ |
| `STRIPE_WEBHOOK_SECRET` | Stripe Webhook | ❌ |

---

## 🔗 有用的链接

- **Vercel Dashboard**: https://vercel.com/dashboard
- **Railway Dashboard**: https://railway.app/dashboard
- **DeepSeek API**: https://platform.deepseek.com/
- **GitHub**: https://github.com

---

## 📖 详细文档

- [VERCEL_DEPLOY.md](./VERCEL_DEPLOY.md) - Vercel 完整部署指南
- [QUICK_DEPLOY.md](./QUICK_DEPLOY.md) - 快速部署指南
- [README.md](./README.md) - 项目说明

---

## 💡 常见问题

**Q: 前端无法连接后端？**
- 检查 `VITE_API_URL` 是否正确
- 检查后端 CORS 配置
- 检查后端是否正常运行

**Q: 构建失败？**
- 本地测试 `npm run build`
- 检查依赖是否完整
- 查看 Vercel 构建日志

**Q: 环境变量不生效？**
- 确保变量名以 `VITE_` 开头
- 更新后重新部署
- 清除缓存重新构建

---

## 🎯 部署顺序

1. **先部署后端** → 获取后端 URL
2. **配置前端环境变量** → 使用后端 URL
3. **部署前端** → 完成！

---

**祝你部署顺利！** 🚀
