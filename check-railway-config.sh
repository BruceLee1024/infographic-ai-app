#!/bin/bash

# Railway 配置检查脚本

echo "🔍 检查 Railway 部署配置..."
echo ""

# 检查配置文件
echo "📁 检查配置文件："
if [ -f "backend/railway.json" ]; then
  echo "  ✅ backend/railway.json 存在"
else
  echo "  ❌ backend/railway.json 不存在"
fi

if [ -f "backend/nixpacks.toml" ]; then
  echo "  ✅ backend/nixpacks.toml 存在"
else
  echo "  ❌ backend/nixpacks.toml 不存在"
fi

if [ -f "backend/package.json" ]; then
  echo "  ✅ backend/package.json 存在"
else
  echo "  ❌ backend/package.json 不存在"
fi

if [ -f "backend/tsconfig.json" ]; then
  echo "  ✅ backend/tsconfig.json 存在"
else
  echo "  ❌ backend/tsconfig.json 不存在"
fi

echo ""

# 检查 package.json 脚本
echo "📦 检查 package.json 脚本："
if grep -q '"build"' backend/package.json; then
  echo "  ✅ build 脚本存在"
  grep '"build"' backend/package.json | sed 's/^/    /'
else
  echo "  ❌ build 脚本不存在"
fi

if grep -q '"start"' backend/package.json; then
  echo "  ✅ start 脚本存在"
  grep '"start"' backend/package.json | sed 's/^/    /'
else
  echo "  ❌ start 脚本不存在"
fi

echo ""

# 检查 Git 状态
echo "🔄 检查 Git 状态："
if git status &> /dev/null; then
  if git diff --quiet && git diff --cached --quiet; then
    echo "  ✅ 所有更改已提交"
  else
    echo "  ⚠️  有未提交的更改"
    git status --short
  fi
  
  # 检查是否已推送
  LOCAL=$(git rev-parse @)
  REMOTE=$(git rev-parse @{u} 2>/dev/null)
  
  if [ "$LOCAL" = "$REMOTE" ]; then
    echo "  ✅ 代码已推送到远程仓库"
  else
    echo "  ⚠️  本地代码未推送到远程仓库"
    echo "     运行: git push"
  fi
else
  echo "  ⚠️  不是 Git 仓库"
fi

echo ""

# 测试本地构建
echo "🔨 测试本地构建："
echo "  运行: cd backend && npm run build"
cd backend
if npm run build &> /dev/null; then
  echo "  ✅ 本地构建成功"
  if [ -d "dist" ]; then
    echo "  ✅ dist 目录已生成"
    echo "     文件数: $(find dist -type f | wc -l)"
  fi
else
  echo "  ❌ 本地构建失败"
  echo "     请检查 TypeScript 错误"
fi
cd ..

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "📋 Railway 部署清单："
echo ""
echo "  1. Root Directory = backend ✓"
echo "  2. 配置文件已添加 ✓"
echo "  3. 代码已推送到 GitHub"
echo "  4. 环境变量已配置："
echo "     - NODE_ENV=production"
echo "     - DEEPSEEK_API_KEY=你的密钥"
echo "     - DATABASE_PATH=./data/infographic.db"
echo ""
echo "🚀 下一步："
echo "  1. 进入 Railway 项目"
echo "  2. 点击 Deployments → Redeploy"
echo "  3. 等待构建完成（2-5 分钟）"
echo "  4. 测试: https://你的域名/health"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
