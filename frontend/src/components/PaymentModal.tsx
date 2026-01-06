import { Modal, Button, Input, Form, message, Space, Divider } from 'antd';
import { CrownOutlined, ThunderboltOutlined, CheckOutlined, LockOutlined } from '@ant-design/icons';
import { useState } from 'react';
import { openCheckout } from '../services/payment';

interface PaymentModalProps {
  visible: boolean;
  onClose: () => void;
  productType: 'subscription' | 'lifetime';
}

export const PaymentModal = ({ visible, onClose, productType }: PaymentModalProps) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const productInfo = {
    subscription: {
      title: '订阅版',
      price: '¥99',
      period: '/年',
      icon: <ThunderboltOutlined />,
      color: '#3b82f6',
      features: [
        '无限次 AI 生成',
        '100+ 精美模板',
        '导出 PNG/SVG',
        '在线编辑器',
        '品牌配色管理',
        '批量生成功能',
      ],
    },
    lifetime: {
      title: '买断版',
      price: '¥365',
      period: '/永久',
      icon: <CrownOutlined />,
      color: '#ff6b35',
      features: [
        '无限次 AI 生成',
        '100+ 精美模板',
        '导出 PNG/SVG',
        '在线编辑器',
        '品牌配色管理',
        '批量生成功能',
        '优先技术支持',
        '永久免费更新',
      ],
    },
  };

  const info = productInfo[productType];

  const handleSubmit = async (values: { email: string; name?: string }) => {
    setLoading(true);
    try {
      // 打开支付页面
      openCheckout({
        productType,
        userEmail: values.email,
        userName: values.name,
        customData: {
          source: 'infographic-ai',
          timestamp: new Date().toISOString(),
        },
      });

      message.success('正在跳转到支付页面...');
      
      // 可选：监听支付完成事件
      // 实际项目中应该通过 Webhook 回调来更新用户状态
      setTimeout(() => {
        message.info('支付完成后，请刷新页面查看订阅状态');
      }, 2000);
    } catch (error) {
      message.error('打开支付页面失败，请重试');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      open={visible}
      onCancel={onClose}
      footer={null}
      width={520}
      centered
      styles={{ body: { padding: 0 } }}
    >
      <div style={{ padding: 40 }}>
        {/* 产品信息 */}
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div
            style={{
              width: 64,
              height: 64,
              borderRadius: 16,
              background: `linear-gradient(135deg, ${info.color} 0%, ${info.color}dd 100%)`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 28,
              color: '#fff',
              margin: '0 auto 20px',
              boxShadow: `0 8px 24px ${info.color}40`,
            }}
          >
            {info.icon}
          </div>
          <h2 style={{ fontSize: 28, fontWeight: 700, marginBottom: 8 }}>
            {info.title}
          </h2>
          <div style={{ fontSize: 40, fontWeight: 700, color: info.color }}>
            {info.price}
            <span style={{ fontSize: 18, color: '#64748b', fontWeight: 400 }}>
              {info.period}
            </span>
          </div>
        </div>

        {/* 功能列表 */}
        <div
          style={{
            background: '#f8fafc',
            borderRadius: 12,
            padding: 20,
            marginBottom: 24,
          }}
        >
          <div style={{ fontSize: 13, color: '#64748b', marginBottom: 12, fontWeight: 600 }}>
            包含功能：
          </div>
          <Space direction="vertical" size={8} style={{ width: '100%' }}>
            {info.features.map((feature, idx) => (
              <div
                key={idx}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  fontSize: 14,
                  color: '#475569',
                }}
              >
                <CheckOutlined style={{ color: info.color, fontSize: 14 }} />
                <span>{feature}</span>
              </div>
            ))}
          </Space>
        </div>

        {/* 表单 */}
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Form.Item
            name="email"
            label="邮箱地址"
            rules={[
              { required: true, message: '请输入邮箱地址' },
              { type: 'email', message: '请输入有效的邮箱地址' },
            ]}
          >
            <Input size="large" placeholder="your@email.com" />
          </Form.Item>

          <Form.Item name="name" label="姓名（可选）">
            <Input size="large" placeholder="张三" />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              size="large"
              block
              htmlType="submit"
              loading={loading}
              style={{
                height: 48,
                fontSize: 16,
                fontWeight: 600,
                background: `linear-gradient(135deg, ${info.color} 0%, ${info.color}dd 100%)`,
                border: 'none',
              }}
            >
              前往支付
            </Button>
          </Form.Item>
        </Form>

        <Divider style={{ margin: '24px 0' }} />

        {/* 安全提示 */}
        <div style={{ textAlign: 'center' }}>
          <Space size={4} style={{ color: '#94a3b8', fontSize: 13 }}>
            <LockOutlined />
            <span>安全支付 · 支持支付宝/微信/银行卡</span>
          </Space>
        </div>
      </div>
    </Modal>
  );
};
