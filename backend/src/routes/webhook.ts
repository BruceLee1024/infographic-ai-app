import { Router, Request, Response } from 'express';
import crypto from 'crypto';
import { db, generateId } from '../db/init';

export const webhookRouter = Router();

// 验证 Lemon Squeezy Webhook 签名
function verifyWebhookSignature(payload: string, signature: string): boolean {
  const secret = process.env.LEMON_WEBHOOK_SECRET;
  if (!secret) {
    console.error('LEMON_WEBHOOK_SECRET not configured');
    return false;
  }

  const hmac = crypto.createHmac('sha256', secret);
  const digest = hmac.update(payload).digest('hex');
  
  try {
    return crypto.timingSafeEqual(
      Buffer.from(signature),
      Buffer.from(digest)
    );
  } catch {
    return false;
  }
}

// Lemon Squeezy Webhook 接收端点
webhookRouter.post('/lemon-squeezy', async (req: Request, res: Response) => {
  try {
    const signature = req.headers['x-signature'] as string;
    const payload = req.body.toString();

    // 记录 Webhook 日志
    const logStmt = db.prepare(`
      INSERT INTO webhook_logs (event_name, payload, processed)
      VALUES (?, ?, 0)
    `);

    // 验证签名
    if (!verifyWebhookSignature(payload, signature)) {
      console.error('Invalid webhook signature');
      logStmt.run('unknown', payload);
      return res.status(401).json({ error: 'Invalid signature' });
    }

    const event = JSON.parse(payload);
    const eventName = event.meta?.event_name;

    console.log(`📨 Received webhook: ${eventName}`);

    // 更新日志
    logStmt.run(eventName, payload);

    // 处理不同事件
    switch (eventName) {
      case 'order_created':
        await handleOrderCreated(event.data);
        break;
      case 'subscription_created':
        await handleSubscriptionCreated(event.data);
        break;
      case 'subscription_updated':
        await handleSubscriptionUpdated(event.data);
        break;
      case 'subscription_cancelled':
        await handleSubscriptionCancelled(event.data);
        break;
      case 'subscription_resumed':
        await handleSubscriptionResumed(event.data);
        break;
      default:
        console.log(`Unhandled event: ${eventName}`);
    }

    // 标记为已处理
    db.prepare(`
      UPDATE webhook_logs 
      SET processed = 1 
      WHERE event_name = ? AND created_at = (SELECT MAX(created_at) FROM webhook_logs WHERE event_name = ?)
    `).run(eventName, eventName);

    res.status(200).json({ received: true });
  } catch (error: any) {
    console.error('Webhook error:', error);
    
    // 记录错误
    db.prepare(`
      UPDATE webhook_logs 
      SET error = ? 
      WHERE created_at = (SELECT MAX(created_at) FROM webhook_logs)
    `).run(error.message);

    res.status(500).json({ error: 'Webhook processing failed' });
  }
});

// 处理订单创建
async function handleOrderCreated(data: any) {
  const { attributes } = data;
  const {
    user_email,
    user_name,
    total,
    status,
    order_number,
    first_order_item,
  } = attributes;

  console.log(`💰 Order created: ${order_number} for ${user_email}`);

  // 确定产品类型
  const productType = first_order_item?.variant_name?.includes('订阅') 
    ? 'subscription' 
    : 'lifetime';

  // 创建或更新用户
  const userId = generateId();
  db.prepare(`
    INSERT INTO users (id, email, name, lemon_customer_id)
    VALUES (?, ?, ?, ?)
    ON CONFLICT(email) DO UPDATE SET
      name = excluded.name,
      lemon_customer_id = excluded.lemon_customer_id,
      updated_at = CURRENT_TIMESTAMP
  `).run(userId, user_email, user_name, data.id);

  // 创建订单记录
  db.prepare(`
    INSERT INTO orders (id, user_email, lemon_order_id, amount, status, product_type)
    VALUES (?, ?, ?, ?, ?, ?)
  `).run(generateId(), user_email, order_number, total / 100, status, productType);

  // 如果是买断版且已支付，立即激活
  if (productType === 'lifetime' && status === 'paid') {
    db.prepare(`
      UPDATE users 
      SET subscription_type = 'lifetime',
          subscription_active = 1,
          updated_at = CURRENT_TIMESTAMP
      WHERE email = ?
    `).run(user_email);
    
    console.log(`✅ Activated lifetime subscription for ${user_email}`);
  }
}

// 处理订阅创建
async function handleSubscriptionCreated(data: any) {
  const { attributes } = data;
  const { user_email, status, renews_at, ends_at } = attributes;

  console.log(`📅 Subscription created for ${user_email}`);

  // 创建订阅记录
  db.prepare(`
    INSERT INTO subscriptions (id, user_email, lemon_subscription_id, status, renews_at, ends_at)
    VALUES (?, ?, ?, ?, ?, ?)
  `).run(generateId(), user_email, data.id, status, renews_at, ends_at);

  // 如果订阅激活，更新用户状态
  if (status === 'active') {
    db.prepare(`
      UPDATE users 
      SET subscription_type = 'subscription',
          subscription_active = 1,
          subscription_expires_at = ?,
          updated_at = CURRENT_TIMESTAMP
      WHERE email = ?
    `).run(renews_at, user_email);
    
    console.log(`✅ Activated subscription for ${user_email}`);
  }
}

// 处理订阅更新
async function handleSubscriptionUpdated(data: any) {
  const { attributes } = data;
  const { user_email, status, renews_at, ends_at } = attributes;

  console.log(`🔄 Subscription updated for ${user_email}: ${status}`);

  // 更新订阅记录
  db.prepare(`
    UPDATE subscriptions 
    SET status = ?,
        renews_at = ?,
        ends_at = ?,
        updated_at = CURRENT_TIMESTAMP
    WHERE lemon_subscription_id = ?
  `).run(status, renews_at, ends_at, data.id);

  // 更新用户状态
  const isActive = status === 'active';
  db.prepare(`
    UPDATE users 
    SET subscription_active = ?,
        subscription_expires_at = ?,
        updated_at = CURRENT_TIMESTAMP
    WHERE email = ?
  `).run(isActive ? 1 : 0, renews_at, user_email);
}

// 处理订阅取消
async function handleSubscriptionCancelled(data: any) {
  const { attributes } = data;
  const { user_email, ends_at } = attributes;

  console.log(`❌ Subscription cancelled for ${user_email}`);

  // 更新订阅记录
  db.prepare(`
    UPDATE subscriptions 
    SET status = 'cancelled',
        cancelled_at = CURRENT_TIMESTAMP,
        updated_at = CURRENT_TIMESTAMP
    WHERE lemon_subscription_id = ?
  `).run(data.id);

  // 用户可以继续使用到期末
  db.prepare(`
    UPDATE users 
    SET subscription_expires_at = ?,
        updated_at = CURRENT_TIMESTAMP
    WHERE email = ?
  `).run(ends_at, user_email);
}

// 处理订阅恢复
async function handleSubscriptionResumed(data: any) {
  const { attributes } = data;
  const { user_email, renews_at } = attributes;

  console.log(`✅ Subscription resumed for ${user_email}`);

  // 更新订阅记录
  db.prepare(`
    UPDATE subscriptions 
    SET status = 'active',
        cancelled_at = NULL,
        updated_at = CURRENT_TIMESTAMP
    WHERE lemon_subscription_id = ?
  `).run(data.id);

  // 重新激活用户
  db.prepare(`
    UPDATE users 
    SET subscription_active = 1,
        subscription_expires_at = ?,
        updated_at = CURRENT_TIMESTAMP
    WHERE email = ?
  `).run(renews_at, user_email);
}
