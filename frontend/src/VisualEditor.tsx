import { DeleteOutlined, PlusOutlined, HolderOutlined } from '@ant-design/icons';
import { Button, Card, Collapse, Form, Input, InputNumber, Space, Typography } from 'antd';
import { useEffect, useState, useMemo } from 'react';
import { parseDSL, serializeDSL } from './utils/dsl-parser';

const { Panel } = Collapse;
const { Text } = Typography;

interface VisualEditorProps {
    dsl: string;
    onChange: (newDsl: string) => void;
}

const NodeEditor = ({ items, onChange, level = 0 }: { items: any[], onChange: (items: any[]) => void, level?: number }) => {
    const handleChange = (index: number, field: string, value: any) => {
        const newItems = [...items];
        newItems[index] = { ...newItems[index], [field]: value };
        onChange(newItems);
    };

    const handleDelete = (index: number) => {
        const newItems = items.filter((_, i) => i !== index);
        onChange(newItems);
    };

    const handleAdd = () => {
        const newItems = [...items, { label: '新项目', value: 0 }];
        onChange(newItems);
    };

    // Prevent too deep recursion for simple UI
    if (level > 3) return null;

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <style>{`
                .visual-editor-card {
                    transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
                    border: 1px solid rgba(0,0,0,0.06);
                }
                .visual-editor-card:hover {
                    border-color: rgba(0,0,0,0.12);
                    box-shadow: 0 4px 12px rgba(0,0,0,0.04);
                    transform: translateY(-1px);
                }
                .ghost-input {
                    background: transparent !important;
                    border-color: transparent !important;
                    box-shadow: none !important;
                    transition: all 0.2s;
                    padding: 4px 0 !important;
                }
                .ghost-input:hover, .ghost-input:focus {
                    background: rgba(0,0,0,0.02) !important;
                    padding: 4px 8px !important;
                    border-radius: 4px;
                }
                .ant-collapse-ghost > .ant-collapse-item > .ant-collapse-content > .ant-collapse-content-box {
                    padding-top: 12px !important;
                    padding-bottom: 0 !important;
                }
                .compact-form-item {
                    margin-bottom: 0 !important;
                }
                .compact-form-item .ant-form-item-label {
                    padding-bottom: 2px !important;
                }
                .compact-form-item label {
                    font-size: 12px !important;
                    color: #94a3b8 !important;
                }
            `}</style>
            {items.map((item, index) => (
                <Card
                    key={index}
                    size="small"
                    type="inner"
                    className="visual-editor-card"
                    styles={{ body: { padding: '12px 16px' } }}
                    style={{
                        background: '#fff',
                        borderRadius: 12,
                        marginBottom: 4
                    }}
                >
                    <Space direction="vertical" style={{ width: '100%' }} size={16}>
                        {/* Header Row: Handle + Label + Value + Delete */}
                        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                            <div style={{
                                cursor: 'grab',
                                color: '#cbd5e1',
                                padding: 4,
                                display: 'flex',
                                alignItems: 'center'
                            }}>
                                <HolderOutlined style={{ fontSize: 16 }} />
                            </div>

                            <div style={{ flex: 1 }}>
                                <Form.Item className="compact-form-item" label="Label">
                                    <Input.TextArea
                                        className="ghost-input"
                                        value={item.label}
                                        onChange={e => handleChange(index, 'label', e.target.value)}
                                        placeholder="标签名称（支持换行）"
                                        style={{ fontWeight: 600, fontSize: 15, color: '#334155', resize: 'none' }}
                                        variant="borderless"
                                        autoSize={{ minRows: 1, maxRows: 3 }}
                                    />
                                </Form.Item>
                            </div>

                            <div style={{ width: 100 }}>
                                <Form.Item className="compact-form-item" label="Value">
                                    <InputNumber
                                        className="ghost-input"
                                        value={item.value}
                                        onChange={val => handleChange(index, 'value', val)}
                                        placeholder="0"
                                        style={{ width: '100%', textAlign: 'right', color: '#0f172a' }}
                                        variant="borderless"
                                    />
                                </Form.Item>
                            </div>

                            <Button
                                type="text"
                                size="small"
                                danger
                                icon={<DeleteOutlined />}
                                onClick={() => handleDelete(index)}
                                style={{ opacity: 0.6 }}
                            />
                        </div>

                        {/* Detail Row: Desc + Icon */}
                        <div style={{ display: 'flex', gap: 16, paddingLeft: 32 }}>
                            <Form.Item className="compact-form-item" label="Description" style={{ flex: 2 }}>
                                <Input.TextArea
                                    className="ghost-input"
                                    value={item.desc}
                                    onChange={e => handleChange(index, 'desc', e.target.value)}
                                    placeholder="添加描述（支持换行）..."
                                    style={{ color: '#64748b', fontSize: 13, resize: 'none' }}
                                    variant="borderless"
                                    autoSize={{ minRows: 1, maxRows: 5 }}
                                />
                            </Form.Item>
                            <Form.Item className="compact-form-item" label="Icon ID" style={{ flex: 1 }}>
                                <Input
                                    className="ghost-input"
                                    value={item.icon}
                                    onChange={e => handleChange(index, 'icon', e.target.value)}
                                    placeholder="mdi/icon-name"
                                    prefix={<span style={{ fontSize: 16, marginRight: 4 }}>📦</span>}
                                    style={{ color: '#64748b', fontSize: 13 }}
                                    variant="borderless"
                                />
                            </Form.Item>
                        </div>

                        {/* Nested Children */}
                        {(item.children || level < 1) && (
                            <Collapse
                                ghost
                                size="small"
                                expandIcon={({ isActive }) => <PlusOutlined rotate={isActive ? 45 : 0} style={{ fontSize: 12, color: isActive ? '#2563eb' : '#94a3b8' }} />}
                            >
                                <Panel
                                    header={
                                        <span style={{ fontSize: 12, fontWeight: 500, color: '#64748b' }}>
                                            {(item.children?.length || 0)} 个子项目
                                        </span>
                                    }
                                    key="children"
                                    style={{ border: 'none' }}
                                >
                                    <div style={{ paddingLeft: 12, borderLeft: '1px dashed rgba(0,0,0,0.1)', marginLeft: 6 }}>
                                        <NodeEditor
                                            items={item.children || []}
                                            onChange={(newChildren) => handleChange(index, 'children', newChildren)}
                                            level={level + 1}
                                        />
                                    </div>
                                </Panel>
                            </Collapse>
                        )}
                    </Space>
                </Card>
            ))}
            <Button
                type="dashed"
                block
                icon={<PlusOutlined />}
                onClick={handleAdd}
                style={{ borderRadius: 12, height: 40, borderColor: 'rgba(0,0,0,0.1)', color: '#64748b' }}
            >
                添加数据条目
            </Button>
        </div>
    );
};

const ThemeEditor = ({ theme, onChange }: { theme: any, onChange: (theme: any) => void }) => {
    // Basic palette editor - support both string and array formats
    const paletteValue = theme?.palette || '';
    const colors = Array.isArray(paletteValue) 
        ? paletteValue 
        : (typeof paletteValue === 'string' ? paletteValue.split(' ').filter((c: string) => c.trim().length > 0) : []);

    const handleColorChange = (index: number, newColor: string) => {
        const newColors = [...colors];
        newColors[index] = newColor;
        onChange({ ...theme, palette: newColors.join(' ') });
    };

    const addColor = () => {
        onChange({ ...theme, palette: [...colors, '#000000'].join(' ') });
    };

    const removeColor = (index: number) => {
        const newColors = colors.filter((_, i) => i !== index);
        onChange({ ...theme, palette: newColors.join(' ') });
    };

    return (
        <Space direction="vertical" style={{ width: '100%' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Text strong style={{ fontSize: 13, color: '#334155' }}>配色方案 (Palette)</Text>
                <Button type="link" size="small" icon={<PlusOutlined />} onClick={addColor} style={{ fontSize: 12 }}>添加颜色</Button>
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, padding: 4 }}>
                {colors.map((color, index) => (
                    <div key={index} className="color-swatch-wrapper" style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
                        <div style={{
                            width: 36,
                            height: 36,
                            borderRadius: '50%',
                            background: color,
                            boxShadow: '0 2px 6px rgba(0,0,0,0.15), inset 0 1px 0 rgba(255,255,255,0.2)',
                            cursor: 'pointer',
                            position: 'relative',
                            border: '2px solid #fff',
                            transition: 'transform 0.2s',
                        }}>
                            <input
                                type="color"
                                value={color}
                                onChange={(e) => handleColorChange(index, e.target.value)}
                                style={{
                                    position: 'absolute',
                                    top: 0, left: 0,
                                    width: '100%',
                                    height: '100%',
                                    opacity: 0,
                                    cursor: 'pointer'
                                }}
                            />
                        </div>
                        <DeleteOutlined
                            className="delete-icon"
                            style={{ fontSize: 12, cursor: 'pointer', color: '#94a3b8', transition: 'color 0.2s' }}
                            onClick={() => removeColor(index)}
                        />
                    </div>
                ))}
                {colors.length === 0 && <Text type="secondary" style={{ fontSize: 12, fontStyle: 'italic' }}>暂无自定义配色</Text>}
            </div>
            <style>{`
                .color-swatch-wrapper:hover .delete-icon {
                    color: #ef4444 !important;
                }
                .color-swatch-wrapper:hover > div:first-child {
                    transform: scale(1.1);
                }
            `}</style>
        </Space>
    );
};

export const VisualEditor = ({ dsl, onChange }: VisualEditorProps) => {
    // Keep local state to avoid jumping cursor issues and parse/serialize loops
    // But since this is a complex form, we update on blur or throttled?
    // For simplicity, we parse incoming DSL once, then only update DSL on change.
    // If DSL changes from outside (e.g. streaming), we need to update state.

    // Actually, we can just parse on every render? No, performance.

    const [parsed, setParsed] = useState(() => parseDSL(dsl));

    // Update local state when DSL changes externally (mostly initially or after simple vs code switch)
    useEffect(() => {
        // Simple check to avoid overwrite if we are the ones changing it?
        // We can compare serialized versions
        const incoming = parseDSL(dsl);

        // Very rough deep compare or just rely on user knowing when they switch
        // For now, simple sync
        setParsed(incoming);
    }, [dsl]);

    const handleDataChange = (field: string, value: any) => {
        const newData = { ...parsed.data, [field]: value };
        const newParsed = { ...parsed, data: newData };
        setParsed(newParsed);
        onChange(serializeDSL(newParsed));
    };

    const handleItemsChange = (newItems: any[]) => {
        const newData = { ...parsed.data, items: newItems };
        const newParsed = { ...parsed, data: newData };
        setParsed(newParsed);
        onChange(serializeDSL(newParsed));
    };

    const handleThemeChange = (newTheme: any) => {
        const newParsed = { ...parsed, theme: newTheme };
        setParsed(newParsed);
        onChange(serializeDSL(newParsed));
    };

    const data = parsed.data || {};
    const theme = parsed.theme || {};

    return (
        <div className="custom-scrollbar" style={{ height: '100%', overflowY: 'auto', padding: 24, paddingRight: 12, background: '#fff' }}>
            <Space direction="vertical" size={28} style={{ width: '100%' }}>

                {/* Global Info Section */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                    <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                        <span style={{ fontSize: 18 }}>📝</span>
                        <Text strong style={{ fontSize: 16, color: '#1e293b' }}>全局信息</Text>
                    </div>
                    <Card
                        size="small"
                        bordered={false}
                        style={{
                            boxShadow: '0 4px 20px rgba(0,0,0,0.03)',
                            borderRadius: 16,
                            background: '#fff'
                        }}
                    >
                        <Form layout="vertical">
                            <Form.Item label={<span style={{ fontSize: 13, fontWeight: 500, color: '#64748b' }}>标题 Title</span>}>
                                <Input
                                    value={data.title}
                                    onChange={e => handleDataChange('title', e.target.value)}
                                    placeholder="输入图表标题"
                                    size="large"
                                    style={{ borderRadius: 8, fontSize: 16, fontWeight: 600 }}
                                    variant="filled"
                                />
                            </Form.Item>
                            <Form.Item label={<span style={{ fontSize: 13, fontWeight: 500, color: '#64748b' }}>描述 Description</span>} style={{ marginBottom: 0 }}>
                                <Input.TextArea
                                    value={data.desc}
                                    onChange={e => handleDataChange('desc', e.target.value)}
                                    placeholder="输入图表描述..."
                                    rows={3}
                                    style={{ borderRadius: 8, resize: 'none' }}
                                    variant="filled"
                                />
                            </Form.Item>
                        </Form>
                    </Card>

                    <Card
                        size="small"
                        bordered={false}
                        style={{
                            boxShadow: '0 4px 20px rgba(0,0,0,0.03)',
                            borderRadius: 16,
                            background: '#fff'
                        }}
                    >
                        <ThemeEditor theme={theme} onChange={handleThemeChange} />
                    </Card>
                </div>

                {/* Items Section */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                    <div style={{ display: 'flex', gap: 8, alignItems: 'center', justifyContent: 'space-between' }}>
                        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                            <span style={{ fontSize: 18 }}>📊</span>
                            <Text strong style={{ fontSize: 16, color: '#1e293b' }}>数据内容</Text>
                            <div style={{
                                background: '#e2e8f0',
                                padding: '2px 8px',
                                borderRadius: 12,
                                fontSize: 12,
                                fontWeight: 600,
                                color: '#64748b'
                            }}>
                                {data.items?.length || 0} ITEMS
                            </div>
                        </div>
                    </div>
                    <div style={{
                        background: '#f8fafc',
                        padding: 16,
                        borderRadius: 20,
                        border: '1px solid rgba(0,0,0,0.04)'
                    }}>
                        <NodeEditor items={data.items || []} onChange={handleItemsChange} />
                    </div>
                </div>
            </Space>
        </div>
    );
};
