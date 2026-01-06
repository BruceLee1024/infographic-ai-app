# 项目结构说明

## 目录结构

```
infographic-ai-app/
├── frontend/                    # 前端应用
│   ├── src/                     # 源代码（运行 setup.sh 后生成）
│   │   ├── components/          # React 组件
│   │   │   ├── ActivationModal.tsx
│   │   │   ├── PaymentModal.tsx
│   │   │   └── OptimizationPanel.tsx
│   │   ├── services/            # 服务层
│   │   │   ├── ai-optimizer.ts  # AI 优化服务
│   │   │   ├── license.ts       # 许可证服务
│   │   │   └── payment.ts       # 支付服务
│   │   ├── App.tsx              # 根组件
│   │   ├── LandingPage.tsx      # 落地页
│   │   ├── ProductApp.tsx       # 主应用
│   │   ├── Infographic.tsx      # 信息图渲染组件
│   │   ├── VisualEditor.tsx     # 可视化编辑器
│   │   ├── TemplateConfig.ts    # 模板配置
│   │   ├── data.ts              # 示例数据
│   │   └── main.tsx             # 入口文件
│   ├── public/                  # 静态资源
│   ├── index.html               # HTML 模板
│   ├── package.json             # 依赖配置
│   ├── vite.config.ts           # Vite 配置
│   ├── tsconfig.json            # TypeScript 配置
│   ├── Dockerfile               # Docker 配置
│   ├── nginx.conf               # Nginx 配置
│   └── .env.example             # 环境变量示例
│
├── backend/                     # 后端服务
│   ├── src/                     # 源代码（运行 setup.sh 后生成）
│   │   ├── routes/              # API 路由
│   │   │   ├── license.ts       # 许可证路由
│   │   │   └── webhook.ts       # Webhook 路由
│   │   └── index.ts             # 入口文件
│   ├── scripts/                 # 脚本
│   │   └── generate-licenses.ts # 生成许可证
│   ├── data/                    # 数据存储
│   ├── package.json             # 依赖配置
│   ├── tsconfig.json            # TypeScript 配置
│   ├── Dockerfile               # Docker 配置
│   └── .env.example             # 环境变量示例
│
├── setup.sh                     # 自动设置脚本 ⭐
├── docker-compose.yml           # Docker Compose 配置
├── README.md                    # 项目说明
├── QUICK_DEPLOY.md              # 快速部署指南 ⭐
├── DEPLOYMENT.md                # 详细部署指南
├── PROJECT_STRUCTURE.md         # 本文件
└── .gitignore                   # Git 忽略配置
```

## 核心文件说明

### 前端核心文件

| 文件 | 说明 |
|------|------|
| `App.tsx` | 根组件，处理路由和全局状态 |
| `LandingPage.tsx` | 落地页，用户输入创意描述 |
| `ProductApp.tsx` | 主应用，包含所有功能（AI 生成、编辑、导出等） |
| `Infographic.tsx` | 信息图渲染组件，封装 @antv/infographic |
| `VisualEditor.tsx` | 可视化编辑器，支持拖拽和属性编辑 |
| `TemplateConfig.ts` | 模板分类和配置 |
| `services/ai-optimizer.ts` | AI 优化建议服务 |
| `services/license.ts` | 许可证验证服务 |
| `services/payment.ts` | 支付服务 |
| `components/ActivationModal.tsx` | 激活码输入弹窗 |
| `components/PaymentModal.tsx` | 支付弹窗 |
| `components/OptimizationPanel.tsx` | 优化建议面板 |

### 后端核心文件

| 文件 | 说明 |
|------|------|
| `src/index.ts` | Express 服务器入口 |
| `src/routes/license.ts` | 许可证 API（激活、验证） |
| `src/routes/webhook.ts` | Stripe Webhook 处理 |
| `scripts/generate-licenses.ts` | 生成许可证脚本 |

## 数据流

```
用户输入
  ↓
LandingPage (收集创意描述)
  ↓
ProductApp (主应用)
  ├─→ AI 生成 → DeepSeek API
  ├─→ 灵活组合 → 本地渲染
  ├─→ 模板管理 → 本地存储
  ├─→ AI 优化 → DeepSeek API
  ├─→ 导出 → PNG/SVG
  ├─→ 激活码 → Backend API
  └─→ 支付 → Stripe API → Backend Webhook
```

## 技术栈

### 前端
- **框架**: React 19 + TypeScript
- **构建工具**: Vite
- **UI 库**: Ant Design 5
- **核心库**: @antv/infographic
- **编辑器**: Monaco Editor
- **Markdown**: react-markdown

### 后端
- **运行时**: Node.js 18+
- **框架**: Express
- **语言**: TypeScript
- **数据库**: SQLite (better-sqlite3)
- **支付**: Stripe

## 环境变量

### 前端 (.env)
```env
VITE_API_URL=http://localhost:3001  # 后端 API 地址
```

### 后端 (.env)
```env
PORT=3001                           # 服务端口
DEEPSEEK_API_KEY=sk-xxx             # DeepSeek API 密钥（必需）
STRIPE_SECRET_KEY=sk_test_xxx       # Stripe 密钥（可选）
STRIPE_WEBHOOK_SECRET=whsec_xxx     # Stripe Webhook 密钥（可选）
```

## 部署流程

### 开发环境
1. 运行 `./setup.sh` 复制文件
2. 安装依赖
3. 配置环境变量
4. 启动前后端服务

### 生产环境
1. 构建前端 (`npm run build`)
2. 构建后端 (`npm run build`)
3. 部署到服务器/云平台
4. 配置 Nginx 反向代理
5. 配置 HTTPS

### Docker 部署
1. 配置环境变量
2. 运行 `docker-compose up -d`

## 依赖关系

### 前端依赖 @antv/infographic
前端项目依赖 `@antv/infographic` 包，有两种方式：

1. **本地依赖**（开发）：
   ```json
   "@antv/infographic": "file:../../Infographic"
   ```

2. **NPM 依赖**（生产）：
   ```json
   "@antv/infographic": "^1.0.0"
   ```

如果 @antv/infographic 已发布到 NPM，建议使用 NPM 依赖。

## 常用命令

### 前端
```bash
npm run dev      # 开发服务器
npm run build    # 构建生产版本
npm run preview  # 预览生产版本
```

### 后端
```bash
npm run dev      # 开发服务器（热重载）
npm run build    # 构建
npm start        # 启动生产服务器
npm run license:generate  # 生成许可证
```

## 注意事项

1. **首次使用必须运行 `setup.sh`**，它会从 Infographic 项目复制所有必要的文件
2. 生产环境需要配置正确的 `VITE_API_URL`
3. 后端的 `data` 目录需要定期备份
4. DeepSeek API Key 是必需的，否则 AI 功能无法使用
5. 支付功能是可选的，不配置也能使用其他功能

## 更新代码

当 Infographic 项目有更新时：

```bash
# 1. 更新源项目
cd ../Infographic
git pull

# 2. 重新运行设置脚本
cd ../infographic-ai-app
./setup.sh

# 3. 重新安装依赖（如有必要）
cd frontend && npm install
cd ../backend && npm install
```

## 获取帮助

- 查看 `README.md` - 项目概述
- 查看 `QUICK_DEPLOY.md` - 快速部署
- 查看 `DEPLOYMENT.md` - 详细部署指南
- 提交 Issue - 报告问题
