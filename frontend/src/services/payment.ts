/**
 * 支付服务 - Lemon Squeezy 集成
 * 
 * 使用步骤：
 * 1. 注册 Lemon Squeezy 账号：https://www.lemonsqueezy.com/
 * 2. 创建产品和价格方案
 * 3. 获取 Store ID 和产品 Variant ID
 * 4. 配置 Webhook 接收支付回调
 */

// Lemon Squeezy 配置
const LEMON_SQUEEZY_CONFIG = {
  storeId: import.meta.env.VITE_LEMON_STORE_ID || 'your-store-id',
  // 产品 Variant ID（在 Lemon Squeezy 后台创建产品后获取）
  products: {
    subscription: import.meta.env.VITE_LEMON_SUBSCRIPTION_ID || 'variant-id-1',
    lifetime: import.meta.env.VITE_LEMON_LIFETIME_ID || 'variant-id-2',
  },
};

export interface CheckoutOptions {
  productType: 'subscription' | 'lifetime';
  userEmail?: string;
  userName?: string;
  customData?: Record<string, any>;
}

/**
 * 创建支付链接
 */
export const createCheckoutUrl = (options: CheckoutOptions): string => {
  const { productType, userEmail, userName, customData } = options;
  const variantId = LEMON_SQUEEZY_CONFIG.products[productType];

  // Lemon Squeezy Checkout URL
  const baseUrl = 'https://lemonsqueezy.com/checkout/buy';
  const params = new URLSearchParams({
    variant: variantId,
    ...(userEmail && { email: userEmail }),
    ...(userName && { name: userName }),
    ...(customData && { 'checkout[custom][data]': JSON.stringify(customData) }),
  });

  return `${baseUrl}/${variantId}?${params.toString()}`;
};

/**
 * 打开支付页面
 */
export const openCheckout = (options: CheckoutOptions): void => {
  const checkoutUrl = createCheckoutUrl(options);
  
  // 在新窗口打开支付页面
  const width = 600;
  const height = 800;
  const left = (window.screen.width - width) / 2;
  const top = (window.screen.height - height) / 2;

  window.open(
    checkoutUrl,
    'LemonSqueezyCheckout',
    `width=${width},height=${height},left=${left},top=${top},resizable=yes,scrollbars=yes`
  );
};

/**
 * 验证支付状态（需要后端支持）
 */
export const verifyPayment = async (orderId: string): Promise<boolean> => {
  try {
    // 调用你的后端 API 验证支付状态
    const response = await fetch(`/api/payment/verify/${orderId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Payment verification failed');
    }

    const data = await response.json();
    return data.paid === true;
  } catch (error) {
    console.error('Payment verification error:', error);
    return false;
  }
};

/**
 * 获取用户订阅状态（需要后端支持）
 */
export const getSubscriptionStatus = async (userId: string): Promise<{
  active: boolean;
  type: 'subscription' | 'lifetime' | null;
  expiresAt?: string;
}> => {
  try {
    const response = await fetch(`/api/subscription/status/${userId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch subscription status');
    }

    return await response.json();
  } catch (error) {
    console.error('Subscription status error:', error);
    return { active: false, type: null };
  }
};
