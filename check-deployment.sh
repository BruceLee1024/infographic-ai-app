#!/bin/bash

# 部署状态检查脚本

echo "🔍 检查部署状态..."
echo ""

# 颜色定义
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# 检查前端 URL
echo -e "${BLUE}请输入你的前端 URL（Vercel）:${NC}"
read -p "例如 https://infographic-ai-app.vercel.app: " FRONTEND_URL

if [ -z "$FRONTEND_URL" ]; then
    echo -e "${RED}❌ 未输入前端 URL${NC}"
    exit 1
fi

# 检查后端 URL
echo -e "${BLUE}请输入你的后端 URL（Railway）:${NC}"
read -p "例如 https://your-backend.railway.app: " BACKEND_URL

if [ -z "$BACKEND_URL" ]; then
    echo -e "${RED}❌ 未输入后端 URL${NC}"
    exit 1
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo -e "${BLUE}开始检查...${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# 检查前端
echo -e "${YELLOW}1. 检查前端...${NC}"
FRONTEND_STATUS=$(curl -s -o /dev/null -w "%{http_code}" "$FRONTEND_URL")

if [ "$FRONTEND_STATUS" = "200" ]; then
    echo -e "${GREEN}✓ 前端正常运行 (HTTP $FRONTEND_STATUS)${NC}"
else
    echo -e "${RED}✗ 前端访问失败 (HTTP $FRONTEND_STATUS)${NC}"
fi

echo ""

# 检查后端健康检查
echo -e "${YELLOW}2. 检查后端健康状态...${NC}"
BACKEND_HEALTH=$(curl -s "$BACKEND_URL/health")

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ 后端正常运行${NC}"
    echo "  响应: $BACKEND_HEALTH"
else
    echo -e "${RED}✗ 后端访问失败${NC}"
fi

echo ""

# 检查后端 API
echo -e "${YELLOW}3. 检查后端 API...${NC}"
API_STATUS=$(curl -s -o /dev/null -w "%{http_code}" "$BACKEND_URL/api/license/list")

if [ "$API_STATUS" = "200" ]; then
    echo -e "${GREEN}✓ API 正常响应 (HTTP $API_STATUS)${NC}"
else
    echo -e "${YELLOW}⚠ API 响应异常 (HTTP $API_STATUS)${NC}"
    echo "  这可能是正常的，取决于你的 API 配置"
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo -e "${BLUE}检查完成！${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# 总结
echo -e "${BLUE}📊 部署信息:${NC}"
echo "  前端: $FRONTEND_URL"
echo "  后端: $BACKEND_URL"
echo ""

echo -e "${BLUE}💡 下一步:${NC}"
echo "  1. 访问前端 URL 测试功能"
echo "  2. 在设置中输入 DeepSeek API Key"
echo "  3. 测试 AI 生成功能"
echo ""

echo -e "${BLUE}📖 如有问题，请查看:${NC}"
echo "  - DEPLOY_NOW.md - 部署指南"
echo "  - VERCEL_DEPLOY.md - 详细文档"
