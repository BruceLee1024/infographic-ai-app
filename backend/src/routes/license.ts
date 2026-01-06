import { Router, Request, Response } from 'express';
import { db, generateId } from '../db/init';
import crypto from 'crypto';

export const licenseRouter = Router();

/**
 * 生成激活码
 * 格式：XXXX-XXXX-XXXX-XXXX
 */
function generateLicenseKey(): string {
  const segments = [];
  for (let i = 0; i < 4; i++) {
    const segment = crypto.randomBytes(2).toString('hex').toUpperCase();
    segments.push(segment);
  }
  return segments.join('-');
}

/**
 * 激活许可证
 */
licenseRouter.post('/activate', async (req: Request, res: Response) => {
  try {
    const { licenseKey } = req.body;

    if (!licenseKey) {
      return res.status(400).json({
        success: false,
        message: '请提供激活码',
      });
    }

    // 查询激活码
    const license = db.prepare(`
      SELECT 
        id,
        license_key,
        type,
        status,
        activated_at,
        expires_at,
        user_email
      FROM licenses
      WHERE license_key = ?
    `).get(licenseKey) as any;

    if (!license) {
      return res.status(404).json({
        success: false,
        message: '激活码不存在或已失效',
      });
    }

    if (license.status === 'used') {
      return res.status(400).json({
        success: false,
        message: '激活码已被使用',
      });
    }

    if (license.status === 'expired') {
      return res.status(400).json({
        success: false,
        message: '激活码已过期',
      });
    }

    // 检查是否过期
    if (license.expires_at) {
      const expiresAt = new Date(license.expires_at);
      if (expiresAt < new Date()) {
        // 标记为过期
        db.prepare(`
          UPDATE licenses 
          SET status = 'expired'
          WHERE id = ?
        `).run(license.id);

        return res.status(400).json({
          success: false,
          message: '激活码已过期',
        });
      }
    }

    // 激活许可证
    const now = new Date().toISOString();
    db.prepare(`
      UPDATE licenses 
      SET status = 'used',
          activated_at = ?
      WHERE id = ?
    `).run(now, license.id);

    // 计算过期时间
    let expiresAt = null;
    if (license.type === 'trial' || license.type === 'monthly' || license.type === 'yearly') {
      // 非终身版：使用数据库中的过期时间
      expiresAt = license.expires_at;
    }
    // 终身版：永不过期

    res.json({
      success: true,
      message: '激活成功',
      type: license.type,
      expiresAt,
    });
  } catch (error: any) {
    console.error('License activation error:', error);
    res.status(500).json({
      success: false,
      message: '激活失败，请稍后重试',
    });
  }
});

/**
 * 生成激活码（管理员接口）
 */
licenseRouter.post('/generate', async (req: Request, res: Response) => {
  try {
    const { type, count = 1, userEmail } = req.body;

    if (!type || !['subscription', 'lifetime'].includes(type)) {
      return res.status(400).json({
        error: 'Invalid license type',
      });
    }

    const licenses = [];
    for (let i = 0; i < count; i++) {
      const licenseKey = generateLicenseKey();
      const id = generateId();

      // 计算过期时间（生成后 30 天内必须激活）
      const validUntil = new Date();
      validUntil.setDate(validUntil.getDate() + 30);

      db.prepare(`
        INSERT INTO licenses (id, license_key, type, status, user_email, expires_at)
        VALUES (?, ?, ?, 'active', ?, ?)
      `).run(id, licenseKey, type, userEmail || null, validUntil.toISOString());

      licenses.push({
        id,
        licenseKey,
        type,
        validUntil: validUntil.toISOString(),
      });
    }

    res.json({
      success: true,
      licenses,
    });
  } catch (error: any) {
    console.error('License generation error:', error);
    res.status(500).json({
      error: 'Failed to generate licenses',
    });
  }
});

/**
 * 查询激活码状态
 */
licenseRouter.get('/status/:licenseKey', (req: Request, res: Response) => {
  try {
    const { licenseKey } = req.params;

    const license = db.prepare(`
      SELECT 
        license_key,
        type,
        status,
        activated_at,
        expires_at,
        created_at
      FROM licenses
      WHERE license_key = ?
    `).get(licenseKey) as any;

    if (!license) {
      return res.status(404).json({
        error: 'License not found',
      });
    }

    res.json(license);
  } catch (error: any) {
    console.error('License status error:', error);
    res.status(500).json({
      error: 'Failed to fetch license status',
    });
  }
});

/**
 * 列出所有激活码（管理员接口）
 */
licenseRouter.get('/list', (req: Request, res: Response) => {
  try {
    const { status, type } = req.query;

    let query = 'SELECT * FROM licenses WHERE 1=1';
    const params: any[] = [];

    if (status) {
      query += ' AND status = ?';
      params.push(status);
    }

    if (type) {
      query += ' AND type = ?';
      params.push(type);
    }

    query += ' ORDER BY created_at DESC LIMIT 100';

    const licenses = db.prepare(query).all(...params);

    res.json({ licenses });
  } catch (error: any) {
    console.error('License list error:', error);
    res.status(500).json({
      error: 'Failed to fetch licenses',
    });
  }
});
