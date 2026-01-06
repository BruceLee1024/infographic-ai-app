# 🚀 开始使用 Infographic AI

欢迎使用 Infographic AI！这是一个独立的可部署项目。

## ⚡ 快速开始（3 步）

### 1️⃣ 运行设置脚本

```bash
./setup.sh
```

这个脚本会自动从 `Infographic` 项目复制所有必要的文件到当前项目。

### 2️⃣ 安装依赖

```bash
# 前端
cd frontend
npm install

# 后端
cd ../backend
npm install
cd ..
```

### 3️⃣ 配置并启动

```bash
# 配置后端环境变量
cd backend
cp .env.example .env
# 编辑 .env 文件，添加你的 DEEPSEEK_API_KEY

# 启动后端（终端 1）
npm run dev

# 启动前端（终端 2，新开一个终端）
cd ../frontend
npm run dev
```

访问 http://localhost:5173 🎉

## 📚 详细文档

- **[QUICK_DEPLOY.md](./QUICK_DEPLOY.md)** - 快速部署指南（推荐阅读）
- **[README.md](./README.md)** - 完整项目说明
- **[PROJECT_STRUCTURE.md](./PROJECT_STRUCTURE.md)** - 项目结构详解
- **[DEPLOYMENT.md](./DEPLOYMENT.md)** - 生产环境部署

## 🔑 获取 DeepSeek API Key

1. 访问 https://platform.deepseek.com/
2. 注册/登录
3. 创建 API Key
4. 复制到 `backend/.env` 文件

## ❓ 常见问题

**Q: setup.sh 报错找不到文件？**  
A: 确保 `Infographic` 项目在上一级目录，即 `../Infographic`

**Q: 前端无法连接后端？**  
A: 检查后端是否启动，访问 http://localhost:3001/api/health

**Q: AI 生成失败？**  
A: 检查 `backend/.env` 中的 `DEEPSEEK_API_KEY` 是否正确

## 🐳 使用 Docker（可选）

```bash
# 配置环境变量
cp backend/.env.example backend/.env
# 编辑 backend/.env

# 启动
docker-compose up -d
```

## 📦 项目包含的功能

✅ AI 智能生成信息图  
✅ 灵活组合模式  
✅ 模板管理  
✅ AI 优化建议  
✅ 品牌配色管理  
✅ 批量生成  
✅ 高清导出（PNG/SVG）  
✅ 激活码系统  
✅ 支付集成  

## 🎯 下一步

1. 阅读 [QUICK_DEPLOY.md](./QUICK_DEPLOY.md) 了解部署选项
2. 查看 [PROJECT_STRUCTURE.md](./PROJECT_STRUCTURE.md) 了解代码结构
3. 开始开发或部署到生产环境

## 💡 提示

- 开发时前端会自动代理 `/api` 请求到后端
- 生产环境需要配置 `VITE_API_URL` 环境变量
- 支付功能是可选的，不配置也能使用其他功能

---

**祝你使用愉快！** 🎨✨
