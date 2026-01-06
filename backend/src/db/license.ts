import { db, generateId } from './init';
import crypto from 'crypto';

/**
 * 生成激活码
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
 * 计算过期时间
 */
function calculateExpiryDate(type: string): Date | null {
  const now = new Date();
  
  switch (type) {
    case 'trial':
      now.setDate(now.getDate() + 7);
      return now;
    case 'monthly':
      now.setDate(now.getDate() + 30);
      return now;
    case 'yearly':
      now.setDate(now.getDate() + 365);
      return now;
    case 'lifetime':
      return null; // 永久有效
    default:
      throw new Error('Invalid license type');
  }
}

/**
 * 生成激活码
 */
export async function generateLicense(
  type: 'trial' | 'monthly' | 'yearly' | 'lifetime',
  email?: string,
  note?: string
) {
  const code = generateLicenseKey();
  const id = generateId();
  const expiresAt = calculateExpiryDate(type);
  const createdAt = new Date().toISOString();

  db.prepare(`
    INSERT INTO licenses (id, license_key, type, status, expires_at, email, note, created_at)
    VALUES (?, ?, ?, 'active', ?, ?, ?, ?)
  `).run(
    id,
    code,
    type,
    expiresAt ? expiresAt.toISOString() : null,
    email || null,
    note || null,
    createdAt
  );

  return {
    id,
    code,
    type,
    expiresAt: expiresAt ? expiresAt.toISOString() : null,
    email: email || null,
    note: note || null,
    createdAt
  };
}

/**
 * 验证激活码
 */
export function validateLicense(code: string) {
  const license = db.prepare(`
    SELECT * FROM licenses WHERE license_key = ?
  `).get(code);

  if (!license) {
    return { valid: false, message: '激活码不存在' };
  }

  if (license.status !== 'active') {
    return { valid: false, message: '激活码已被使用或已失效' };
  }

  if (license.expires_at) {
    const expiryDate = new Date(license.expires_at);
    if (expiryDate < new Date()) {
      return { valid: false, message: '激活码已过期' };
    }
  }

  return { valid: true, license };
}

/**
 * 激活许可证
 */
export function activateLicense(code: string) {
  const validation = validateLicense(code);
  
  if (!validation.valid) {
    return validation;
  }

  const now = new Date().toISOString();
  
  db.prepare(`
    UPDATE licenses 
    SET status = 'used', activated_at = ?
    WHERE license_key = ?
  `).run(now, code);

  return {
    valid: true,
    message: '激活成功',
    license: validation.license
  };
}
