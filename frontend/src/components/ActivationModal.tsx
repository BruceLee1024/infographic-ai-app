import { Modal, Input, Button, message, Space, Divider, Alert } from 'antd';
import { KeyOutlined, CheckCircleOutlined, GiftOutlined, CrownOutlined, ThunderboltOutlined } from '@ant-design/icons';
import { useState } from 'react';
import { activateLicense, getUsageInfo } from '../services/license';

interface ActivationModalProps {
  visible: boolean;
  onClose: () => void;
  onActivated: () => void;
  onPurchase: (type: 'subscription' | 'lifetime') => void;
}

export const ActivationModal = ({ visible, onClose, onActivated, onPurchase }: ActivationModalProps) => {
  const [licenseKey, setLicenseKey] = useState('');
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'activate' | 'purchase'>('activate');
  const usage = getUsageInfo();

  const handleActivate = async () => {
    if (!licenseKey.trim()) {
      message.warning('请输入激活码');
      return;
    }

    setLoading(true);
    try {
      const result = await activateLicense(licenseKey.trim());
      
      if (result.success) {
        message.success(result.message);
        onActivated();
        onClose();
      } else {
        message.error(result.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const handlePurchaseClick = (type: 'subscription' | 'lifetime') => {
    onPurchase(type);
    onClose();
  };

  return (
    <Modal
      open={visible}
      onCancel={onClose}
      footer={null}
      width={600}
      centered
      styles={{ body: { padding: 0 } }}
    >
      {/* 标签切换 */}
      <div style={{
        display: 'flex',
        borderBottom: '1px solid #f0f0f0',
        background: '#fafafa'
      }}>
        <div
          onClick={() => setActiveTab('activate')}
          style={{
            flex: 1,
            padding: '16px',
            textAlign: 'center',
            cursor: 'pointer',
            borderBottom: activeTab === 'activate' ? '2px solid #ff6b35' : 'none',
            background: activeTab === 'activate' ? '#fff' : 'transparent',
            fontWeight: activeTab === 'activate' ? 600 : 400,
            color: activeTab === 'activate' ? '#ff6b35' : '#666',
            transition: 'all 0.3s'
          }}
        >
          <KeyOutlined style={{ marginRight: 8 }} />
          输入激活码
        </div>
        <div
          onClick={() => setActiveTab('purchase')}
          style={{
            flex: 1,
            padding: '16px',
            textAlign: 'center',
            cursor: 'pointer',
            borderBottom: activeTab === 'purchase' ? '2px solid #ff6b35' : 'none',
            background: activeTab === 'purchase' ? '#fff' : 'transparent',
            fontWeight: activeTab === 'purchase' ? 600 : 400,
            color: activeTab === 'purchase' ? '#ff6b35' : '#666',
            transition: 'all 0.3s'
          }}
        >
          <GiftOutlined style={{ marginRight: 8 }} />
          购买激活码
        </div>
      </div>

      <div style={{ padding: 40 }}>
        {activeTab === 'activate' ? (
          <>
            {/* 试用提示 */}
            <Alert
              message={`免费试用已用完（${usage.count}/${3}）`}
              description="输入激活码继续使用，或购买激活码解锁完整功能"
              type="warning"
              showIcon
              icon={<GiftOutlined />}
              style={{ marginBottom: 24 }}
            />

            {/* 激活码输入 */}
            <div style={{ marginBottom: 24 }}>
              <div style={{ marginBottom: 8, fontWeight: 500, color: '#333' }}>
                激活码
              </div>
              <Input
                size="large"
                placeholder="请输入激活码，例如：XXXX-XXXX-XXXX-XXXX"
                value={licenseKey}
                onChange={(e) => setLicenseKey(e.target.value.toUpperCase())}
                onPressEnter={handleActivate}
                prefix={<KeyOutlined style={{ color: '#999' }} />}
                style={{ fontSize: 16 }}
              />
            </div>

            {/* 激活按钮 */}
            <Button
              type="primary"
              size="large"
              block
              loading={loading}
              onClick={handleActivate}
              icon={<CheckCircleOutlined />}
              style={{
                height: 48,
                fontSize: 16,
                fontWeight: 600,
                background: 'linear-gradient(135deg, #ff6b35 0%, #ff8f5a 100%)',
                border: 'none',
                marginBottom: 16
              }}
            >
              立即激活
            </Button>

            <Divider style={{ margin: '24px 0' }}>
              <span style={{ color: '#999', fontSize: 13 }}>没有激活码？</span>
            </Divider>

            <Button
              size="large"
              block
              onClick={() => setActiveTab('purchase')}
              style={{
                height: 44,
                fontSize: 15,
                color: '#ff6b35',
                borderColor: '#ff6b35'
              }}
            >
              购买激活码
            </Button>
          </>
        ) : (
          <>
            {/* 购买选项 */}
            <div style={{ marginBottom: 24 }}>
              <h3 style={{ fontSize: 20, fontWeight: 700, marginBottom: 16, textAlign: 'center' }}>
                选择适合你的方案
              </h3>
              <p style={{ color: '#666', textAlign: 'center', marginBottom: 32 }}>
                购买后将立即获得激活码
              </p>
            </div>

            <Space direction="vertical" size={16} style={{ width: '100%' }}>
              {/* 订阅版 */}
              <div
                onClick={() => handlePurchaseClick('subscription')}
                style={{
                  padding: 24,
                  border: '2px solid #e8e8e8',
                  borderRadius: 12,
                  cursor: 'pointer',
                  transition: 'all 0.3s',
                  background: '#fff'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = '#3b82f6';
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(59, 130, 246, 0.15)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = '#e8e8e8';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                  <div style={{
                    width: 48,
                    height: 48,
                    borderRadius: 12,
                    background: 'linear-gradient(135deg, #3b82f6 0%, #60a5fa 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 24,
                    color: '#fff'
                  }}>
                    <ThunderboltOutlined />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 18, fontWeight: 600, marginBottom: 4 }}>
                      订阅版
                    </div>
                    <div style={{ fontSize: 13, color: '#999' }}>
                      适合个人用户和短期项目
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: 28, fontWeight: 700, color: '#3b82f6' }}>
                      ¥99
                    </div>
                    <div style={{ fontSize: 13, color: '#999' }}>
                      /年
                    </div>
                  </div>
                </div>
              </div>

              {/* 买断版 */}
              <div
                onClick={() => handlePurchaseClick('lifetime')}
                style={{
                  padding: 24,
                  border: '2px solid #ff6b35',
                  borderRadius: 12,
                  cursor: 'pointer',
                  transition: 'all 0.3s',
                  background: 'linear-gradient(135deg, rgba(255, 107, 53, 0.05) 0%, rgba(255, 143, 90, 0.05) 100%)',
                  position: 'relative'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow = '0 8px 24px rgba(255, 107, 53, 0.2)';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = 'none';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                <div style={{
                  position: 'absolute',
                  top: -10,
                  right: 20,
                  background: 'linear-gradient(135deg, #ff6b35 0%, #ff8f5a 100%)',
                  color: '#fff',
                  padding: '4px 12px',
                  borderRadius: 20,
                  fontSize: 12,
                  fontWeight: 600
                }}>
                  推荐
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                  <div style={{
                    width: 48,
                    height: 48,
                    borderRadius: 12,
                    background: 'linear-gradient(135deg, #ff6b35 0%, #ff8f5a 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 24,
                    color: '#fff'
                  }}>
                    <CrownOutlined />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 18, fontWeight: 600, marginBottom: 4 }}>
                      买断版
                    </div>
                    <div style={{ fontSize: 13, color: '#999' }}>
                      一次付费，永久使用
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: 28, fontWeight: 700, color: '#ff6b35' }}>
                      ¥365
                    </div>
                    <div style={{ fontSize: 13, color: '#999' }}>
                      /永久
                    </div>
                  </div>
                </div>
              </div>
            </Space>

            <Divider style={{ margin: '24px 0' }} />

            <div style={{ textAlign: 'center', color: '#999', fontSize: 13 }}>
              <CheckCircleOutlined style={{ marginRight: 6 }} />
              购买后立即获得激活码，支持支付宝/微信支付
            </div>
          </>
        )}
      </div>
    </Modal>
  );
};
