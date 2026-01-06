import { useState } from 'react';
import { Card, Button, Space, Tag, Alert, Spin, Empty, Tooltip, Progress } from 'antd';
import {
  BulbOutlined,
  CheckCircleOutlined,
  ThunderboltOutlined,
  CloseOutlined,
  ReloadOutlined,
} from '@ant-design/icons';
import type { OptimizationSuggestion, OptimizationResult } from '../services/ai-optimizer';

interface OptimizationPanelProps {
  result: OptimizationResult | null;
  loading: boolean;
  onApply: (suggestion: OptimizationSuggestion) => void;
  onRefresh: () => void;
  onClose: () => void;
}

const priorityColors = {
  high: 'red',
  medium: 'orange',
  low: 'blue',
};

const priorityLabels = {
  high: '高优先级',
  medium: '中优先级',
  low: '低优先级',
};

const typeIcons = {
  color: '🎨',
  layout: '📐',
  content: '📝',
  typography: '🔤',
  general: '💡',
};

const typeLabels = {
  color: '配色',
  layout: '布局',
  content: '内容',
  typography: '排版',
  general: '通用',
};

export const OptimizationPanel = ({
  result,
  loading,
  onApply,
  onRefresh,
  onClose,
}: OptimizationPanelProps) => {
  const [appliedIds, setAppliedIds] = useState<Set<string>>(new Set());

  const handleApply = (suggestion: OptimizationSuggestion) => {
    onApply(suggestion);
    setAppliedIds(new Set(Array.from(appliedIds).concat(suggestion.id)));
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return '#52c41a';
    if (score >= 60) return '#faad14';
    return '#ff4d4f';
  };

  const getScoreLabel = (score: number) => {
    if (score >= 90) return '优秀';
    if (score >= 80) return '良好';
    if (score >= 60) return '一般';
    return '需改进';
  };

  return (
    <div
      style={{
        position: 'fixed',
        right: 0,
        top: 64,
        bottom: 0,
        width: 400,
        background: '#fff',
        borderLeft: '1px solid #f0f0f0',
        boxShadow: '-2px 0 8px rgba(0,0,0,0.1)',
        zIndex: 1000,
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* 头部 */}
      <div
        style={{
          padding: '16px 20px',
          borderBottom: '1px solid #f0f0f0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <Space>
          <BulbOutlined style={{ fontSize: 20, color: '#ff6b35' }} />
          <span style={{ fontSize: 16, fontWeight: 600 }}>AI 优化建议</span>
        </Space>
        <Space>
          <Tooltip title="重新分析">
            <Button
              type="text"
              icon={<ReloadOutlined />}
              onClick={onRefresh}
              loading={loading}
            />
          </Tooltip>
          <Button type="text" icon={<CloseOutlined />} onClick={onClose} />
        </Space>
      </div>

      {/* 内容区域 */}
      <div style={{ flex: 1, overflow: 'auto', padding: 20 }}>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '60px 0' }}>
            <Spin size="large" />
            <div style={{ marginTop: 16, color: '#999' }}>AI 正在分析中...</div>
          </div>
        ) : result ? (
          <Space direction="vertical" size={16} style={{ width: '100%' }}>
            {/* 评分卡片 */}
            <Card
              style={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                border: 'none',
              }}
            >
              <div style={{ textAlign: 'center', color: '#fff' }}>
                <div style={{ fontSize: 14, opacity: 0.9, marginBottom: 8 }}>
                  设计评分
                </div>
                <Progress
                  type="circle"
                  percent={result.score}
                  strokeColor={getScoreColor(result.score)}
                  trailColor="rgba(255,255,255,0.3)"
                  format={(percent) => (
                    <span style={{ color: '#fff', fontSize: 24, fontWeight: 700 }}>
                      {percent}
                    </span>
                  )}
                  width={100}
                />
                <div style={{ marginTop: 12, fontSize: 16, fontWeight: 600 }}>
                  {getScoreLabel(result.score)}
                </div>
              </div>
            </Card>

            {/* 总结 */}
            {result.summary && (
              <Alert
                message="AI 分析总结"
                description={result.summary}
                type="info"
                showIcon
                icon={<BulbOutlined />}
              />
            )}

            {/* 建议列表 */}
            {result.suggestions.length > 0 ? (
              <div>
                <div
                  style={{
                    fontSize: 14,
                    fontWeight: 600,
                    marginBottom: 12,
                    color: '#333',
                  }}
                >
                  优化建议 ({result.suggestions.length})
                </div>
                <Space direction="vertical" size={12} style={{ width: '100%' }}>
                  {result.suggestions.map((suggestion) => {
                    const isApplied = appliedIds.has(suggestion.id);
                    return (
                      <Card
                        key={suggestion.id}
                        size="small"
                        style={{
                          borderLeft: `3px solid ${
                            priorityColors[suggestion.priority]
                          }`,
                        }}
                      >
                        <Space direction="vertical" size={8} style={{ width: '100%' }}>
                          {/* 标题和标签 */}
                          <div
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'space-between',
                            }}
                          >
                            <Space>
                              <span style={{ fontSize: 16 }}>
                                {typeIcons[suggestion.type]}
                              </span>
                              <span style={{ fontWeight: 600, fontSize: 14 }}>
                                {suggestion.title}
                              </span>
                            </Space>
                            <Space size={4}>
                              <Tag color={priorityColors[suggestion.priority]} style={{ margin: 0 }}>
                                {priorityLabels[suggestion.priority]}
                              </Tag>
                              <Tag style={{ margin: 0 }}>{typeLabels[suggestion.type]}</Tag>
                            </Space>
                          </div>

                          {/* 描述 */}
                          <div style={{ fontSize: 13, color: '#666', lineHeight: 1.6 }}>
                            {suggestion.description}
                          </div>

                          {/* 操作按钮 */}
                          {suggestion.action && (
                            <div>
                              {isApplied ? (
                                <Button
                                  size="small"
                                  icon={<CheckCircleOutlined />}
                                  disabled
                                  style={{ color: '#52c41a' }}
                                >
                                  已应用
                                </Button>
                              ) : (
                                <Button
                                  type="primary"
                                  size="small"
                                  icon={<ThunderboltOutlined />}
                                  onClick={() => handleApply(suggestion)}
                                  style={{
                                    background: '#ff6b35',
                                    border: 'none',
                                  }}
                                >
                                  一键应用
                                </Button>
                              )}
                            </div>
                          )}
                        </Space>
                      </Card>
                    );
                  })}
                </Space>
              </div>
            ) : (
              <Empty
                image={Empty.PRESENTED_IMAGE_SIMPLE}
                description="暂无优化建议，当前设计已经很棒了！"
              />
            )}
          </Space>
        ) : (
          <Empty
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description="点击上方刷新按钮开始分析"
          />
        )}
      </div>

      {/* 底部提示 */}
      <div
        style={{
          padding: '12px 20px',
          borderTop: '1px solid #f0f0f0',
          background: '#fafafa',
          fontSize: 12,
          color: '#999',
          textAlign: 'center',
        }}
      >
        💡 AI 建议仅供参考，请根据实际需求调整
      </div>
    </div>
  );
};
