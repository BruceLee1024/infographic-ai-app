import { Modal, Input, Button, message, Divider, Alert, Typography } from 'antd';
import { KeyOutlined, CheckCircleOutlined, GiftOutlined, WechatOutlined } from '@ant-design/icons';
import { useState } from 'react';
import { activateLicense, getUsageInfo } from '../services/license';

const { Paragraph, Text } = Typography;

interface ActivationModalProps {
  visible: boolean;
  onClose: () => void;
  onActivated: () => void;
}

export const ActivationModal = ({ visible, onClose, onActivated }: ActivationModalProps) => {
  const [licenseKey, setLicenseKey] = useState('');
  const [loading, setLoading] = useState(false);
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

  return (
    <Modal
      open={visible}
      onCancel={onClose}
      footer={null}
      width={600}
      centered
      title={
        <div style={{ textAlign: 'center', fontSize: 20, fontWeight: 700 }}>
          <KeyOutlined style={{ marginRight: 8, color: '#ff6b35' }} />
          激活 Infographic AI
        </div>
      }
    >
      <div style={{ padding: '20px 0' }}>
        {/* 试用提示 */}
        <Alert
          message={`免费试用已用完（${usage.count}/${3}）`}
          description="请输入激活码继续使用完整功能"
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

        <Divider style={{ margin: '32px 0' }}>
          <span style={{ color: '#999', fontSize: 14 }}>如何获取激活码？</span>
        </Divider>

        {/* 微信二维码区域 */}
        <div style={{
          background: 'linear-gradient(135deg, rgba(255, 107, 53, 0.05) 0%, rgba(255, 143, 90, 0.05) 100%)',
          borderRadius: 12,
          padding: 32,
          textAlign: 'center'
        }}>
          <div style={{ marginBottom: 16 }}>
            <WechatOutlined style={{ fontSize: 48, color: '#07c160' }} />
          </div>
          
          <Text strong style={{ fontSize: 16, display: 'block', marginBottom: 8 }}>
            添加作者微信获取激活码
          </Text>
          
          <Text type="secondary" style={{ fontSize: 14, display: 'block', marginBottom: 24 }}>
            扫描下方二维码或搜索微信号
          </Text>

          {/* 微信二维码占位符 */}
          <div style={{
            width: 200,
            height: 200,
            margin: '0 auto 16px',
            background: '#fff',
            border: '2px solid #e8e8e8',
            borderRadius: 8,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 14,
            color: '#999'
          }}>
            {/* 这里放置你的微信二维码图片 */}
            <div style={{ textAlign: 'center', padding: 20 }}>
              <WechatOutlined style={{ fontSize: 48, color: '#e8e8e8', marginBottom: 8 }} />
              <div>请替换为你的微信二维码</div>
            </div>
          </div>

          <Paragraph style={{ margin: 0, fontSize: 14 }}>
            <Text type="secondary">微信号：</Text>
            <Text strong copyable style={{ color: '#07c160' }}>
              your_wechat_id
            </Text>
          </Paragraph>

          <Divider style={{ margin: '20px 0' }} />

          <div style={{ textAlign: 'left', fontSize: 13, color: '#666' }}>
            <div style={{ marginBottom: 8 }}>
              <CheckCircleOutlined style={{ color: '#52c41a', marginRight: 6 }} />
              添加微信后，告知需要激活码
            </div>
            <div style={{ marginBottom: 8 }}>
              <CheckCircleOutlined style={{ color: '#52c41a', marginRight: 6 }} />
              提供你的邮箱或备注信息
            </div>
            <div>
              <CheckCircleOutlined style={{ color: '#52c41a', marginRight: 6 }} />
              获取激活码后在上方输入即可使用
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};
