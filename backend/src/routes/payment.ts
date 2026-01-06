import { Router, Request, Response } from 'express';
import { db } from '../db/init';

export const paymentRouter = Router();

// 验证支付状态
paymentRouter.get('/verify/:orderId', (req: Request, res: Response) => {
  try {
    const { orderId } = req.params;

    const order = db.prepare(`
      SELECT 
        id,
        user_email,
        amount,
        status,
        product_type,
        created_at
      FROM orders
      WHERE lemon_order_id = ? OR id = ?
    `).get(orderId, orderId) as any;

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    res.json({
      paid: order.status === 'paid',
      order: {
        id: order.id,
        email: order.user_email,
        amount: order.amount,
        status: order.status,
        productType: order.product_type,
        createdAt: order.created_at,
      },
    });
  } catch (error: any) {
    console.error('Error verifying payment:', error);
    res.status(500).json({ error: 'Failed to verify payment' });
  }
});

// 获取用户的所有订单
paymentRouter.get('/orders/:email', (req: Request, res: Response) => {
  try {
    const { email } = req.params;

    const orders = db.prepare(`
      SELECT 
        id,
        lemon_order_id,
        amount,
        currency,
        status,
        product_type,
        created_at
      FROM orders
      WHERE user_email = ?
      ORDER BY created_at DESC
    `).all(email);

    res.json({ orders });
  } catch (error: any) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
});
