import express from 'express';
import { generateLicense } from '../db/license';

const router = express.Router();

// 管理页面 HTML
router.get('/', (req, res) => {
  res.send(`
<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>激活码管理 - Infographic AI</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', sans-serif;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 20px;
    }
    
    .container {
      background: white;
      border-radius: 16px;
      box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
      padding: 40px;
      max-width: 600px;
      width: 100%;
    }
    
    h1 {
      color: #333;
      margin-bottom: 10px;
      font-size: 28px;
    }
    
    .subtitle {
      color: #666;
      margin-bottom: 30px;
      font-size: 14px;
    }
    
    .form-group {
      margin-bottom: 20px;
    }
    
    label {
      display: block;
      margin-bottom: 8px;
      color: #555;
      font-weight: 500;
      font-size: 14px;
    }
    
    input, select {
      width: 100%;
      padding: 12px 16px;
      border: 2px solid #e0e0e0;
      border-radius: 8px;
      font-size: 14px;
      transition: border-color 0.3s;
    }
    
    input:focus, select:focus {
      outline: none;
      border-color: #667eea;
    }
    
    .btn {
      width: 100%;
      padding: 14px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      border: none;
      border-radius: 8px;
      font-size: 16px;
      font-weight: 600;
      cursor: pointer;
      transition: transform 0.2s, box-shadow 0.2s;
    }
    
    .btn:hover {
      transform: translateY(-2px);
      box-shadow: 0 10px 20px rgba(102, 126, 234, 0.4);
    }
    
    .btn:active {
      transform: translateY(0);
    }
    
    .result {
      margin-top: 30px;
      padding: 20px;
      background: #f8f9fa;
      border-radius: 8px;
      border-left: 4px solid #667eea;
      display: none;
    }
    
    .result.show {
      display: block;
      animation: slideIn 0.3s ease-out;
    }
    
    @keyframes slideIn {
      from {
        opacity: 0;
        transform: translateY(-10px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
    
    .result h3 {
      color: #333;
      margin-bottom: 15px;
      font-size: 18px;
    }
    
    .license-code {
      background: white;
      padding: 15px;
      border-radius: 6px;
      font-family: 'Courier New', monospace;
      font-size: 16px;
      color: #667eea;
      font-weight: bold;
      word-break: break-all;
      margin-bottom: 15px;
      border: 2px dashed #667eea;
    }
    
    .info-item {
      display: flex;
      justify-content: space-between;
      padding: 8px 0;
      border-bottom: 1px solid #e0e0e0;
      font-size: 14px;
    }
    
    .info-item:last-child {
      border-bottom: none;
    }
    
    .info-label {
      color: #666;
    }
    
    .info-value {
      color: #333;
      font-weight: 500;
    }
    
    .copy-btn {
      width: 100%;
      padding: 10px;
      background: #28a745;
      color: white;
      border: none;
      border-radius: 6px;
      font-size: 14px;
      cursor: pointer;
      margin-top: 10px;
      transition: background 0.3s;
    }
    
    .copy-btn:hover {
      background: #218838;
    }
    
    .copy-btn.copied {
      background: #5cb85c;
    }
    
    .error {
      background: #fff3cd;
      border-left-color: #ffc107;
      color: #856404;
    }
  </style>
</head>
<body>
  <div class="container">
    <h1>🎨 激活码管理</h1>
    <p class="subtitle">生成 Infographic AI 激活码</p>
    
    <form id="generateForm">
      <div class="form-group">
        <label for="type">激活码类型</label>
        <select id="type" name="type" required>
          <option value="trial">试用版（7天）</option>
          <option value="monthly">月度版（30天）</option>
          <option value="yearly">年度版（365天）</option>
          <option value="lifetime">终身版</option>
        </select>
      </div>
      
      <div class="form-group">
        <label for="email">用户邮箱（可选）</label>
        <input type="email" id="email" name="email" placeholder="user@example.com">
      </div>
      
      <div class="form-group">
        <label for="note">备注信息（可选）</label>
        <input type="text" id="note" name="note" placeholder="例如：张三 - 微信用户">
      </div>
      
      <button type="submit" class="btn">生成激活码</button>
    </form>
    
    <div id="result" class="result">
      <h3>✅ 激活码生成成功</h3>
      <div class="license-code" id="licenseCode"></div>
      <div class="info-item">
        <span class="info-label">类型</span>
        <span class="info-value" id="licenseType"></span>
      </div>
      <div class="info-item">
        <span class="info-label">有效期</span>
        <span class="info-value" id="licenseExpiry"></span>
      </div>
      <div class="info-item">
        <span class="info-label">用户邮箱</span>
        <span class="info-value" id="licenseEmail"></span>
      </div>
      <div class="info-item">
        <span class="info-label">备注</span>
        <span class="info-value" id="licenseNote"></span>
      </div>
      <button class="copy-btn" id="copyBtn">复制激活码</button>
    </div>
  </div>
  
  <script>
    const form = document.getElementById('generateForm');
    const result = document.getElementById('result');
    const licenseCode = document.getElementById('licenseCode');
    const licenseType = document.getElementById('licenseType');
    const licenseExpiry = document.getElementById('licenseExpiry');
    const licenseEmail = document.getElementById('licenseEmail');
    const licenseNote = document.getElementById('licenseNote');
    const copyBtn = document.getElementById('copyBtn');
    
    const typeNames = {
      trial: '试用版',
      monthly: '月度版',
      yearly: '年度版',
      lifetime: '终身版'
    };
    
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const formData = new FormData(form);
      const data = {
        type: formData.get('type'),
        email: formData.get('email') || undefined,
        note: formData.get('note') || undefined
      };
      
      try {
        const response = await fetch('/admin/generate', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(data)
        });
        
        if (!response.ok) {
          throw new Error('生成失败');
        }
        
        const license = await response.json();
        
        // 显示结果
        licenseCode.textContent = license.code;
        licenseType.textContent = typeNames[license.type];
        licenseExpiry.textContent = license.expiresAt ? new Date(license.expiresAt).toLocaleDateString('zh-CN') : '永久有效';
        licenseEmail.textContent = license.email || '未提供';
        licenseNote.textContent = license.note || '无';
        
        result.classList.remove('error');
        result.classList.add('show');
        
        // 滚动到结果
        result.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      } catch (error) {
        result.classList.add('error');
        result.classList.add('show');
        licenseCode.textContent = '生成失败：' + error.message;
      }
    });
    
    copyBtn.addEventListener('click', () => {
      const code = licenseCode.textContent;
      navigator.clipboard.writeText(code).then(() => {
        copyBtn.textContent = '✓ 已复制';
        copyBtn.classList.add('copied');
        setTimeout(() => {
          copyBtn.textContent = '复制激活码';
          copyBtn.classList.remove('copied');
        }, 2000);
      });
    });
  </script>
</body>
</html>
  `);
});

// 生成激活码 API
router.post('/generate', async (req, res) => {
  try {
    const { type, email, note } = req.body;
    
    console.log('Generating license:', { type, email, note });
    
    if (!type || !['trial', 'monthly', 'yearly', 'lifetime'].includes(type)) {
      return res.status(400).json({ error: '无效的激活码类型' });
    }
    
    const license = await generateLicense(type, email, note);
    
    console.log('License generated:', license);
    
    res.json(license);
  } catch (error: any) {
    console.error('生成激活码失败:', error);
    console.error('Error stack:', error.stack);
    res.status(500).json({ error: error.message || '生成激活码失败', stack: error.stack });
  }
});

export { router as adminRouter };
