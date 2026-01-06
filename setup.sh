#!/bin/bash

# Infographic AI 应用部署脚本
# 此脚本会从 Infographic 项目复制必要的文件到独立的部署项目

set -e

echo "🚀 开始设置 Infographic AI 应用..."

# 颜色定义
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# 获取脚本所在目录
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SOURCE_DIR="$(cd "$SCRIPT_DIR/../Infographic" && pwd)"

echo -e "${BLUE}源目录: $SOURCE_DIR${NC}"
echo -e "${BLUE}目标目录: $SCRIPT_DIR${NC}"

# 1. 复制前端文件
echo -e "\n${YELLOW}📦 复制前端文件...${NC}"

# 创建前端目录结构
mkdir -p "$SCRIPT_DIR/frontend/src/components"
mkdir -p "$SCRIPT_DIR/frontend/src/services"
mkdir -p "$SCRIPT_DIR/frontend/src/utils"
mkdir -p "$SCRIPT_DIR/frontend/public"

# 复制前端源文件
echo "  - 复制主应用文件..."
cp "$SOURCE_DIR/dev/src/App.tsx" "$SCRIPT_DIR/frontend/src/"
cp "$SOURCE_DIR/dev/src/LandingPage.tsx" "$SCRIPT_DIR/frontend/src/"
cp "$SOURCE_DIR/dev/src/ProductApp.tsx" "$SCRIPT_DIR/frontend/src/"
cp "$SOURCE_DIR/dev/src/Infographic.tsx" "$SCRIPT_DIR/frontend/src/"
cp "$SOURCE_DIR/dev/src/VisualEditor.tsx" "$SCRIPT_DIR/frontend/src/"
cp "$SOURCE_DIR/dev/src/TemplateConfig.ts" "$SCRIPT_DIR/frontend/src/"
cp "$SOURCE_DIR/dev/src/data.ts" "$SCRIPT_DIR/frontend/src/"

# 复制组件
echo "  - 复制组件..."
cp -r "$SOURCE_DIR/dev/src/components/"* "$SCRIPT_DIR/frontend/src/components/" 2>/dev/null || true

# 复制服务
echo "  - 复制服务..."
cp -r "$SOURCE_DIR/dev/src/services/"* "$SCRIPT_DIR/frontend/src/services/" 2>/dev/null || true

# 复制工具函数
echo "  - 复制工具函数..."
cp -r "$SOURCE_DIR/dev/src/utils/"* "$SCRIPT_DIR/frontend/src/utils/" 2>/dev/null || true

# 创建入口文件
echo "  - 创建入口文件..."
cat > "$SCRIPT_DIR/frontend/src/main.tsx" << 'EOF'
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
EOF

echo -e "${GREEN}✓ 前端文件复制完成${NC}"

# 2. 复制后端文件
echo -e "\n${YELLOW}📦 复制后端文件...${NC}"

# 创建后端目录结构
mkdir -p "$SCRIPT_DIR/backend/src/routes"
mkdir -p "$SCRIPT_DIR/backend/scripts"
mkdir -p "$SCRIPT_DIR/backend/data"

# 复制后端源文件
echo "  - 复制后端源文件..."
cp -r "$SOURCE_DIR/server/src/"* "$SCRIPT_DIR/backend/src/" 2>/dev/null || true
cp -r "$SOURCE_DIR/server/scripts/"* "$SCRIPT_DIR/backend/scripts/" 2>/dev/null || true

# 复制后端配置文件
echo "  - 复制后端配置..."
cp "$SOURCE_DIR/server/package.json" "$SCRIPT_DIR/backend/"
cp "$SOURCE_DIR/server/tsconfig.json" "$SCRIPT_DIR/backend/"
cp "$SOURCE_DIR/server/.env.example" "$SCRIPT_DIR/backend/"
cp "$SOURCE_DIR/server/.gitignore" "$SCRIPT_DIR/backend/" 2>/dev/null || true

# 复制 Docker 相关文件
if [ -f "$SOURCE_DIR/server/Dockerfile" ]; then
    echo "  - 复制 Docker 配置..."
    cp "$SOURCE_DIR/server/Dockerfile" "$SCRIPT_DIR/backend/"
    cp "$SOURCE_DIR/server/docker-compose.yml" "$SCRIPT_DIR/backend/" 2>/dev/null || true
fi

echo -e "${GREEN}✓ 后端文件复制完成${NC}"

# 3. 创建环境变量示例文件
echo -e "\n${YELLOW}📝 创建环境变量配置...${NC}"

cat > "$SCRIPT_DIR/frontend/.env.example" << 'EOF'
# API 地址（生产环境需要修改）
VITE_API_URL=http://localhost:3001
EOF

echo -e "${GREEN}✓ 环境变量配置创建完成${NC}"

# 4. 创建 .gitignore
echo -e "\n${YELLOW}📝 创建 .gitignore...${NC}"

cat > "$SCRIPT_DIR/.gitignore" << 'EOF'
# Dependencies
node_modules/
*/node_modules/

# Build outputs
dist/
*/dist/
build/
*/build/

# Environment variables
.env
.env.local
.env.*.local
*/.env
*/.env.local

# Logs
logs/
*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# Editor
.vscode/
.idea/
*.swp
*.swo
*~

# OS
.DS_Store
Thumbs.db

# Data
backend/data/*.json
!backend/data/.gitkeep
EOF

touch "$SCRIPT_DIR/backend/data/.gitkeep"

echo -e "${GREEN}✓ .gitignore 创建完成${NC}"

# 5. 创建部署文档
echo -e "\n${YELLOW}📝 创建部署文档...${NC}"

cat > "$SCRIPT_DIR/DEPLOYMENT.md" << 'EOF'
# 部署指南

## 快速部署

### 1. 安装依赖

```bash
# 前端
cd frontend
npm install

# 后端
cd ../backend
npm install
```

### 2. 配置环境变量

#### 后端 (.env)
```bash
cd backend
cp .env.example .env
# 编辑 .env 文件，填入你的配置
```

必需配置：
- `DEEPSEEK_API_KEY`: DeepSeek API 密钥
- `PORT`: 后端端口（默认 3001）

可选配置：
- `STRIPE_SECRET_KEY`: Stripe 支付密钥
- `STRIPE_WEBHOOK_SECRET`: Stripe Webhook 密钥

#### 前端 (.env)
```bash
cd frontend
cp .env.example .env
# 生产环境需要修改 VITE_API_URL
```

### 3. 启动服务

#### 开发模式
```bash
# 终端 1 - 启动后端
cd backend
npm run dev

# 终端 2 - 启动前端
cd frontend
npm run dev
```

访问 http://localhost:5173

#### 生产模式
```bash
# 构建前端
cd frontend
npm run build

# 启动后端
cd backend
npm run build
npm start
```

## Docker 部署

```bash
cd backend
docker-compose up -d
```

## 云平台部署

### Vercel (前端)
1. 连接 GitHub 仓库
2. 设置构建命令: `cd frontend && npm run build`
3. 设置输出目录: `frontend/dist`
4. 配置环境变量: `VITE_API_URL`

### Railway/Render (后端)
1. 连接 GitHub 仓库
2. 设置构建命令: `cd backend && npm install && npm run build`
3. 设置启动命令: `cd backend && npm start`
4. 配置环境变量

## 注意事项

1. 确保前端的 `VITE_API_URL` 指向正确的后端地址
2. 生产环境建议使用 HTTPS
3. 配置 CORS 允许前端域名访问后端
4. 定期备份 `backend/data` 目录
EOF

echo -e "${GREEN}✓ 部署文档创建完成${NC}"

# 完成
echo -e "\n${GREEN}✅ 设置完成！${NC}"
echo -e "\n${BLUE}下一步：${NC}"
echo "1. cd frontend && npm install"
echo "2. cd backend && npm install"
echo "3. 配置环境变量（backend/.env）"
echo "4. npm run dev 启动开发服务器"
echo -e "\n详细说明请查看 DEPLOYMENT.md"
