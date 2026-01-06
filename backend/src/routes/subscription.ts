import { Router, Request, Response } from 'express';
import { db } from '../db/init';

export const subscriptionRouter = Router();

// 查询用户订阅状态
subscriptionRouter.get('/status/:email', (req: Request, res: Response) => {
  try {
    const { email } = req.params;

    const user = db.prepare(`
      SELECT 
        subscription_type,
        subscription_active,
        subscription_expires_at,
        created_at
      FROM users
      WHERE email = ?
    `).get(email) as any;

    if (!user) {
      return res.json({
        active: false,
        type: null,
        expiresAt: null,
      });
    }

    // 检查订阅是否过期
    const now = new Date();
    const expiresAt = user.subscription_expires_at 
      ? new Date(user.subscription_expires_at) 
      : null;

    const isExpired = expiresAt && expiresAt < now;
    const isActive = user.subscription_active && !isExpired;

    res.json({
      active: isActive,
      type: user.subscription_type,
      expiresAt: user.subscription_expires_at,
      createdAt: user.created_at,
    });
  } catch (error: any) {
    console.error('Error fetching subscription status:', error);
    res.status(500).json({ error: 'Failed to fetch subscription status' });
  }
});

// 查询用户订阅历史
subscriptionRouter.get('/history/:email', (req: Request, res: Response) => {
  try {
    const { email } = req.params;

    const orders = db.prepare(`
      SELECT 
        id,
        amount,
        currency,
        status,
        product_type,
        created_at
      FROM orders
      WHERE user_email = ?
      ORDER BY created_at DESC
    `).all(email);

    const subscriptions = db.prepare(`
      SELECT 
        id,
        status,
        renews_at,
        ends_at,
        cancelled_at,
        created_at
      FROM subscriptions
      WHERE user_email = ?
      ORDER BY created_at DESC
    `).all(email);

    res.json({
      orders,
      subscriptions,
    });
  } catch (error: any) {
    console.error('Error fetching subscription history:', error);
    res.status(500).json({ error: 'Failed to fetch subscription history' });
  }
});

// 获取统计信息（管理员用）
subscriptionRouter.get('/stats', (req: Request, res: Response) => {
  try {
    const totalUsers = db.prepare('SELECT COUNT(*) as count FROM users').get() as any;
    const activeSubscriptions = db.prepare(`
      SELECT COUNT(*) as count FROM users 
      WHERE subscription_active = 1
    `).get() as any;
    const lifetimeUsers = db.prepare(`
      SELECT COUNT(*) as count FROM users 
      WHERE subscription_type = 'lifetime'
    `).get() as any;
    const totalRevenue = db.prepare(`
      SELECT SUM(amount) as total FROM orders 
      WHERE status = 'paid'
    `).get() as any;

    res.json({
      totalUsers: totalUsers.count,
      activeSubscriptions: activeSubscriptions.count,
      lifetimeUsers: lifetimeUsers.count,
      totalRevenue: totalRevenue.total || 0,
    });
  } catch (error: any) {
    console.error('Error fetching stats:', error);
    res.status(500).json({ error: 'Failed to fetch stats' });
  }
});
