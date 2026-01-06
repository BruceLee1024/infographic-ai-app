#!/usr/bin/env tsx
/**
 * 激活码生成工具
 * 
 * 使用方法：
 * tsx scripts/generate-licenses.ts --type subscription --count 10
 * tsx scripts/generate-licenses.ts --type lifetime --count 5
 */

import { db, generateId, initDatabase } from '../src/db/init';
import crypto from 'crypto';

function generateLicenseKey(): string {
  const segments = [];
  for (let i = 0; i < 4; i++) {
    const segment = crypto.randomBytes(2).toString('hex').toUpperCase();
    segments.push(segment);
  }
  return segments.join('-');
}

function main() {
  const args = process.argv.slice(2);
  const typeIndex = args.indexOf('--type');
  const countIndex = args.indexOf('--count');

  const type = typeIndex !== -1 ? args[typeIndex + 1] : 'subscription';
  const count = countIndex !== -1 ? parseInt(args[countIndex + 1], 10) : 1;

  if (!['subscription', 'lifetime'].includes(type)) {
    console.error('❌ Invalid type. Use: subscription or lifetime');
    process.exit(1);
  }

  if (isNaN(count) || count < 1 || count > 100) {
    console.error('❌ Invalid count. Must be between 1 and 100');
    process.exit(1);
  }

  // 初始化数据库
  initDatabase();

  console.log(`\n🔑 Generating ${count} ${type} license(s)...\n`);

  const licenses = [];
  for (let i = 0; i < count; i++) {
    const licenseKey = generateLicenseKey();
    const id = generateId();

    // 激活码有效期：生成后 30 天内必须激活
    const validUntil = new Date();
    validUntil.setDate(validUntil.getDate() + 30);

    db.prepare(`
      INSERT INTO licenses (id, license_key, type, status, expires_at)
      VALUES (?, ?, ?, 'active', ?)
    `).run(id, licenseKey, type, validUntil.toISOString());

    licenses.push({
      licenseKey,
      type,
      validUntil: validUntil.toISOString().split('T')[0],
    });
  }

  // 打印激活码
  console.log('✅ Generated licenses:\n');
  console.log('┌─────────────────────┬──────────────┬─────────────┐');
  console.log('│ License Key         │ Type         │ Valid Until │');
  console.log('├─────────────────────┼──────────────┼─────────────┤');
  
  licenses.forEach(({ licenseKey, type, validUntil }) => {
    const typeDisplay = type === 'subscription' ? '订阅版      ' : '买断版      ';
    console.log(`│ ${licenseKey} │ ${typeDisplay} │ ${validUntil} │`);
  });
  
  console.log('└─────────────────────┴──────────────┴─────────────┘');
  console.log(`\n📊 Total: ${licenses.length} license(s) generated`);
  console.log('💾 Saved to database: data/infographic.db\n');
}

main();
