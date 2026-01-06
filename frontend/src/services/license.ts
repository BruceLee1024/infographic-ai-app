/**
 * 激活码管理服务
 */

const STORAGE_KEY = 'infographic_license';
const USAGE_KEY = 'infographic_usage_count';
const FREE_TRIAL_LIMIT = 3;

export interface LicenseInfo {
  activated: boolean;
  licenseKey?: string;
  activatedAt?: string;
  expiresAt?: string;
  type?: 'subscription' | 'lifetime';
}

export interface UsageInfo {
  count: number;
  remaining: number;
  isTrialExpired: boolean;
}

/**
 * 获取使用次数
 */
export function getUsageCount(): number {
  const count = localStorage.getItem(USAGE_KEY);
  return count ? parseInt(count, 10) : 0;
}

/**
 * 增加使用次数
 */
export function incrementUsageCount(): number {
  const count = getUsageCount() + 1;
  localStorage.setItem(USAGE_KEY, count.toString());
  return count;
}

/**
 * 获取使用信息
 */
export function getUsageInfo(): UsageInfo {
  const count = getUsageCount();
  const remaining = Math.max(0, FREE_TRIAL_LIMIT - count);
  const isTrialExpired = count >= FREE_TRIAL_LIMIT;

  return {
    count,
    remaining,
    isTrialExpired,
  };
}

/**
 * 检查是否可以使用
 */
export function canUse(): boolean {
  const license = getLicenseInfo();
  if (license.activated) {
    return true;
  }

  const usage = getUsageInfo();
  return !usage.isTrialExpired;
}

/**
 * 获取激活信息
 */
export function getLicenseInfo(): LicenseInfo {
  const data = localStorage.getItem(STORAGE_KEY);
  if (!data) {
    return { activated: false };
  }

  try {
    return JSON.parse(data);
  } catch {
    return { activated: false };
  }
}

/**
 * 激活许可证
 */
export async function activateLicense(licenseKey: string): Promise<{
  success: boolean;
  message: string;
  license?: LicenseInfo;
}> {
  try {
    // 获取 API 基础 URL
    const apiUrl = import.meta.env.VITE_API_URL || '';
    const endpoint = apiUrl ? `${apiUrl}/api/license/activate` : '/api/license/activate';
    
    // 调用后端 API 验证激活码
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ licenseKey }),
    });

    if (!response.ok) {
      const error = await response.json();
      return {
        success: false,
        message: error.message || '激活失败，请检查激活码是否正确',
      };
    }

    const data = await response.json();
    const license: LicenseInfo = {
      activated: true,
      licenseKey,
      activatedAt: new Date().toISOString(),
      expiresAt: data.expiresAt,
      type: data.type,
    };

    // 保存到本地
    localStorage.setItem(STORAGE_KEY, JSON.stringify(license));

    return {
      success: true,
      message: '激活成功！',
      license,
    };
  } catch (error) {
    console.error('Activation error:', error);
    return {
      success: false,
      message: '激活失败，请检查网络连接',
    };
  }
}

/**
 * 清除激活信息（用于测试）
 */
export function clearLicense(): void {
  localStorage.removeItem(STORAGE_KEY);
}

/**
 * 重置使用次数（用于测试）
 */
export function resetUsageCount(): void {
  localStorage.removeItem(USAGE_KEY);
}
