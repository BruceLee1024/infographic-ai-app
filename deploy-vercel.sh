#!/bin/bash

# Vercel 快速部署脚本

set -e

echo "🚀 Vercel 部署脚本"
echo ""

# 颜色定义
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# 检查是否在正确的目录
if [ ! -f "frontend/package.json" ]; then
    echo -e "${RED}❌ 错误：请在 infographic-ai-app 目录下运行此脚本${NC}"
    exit 1
fi

# 检查是否安装了 Vercel CLI
if ! command -v vercel &> /dev/null; then
    echo -e "${YELLOW}⚠️  未检测到 Vercel CLI${NC}"
    echo -e "${BLUE}正在安装 Vercel CLI...${NC}"
    npm install -g vercel
fi

# 进入前端目录
cd frontend

echo -e "${BLUE}📦 检查依赖...${NC}"
if [ ! -d "node_modules" ]; then
    echo -e "${YELLOW}安装依赖...${NC}"
    npm install
fi

echo ""
echo -e "${BLUE}🔧 配置检查${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# 检查环境变量
if [ ! -f ".env" ]; then
    echo -e "${YELLOW}⚠️  未找到 .env 文件${NC}"
    echo -e "${BLUE}创建 .env 文件...${NC}"
    cat > .env << EOF
# 后端 API 地址
# 部署后需要更新为实际的后端地址
VITE_API_URL=http://localhost:3001
EOF
    echo -e "${GREEN}✓ 已创建 .env 文件${NC}"
    echo -e "${YELLOW}⚠️  请在 Vercel Dashboard 中配置 VITE_API_URL 环境变量${NC}"
fi

# 检查 vercel.json
if [ ! -f "vercel.json" ]; then
    echo -e "${YELLOW}⚠️  未找到 vercel.json${NC}"
    echo -e "${BLUE}创建 vercel.json...${NC}"
    cat > vercel.json << 'EOF'
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "devCommand": "npm run dev",
  "installCommand": "npm install",
  "framework": "vite",
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
EOF
    echo -e "${GREEN}✓ 已创建 vercel.json${NC}"
fi

echo ""
echo -e "${BLUE}🏗️  本地构建测试...${NC}"
npm run build

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ 构建成功${NC}"
else
    echo -e "${RED}❌ 构建失败，请检查错误${NC}"
    exit 1
fi

echo ""
echo -e "${BLUE}🚀 开始部署到 Vercel...${NC}"
echo ""

# 部署选项
echo "请选择部署方式："
echo "1) 部署到预览环境（测试）"
echo "2) 部署到生产环境"
echo "3) 取消"
echo ""
read -p "请输入选项 (1-3): " choice

case $choice in
    1)
        echo -e "${BLUE}部署到预览环境...${NC}"
        vercel
        ;;
    2)
        echo -e "${BLUE}部署到生产环境...${NC}"
        vercel --prod
        ;;
    3)
        echo -e "${YELLOW}已取消部署${NC}"
        exit 0
        ;;
    *)
        echo -e "${RED}无效选项${NC}"
        exit 1
        ;;
esac

echo ""
echo -e "${GREEN}✅ 部署完成！${NC}"
echo ""
echo -e "${BLUE}📝 下一步：${NC}"
echo "1. 访问 Vercel Dashboard 查看部署状态"
echo "2. 配置环境变量 VITE_API_URL（如果还没配置）"
echo "3. 部署后端到 Railway 或其他平台"
echo "4. 更新前端的 VITE_API_URL 为后端地址"
echo "5. 重新部署前端"
echo ""
echo -e "${BLUE}📖 详细说明请查看 VERCEL_DEPLOY.md${NC}"
