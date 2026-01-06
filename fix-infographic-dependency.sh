#!/bin/bash

# 修复 @antv/infographic 依赖问题
# 将 Infographic 包复制到前端项目中

set -e

echo "🔧 修复 @antv/infographic 依赖..."

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SOURCE_DIR="$(cd "$SCRIPT_DIR/../Infographic" && pwd)"
TARGET_DIR="$SCRIPT_DIR/frontend/infographic-package"

echo "源目录: $SOURCE_DIR"
echo "目标目录: $TARGET_DIR"

# 1. 创建目标目录
echo "📁 创建目标目录..."
rm -rf "$TARGET_DIR"
mkdir -p "$TARGET_DIR"

# 2. 构建 Infographic 包
echo "🔨 构建 Infographic 包..."
cd "$SOURCE_DIR"
npm run build

# 3. 复制必要文件
echo "📦 复制文件..."
cp -r "$SOURCE_DIR/esm" "$TARGET_DIR/"
cp -r "$SOURCE_DIR/lib" "$TARGET_DIR/"
cp -r "$SOURCE_DIR/dist" "$TARGET_DIR/"
cp -r "$SOURCE_DIR/src" "$TARGET_DIR/"
cp "$SOURCE_DIR/package.json" "$TARGET_DIR/"
cp "$SOURCE_DIR/tsconfig.json" "$TARGET_DIR/"
cp "$SOURCE_DIR/README.md" "$TARGET_DIR/" 2>/dev/null || true

# 4. 更新前端 package.json
echo "📝 更新 package.json..."
cd "$SCRIPT_DIR/frontend"

# 使用 Node.js 更新 package.json
node -e "
const fs = require('fs');
const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));
pkg.dependencies['@antv/infographic'] = 'file:./infographic-package';
fs.writeFileSync('package.json', JSON.stringify(pkg, null, 2) + '\n');
"

# 5. 重新安装依赖
echo "📦 重新安装依赖..."
rm -rf node_modules package-lock.json
npm install

echo "✅ 修复完成！"
echo ""
echo "现在可以运行："
echo "  cd frontend"
echo "  npm run build"
