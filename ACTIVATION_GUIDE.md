# 激活码管理指南

## 📋 概述

本项目使用激活码系统，用户需要添加作者微信获取激活码。

---

## 🔧 后端管理页面

### 访问地址

- **本地开发**: http://localhost:3001/admin
- **生产环境**: https://你的后端域名/admin

### 功能说明

管理页面提供以下功能：

1. **生成激活码**
   - 选择激活码类型（试用版/月度版/年度版/终身版）
   - 可选填写用户邮箱
   - 可选填写备注信息（如：张三 - 微信用户）

2. **激活码类型**
   - **试用版**：7天有效期
   - **月度版**：30天有效期
   - **年度版**：365天有效期
   - **终身版**：永久有效

3. **生成后操作**
   - 显示激活码
   - 显示有效期
   - 一键复制激活码
   - 发送给用户

---

## 👥 用户激活流程

### 1. 用户使用应用

- 用户访问前端网站
- 免费试用 3 次
- 试用次数用完后，显示激活提示

### 2. 获取激活码

用户看到激活模态框，显示：

- **微信二维码**（需要你替换为真实二维码）
- **微信号**（需要你修改为真实微信号）
- **获取步骤**：
  1. 添加作者微信
  2. 告知需要激活码
  3. 提供邮箱或备注信息
  4. 获取激活码

### 3. 输入激活码

- 用户在激活模态框输入激活码
- 点击"立即激活"
- 激活成功后可无限制使用

---

## 🎨 自定义微信信息

### 修改微信二维码

编辑文件：`frontend/src/components/ActivationModal.tsx`

找到这段代码（约第 90 行）：

```tsx
{/* 微信二维码占位符 */}
<div style={{
  width: 200,
  height: 200,
  margin: '0 auto 16px',
  background: '#fff',
  border: '2px solid #e8e8e8',
  borderRadius: 8,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: 14,
  color: '#999'
}}>
  {/* 这里放置你的微信二维码图片 */}
  <div style={{ textAlign: 'center', padding: 20 }}>
    <WechatOutlined style={{ fontSize: 48, color: '#e8e8e8', marginBottom: 8 }} />
    <div>请替换为你的微信二维码</div>
  </div>
</div>
```

替换为：

```tsx
<div style={{
  width: 200,
  height: 200,
  margin: '0 auto 16px',
  background: '#fff',
  border: '2px solid #e8e8e8',
  borderRadius: 8,
  overflow: 'hidden'
}}>
  <img 
    src="/wechat-qrcode.png" 
    alt="微信二维码" 
    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
  />
</div>
```

然后将你的微信二维码图片放到 `frontend/public/wechat-qrcode.png`

### 修改微信号

找到这段代码（约第 110 行）：

```tsx
<Paragraph style={{ margin: 0, fontSize: 14 }}>
  <Text type="secondary">微信号：</Text>
  <Text strong copyable style={{ color: '#07c160' }}>
    Changning_Lee
  </Text>
</Paragraph>
```

将 `Changning_Lee` 替换为你的真实微信号（已更新为示例微信号）。

---

## 🚀 部署后操作

### 1. 访问管理页面

部署完成后，访问：
```
https://你的后端域名/admin
```

### 2. 生成测试激活码

1. 选择"试用版"
2. 填写测试邮箱
3. 点击"生成激活码"
4. 复制激活码

### 3. 测试激活流程

1. 访问前端网站
2. 使用 3 次免费试用
3. 出现激活提示
4. 输入刚才生成的激活码
5. 验证激活成功

---

## 📊 激活码管理

### 查看激活码

激活码存储在后端数据库中：
```
backend/data/infographic.db
```

可以使用 SQLite 工具查看：

```bash
cd backend/data
sqlite3 infographic.db

# 查看所有激活码
SELECT * FROM licenses;

# 查看已激活的激活码
SELECT * FROM licenses WHERE activated = 1;

# 查看未激活的激活码
SELECT * FROM licenses WHERE activated = 0;
```

### 激活码字段说明

- `code`: 激活码（格式：XXXX-XXXX-XXXX-XXXX）
- `type`: 类型（trial/monthly/yearly/lifetime）
- `activated`: 是否已激活（0/1）
- `activatedAt`: 激活时间
- `expiresAt`: 过期时间
- `email`: 用户邮箱
- `note`: 备注信息
- `createdAt`: 创建时间

---

## 🔒 安全建议

### 1. 保护管理页面

建议添加密码保护：

```typescript
// backend/src/routes/admin.ts
router.use((req, res, next) => {
  const auth = req.headers.authorization;
  const token = 'Bearer your-secret-token';
  
  if (auth !== token) {
    return res.status(401).send('Unauthorized');
  }
  
  next();
});
```

### 2. 限制访问

使用环境变量控制：

```typescript
// 只在生产环境启用管理页面
if (process.env.NODE_ENV === 'production') {
  app.use('/admin', adminRouter);
}
```

### 3. 备份数据库

定期备份激活码数据库：

```bash
# 备份
cp backend/data/infographic.db backend/data/infographic.db.backup

# 恢复
cp backend/data/infographic.db.backup backend/data/infographic.db
```

---

## 📞 用户支持

### 常见问题

**Q: 激活码无效？**
A: 检查激活码是否正确，是否已被使用，是否已过期

**Q: 激活后还是提示激活？**
A: 清除浏览器缓存，刷新页面

**Q: 如何延长激活码有效期？**
A: 在数据库中修改 `expiresAt` 字段

### 联系方式

用户可以通过以下方式联系：
- 微信：Changning_Lee
- 邮箱：[你的邮箱]

---

## 🎯 下一步

1. ✅ 替换微信二维码和微信号（已完成：Changning_Lee）
2. ✅ 部署后端和前端
3. ✅ 测试激活流程
4. ✅ 生成真实激活码
5. ✅ 开始接受用户

---

**祝你使用愉快！** 🎉
