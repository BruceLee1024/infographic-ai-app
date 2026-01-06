#!/bin/bash

# 微信信息显示测试脚本

echo "================================"
echo "微信信息配置验证"
echo "================================"
echo ""

# 检查二维码文件
echo "📱 检查微信二维码文件..."
if [ -f "frontend/public/wechat-qrcode.png" ]; then
    echo "✅ 二维码文件存在: frontend/public/wechat-qrcode.png"
    ls -lh frontend/public/wechat-qrcode.png
else
    echo "❌ 二维码文件不存在"
    exit 1
fi

echo ""

# 检查微信号配置
echo "🔍 检查微信号配置..."
if grep -q "Changning_Lee" frontend/src/components/ActivationModal.tsx; then
    echo "✅ 微信号已配置: Changning_Lee"
else
    echo "❌ 微信号未配置"
    exit 1
fi

echo ""

# 检查图片引用
echo "🖼️  检查图片引用..."
if grep -q 'src="/wechat-qrcode.png"' frontend/src/components/ActivationModal.tsx; then
    echo "✅ 图片引用正确"
else
    echo "❌ 图片引用有误"
    exit 1
fi

echo ""
echo "================================"
echo "✅ 所有检查通过！"
echo "================================"
echo ""
echo "🚀 启动开发服务器测试："
echo "   cd frontend"
echo "   npm install"
echo "   npm run dev"
echo ""
echo "📝 测试步骤："
echo "   1. 访问 http://localhost:5173"
echo "   2. 触发激活模态框（试用3次后）"
echo "   3. 查看微信二维码和微信号显示"
echo ""
