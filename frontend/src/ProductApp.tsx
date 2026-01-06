import { getTemplates, getItems, getStructures, InfographicOptions, parseSyntax, registerTemplate } from '@antv/infographic';
import {
    App,
    Button,
    ConfigProvider,
    Input,
    Layout,
    Select,
    Space,
    theme,
    Tooltip,
    Typography,
    Form,
    ColorPicker,
    Checkbox,
    Radio,
    Card,
    Modal,
    Tabs,
    Avatar,
    Badge,
    Spin,
    Alert
} from 'antd';
import {
    KeyOutlined,
    RobotOutlined,
    SendOutlined,
    BulbOutlined,
    ExperimentOutlined,
    FormatPainterOutlined,
    DownloadOutlined,
    EyeOutlined,
    CodeOutlined,
    EditOutlined,
    AppstoreOutlined,
    SettingOutlined,
    DownOutlined,
    ArrowRightOutlined,
    PlusOutlined,
    MessageOutlined,
    UserOutlined,
    CloseOutlined,
    ExpandOutlined,
    CompressOutlined,
    CopyOutlined,
    CheckOutlined,
    ReloadOutlined,
    ThunderboltOutlined,
} from '@ant-design/icons';
import Editor from '@monaco-editor/react';
import { useState, useEffect, useCallback, useMemo } from 'react';
import { WORD_CLOUD_DATA } from './data';
import { Infographic } from './Infographic';
import { getTemplateName, TEMPLATE_CATEGORIES } from './TemplateConfig';
import { VisualEditor } from './VisualEditor';
import { analyzeInfographic, getQuickSuggestions, applySuggestion, type OptimizationSuggestion } from './services/ai-optimizer';
import ReactMarkdown from 'react-markdown';

const { Header, Content, Sider } = Layout;
const { Title, Text } = Typography;
const { TextArea } = Input;

const templates = getTemplates();
const items = getItems();
const structures = getStructures();

// 结构布局中文名称映射
const STRUCTURE_NAMES: Record<string, string> = {
    'chart-bar': '条形图',
    'chart-column': '柱状图',
    'chart-line': '折线图',
    'chart-pie': '饼图',
    'chart-wordcloud': '词云图',
    'compare-binary-horizontal': '双边对比',
    'compare-hierarchy-left-right': '左右层级对比',
    'compare-hierarchy-row': '行式层级对比',
    'compare-swot': 'SWOT分析',
    'hierarchy-mindmap': '思维导图',
    'hierarchy-tree': '树形图',
    'list-column': '纵向列表',
    'list-grid': '网格列表',
    'list-pyramid': '金字塔列表',
    'list-row': '横向列表',
    'list-sector': '扇形列表',
    'list-waterfall': '瀑布列表',
    'quadrant': '四象限图',
    'relation-circle': '圆形关系图',
    'relation-network': '网络关系图',
    'sequence-ascending-stairs-3d': '3D上升阶梯',
    'sequence-ascending-steps': '上升台阶',
    'sequence-circle-arrows': '环形箭头',
    'sequence-circular': '环形流程',
    'sequence-color-snake-steps': '彩色蛇形步骤',
    'sequence-cylinders-3d': '3D圆柱',
    'sequence-filter-mesh': '漏斗图',
    'sequence-horizontal-zigzag': '水平Z字形',
    'sequence-mountain': '山峰图',
    'sequence-pyramid': '金字塔',
    'sequence-roadmap-vertical': '垂直路线图',
    'sequence-snake-steps': '蛇形步骤',
    'sequence-stairs-front': '正面阶梯',
    'sequence-steps': '步骤流程',
    'sequence-timeline': '时间轴',
    'sequence-zigzag-pucks-3d': '3D冰球步骤',
    'sequence-zigzag-steps': 'Z字形步骤',
};

// 数据项中文名称映射
const ITEM_NAMES: Record<string, string> = {
    'badge-card': '徽章卡片',
    'candy-card-lite': '糖果卡片',
    'capsule-item': '胶囊项',
    'circle-node': '圆形节点',
    'circular-progress': '环形进度',
    'compact-card': '紧凑卡片',
    'done-list': '完成清单',
    'horizontal-icon-arrow': '横向图标箭头',
    'horizontal-icon-line': '横向图标线',
    'icon-badge': '图标徽章',
    'indexed-card': '索引卡片',
    'l-corner-card': 'L角卡片',
    'letter-card': '字母卡片',
    'lined-text': '带线文本',
    'pill-badge': '药丸徽章',
    'plain-text': '纯文本',
    'progress-card': '进度卡片',
    'quarter-circular': '四分环形',
    'quarter-simple-card': '四分简单卡片',
    'ribbon-card': '丝带卡片',
    'rounded-rect-node': '圆角矩形节点',
    'simple-horizontal-arrow': '简单横向箭头',
    'simple-illus-item': '简单插图项',
    'simple-item': '简单项',
    'simple-vertical-arrow': '简单纵向箭头',
    'underline-text': '下划线文本',
    'vertical-icon-arrow': '纵向图标箭头',
};

// 获取结构布局的中文名称
const getStructureName = (key: string) => STRUCTURE_NAMES[key] || key;

// 获取数据项的中文名称
const getItemName = (key: string) => ITEM_NAMES[key] || key;

// 默认示例数据（使用 mdi 图标格式）
const DEFAULT_SAMPLE_DATA = {
    title: '产品功能介绍',
    desc: '核心功能与特性一览',
    items: [
        {
            label: '智能分析',
            desc: '基于 AI 的数据分析能力',
            value: 85,
            icon: 'mdi/chart-line',
        },
        {
            label: '可视化展示',
            desc: '丰富的图表和信息图模板',
            value: 90,
            icon: 'mdi/palette',
        },
        {
            label: '协作共享',
            desc: '团队协作与一键分享',
            value: 75,
            icon: 'mdi/account-group',
        },
        {
            label: '导出下载',
            desc: '支持多种格式导出',
            value: 80,
            icon: 'mdi/download',
        },
    ],
};

// 层级示例数据
const DEFAULT_HIERARCHY_DATA = {
    title: '组织架构',
    desc: '公司组织结构图',
    items: [
        {
            label: '总经理',
            icon: 'mdi/account-tie',
            children: [
                {
                    label: '技术部',
                    icon: 'mdi/code-tags',
                    children: [
                        { label: '前端组', icon: 'mdi/web' },
                        { label: '后端组', icon: 'mdi/server' },
                    ],
                },
                {
                    label: '产品部',
                    icon: 'mdi/lightbulb',
                    children: [
                        { label: '产品设计', icon: 'mdi/pencil-ruler' },
                        { label: '用户研究', icon: 'mdi/account-search' },
                    ],
                },
                {
                    label: '市场部',
                    icon: 'mdi/bullhorn',
                    children: [
                        { label: '品牌推广', icon: 'mdi/star' },
                        { label: '渠道运营', icon: 'mdi/store' },
                    ],
                },
            ],
        },
    ],
};

// 对比示例数据
const DEFAULT_COMPARE_DATA = {
    title: '方案对比',
    desc: '两种方案的优劣分析',
    items: [
        {
            label: '方案 A',
            children: [
                { label: '成本较低', desc: '初期投入少', icon: 'mdi/currency-usd' },
                { label: '实施快速', desc: '2周内上线', icon: 'mdi/rocket-launch' },
                { label: '风险可控', desc: '成熟技术栈', icon: 'mdi/shield-check' },
            ],
        },
        {
            label: '方案 B',
            children: [
                { label: '性能更优', desc: '响应速度快', icon: 'mdi/speedometer' },
                { label: '扩展性强', desc: '支持高并发', icon: 'mdi/arrow-expand-all' },
                { label: '长期收益', desc: '维护成本低', icon: 'mdi/trending-up' },
            ],
        },
    ],
};

// SWOT 示例数据
const DEFAULT_SWOT_DATA = {
    title: 'SWOT 分析',
    desc: '企业战略分析',
    items: [
        {
            label: 'Strengths',
            children: [
                { label: '技术领先' },
                { label: '品牌知名度高' },
            ],
        },
        {
            label: 'Weaknesses',
            children: [
                { label: '市场份额有限' },
                { label: '人才储备不足' },
            ],
        },
        {
            label: 'Opportunities',
            children: [
                { label: '新兴市场增长' },
                { label: '政策利好' },
            ],
        },
        {
            label: 'Threats',
            children: [
                { label: '竞争加剧' },
                { label: '技术迭代快' },
            ],
        },
    ],
};

const DATA: { label: string; key: string; value: any }[] = [
    { label: '列表数据', key: 'list', value: DEFAULT_SAMPLE_DATA },
    { label: '层级数据', key: 'hierarchy', value: DEFAULT_HIERARCHY_DATA },
    { label: '对比数据', key: 'compare', value: DEFAULT_COMPARE_DATA },
    { label: 'SWOT数据', key: 'swot', value: DEFAULT_SWOT_DATA },
    { label: '词云数据', key: 'wordcloud', value: WORD_CLOUD_DATA },
];

const CompositePanel = ({ onChange, aiGeneratedData }: { onChange: (optionStr: string) => void; aiGeneratedData?: any }) => {
    const [form] = Form.useForm();
    const [structure, setStructure] = useState(structures[0] || 'list-grid');
    const [item, setItem] = useState(items[0] || 'circular-progress');
    const [item2, setItem2] = useState<string>('');
    const [dataKey, setDataKey] = useState(aiGeneratedData ? 'ai' : 'list');
    const [themeType, setThemeType] = useState('light');
    const [colorPrimary, setColorPrimary] = useState('#ff6b35');
    const [enablePalette, setEnablePalette] = useState(true);
    const [useHandDrawn, setUseHandDrawn] = useState(false);

    // 当 AI 生成数据变化时，自动切换到 AI 数据
    useEffect(() => {
        if (aiGeneratedData) {
            setDataKey('ai');
        }
    }, [aiGeneratedData]);

    // 构建数据选项，包含 AI 生成的数据
    const dataOptions = useMemo(() => {
        const options = DATA.map(d => ({ label: d.label, value: d.key }));
        if (aiGeneratedData) {
            options.unshift({ label: '🤖 AI 生成数据', value: 'ai' });
        }
        return options;
    }, [aiGeneratedData]);

    const updateOptions = useCallback(() => {
        const structureObj: any = { type: structure };
        const itemObj: any = { type: item };
        const item2Obj: any = item2 ? { type: item2 } : null;

        // 如果选择了 AI 数据，使用 aiGeneratedData，否则使用预设数据
        const dataVal = dataKey === 'ai' ? aiGeneratedData : DATA.find((it) => it.key === dataKey)?.value;

        const options: InfographicOptions = {
            padding: 20,
            editable: false,
            design: {
                title: 'default',
                structure: structureObj,
                items: item2Obj ? [itemObj, item2Obj] : [itemObj],
            },
            data: dataVal || DEFAULT_SAMPLE_DATA,
            themeConfig: {
                colorPrimary,
            },
        };

        if (useHandDrawn) {
            options.theme = 'hand-drawn';
        }

        if (themeType === 'dark') {
            options.themeConfig!.colorBg = '#333';
        }
        if (enablePalette) {
            options.themeConfig!.palette = [
                '#f94144', '#f3722c', '#f8961e', '#f9c74f', '#90be6d', '#43aa8b', '#577590',
            ];
        }

        onChange(JSON.stringify(options, null, 2));
    }, [structure, item, item2, dataKey, themeType, colorPrimary, enablePalette, useHandDrawn, onChange, aiGeneratedData]);

    useEffect(() => {
        updateOptions();
    }, [updateOptions]);

    return (
        <div style={{ padding: '0 4px', height: '100%' }}>
            <div style={{ marginBottom: 24 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                    <AppstoreOutlined style={{ color: '#ff6b35' }} />
                    <Text strong style={{ fontSize: 16 }}>图表组合</Text>
                </div>
                <Card size="small" style={{ borderRadius: 12, boxShadow: '0 2px 8px rgba(0,0,0,0.02)', background: 'rgba(255,255,255,0.4)' }}>
                    <Form layout="vertical" size="small">
                        <Form.Item label="结构布局">
                            <Select showSearch value={structure} onChange={setStructure} options={structures.map(v => ({ label: getStructureName(v), value: v }))} optionFilterProp="label" />
                        </Form.Item>
                        <Form.Item label="主要项">
                            <Select showSearch value={item} onChange={setItem} options={items.map(v => ({ label: getItemName(v), value: v }))} optionFilterProp="label" />
                        </Form.Item>
                        <Form.Item label="次要项 (可选)">
                            <Select showSearch allowClear value={item2} onChange={setItem2} options={items.map(v => ({ label: getItemName(v), value: v }))} optionFilterProp="label" />
                        </Form.Item>
                        <Form.Item label="演示数据">
                            <Select value={dataKey} onChange={setDataKey} options={dataOptions} />
                        </Form.Item>
                    </Form>
                </Card>
            </div>

            <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                    <SettingOutlined style={{ color: '#ff6b35' }} />
                    <Text strong style={{ fontSize: 16 }}>外观设置</Text>
                </div>
                <Card size="small" style={{ borderRadius: 12, boxShadow: '0 2px 8px rgba(0,0,0,0.02)', background: 'rgba(255,255,255,0.4)' }}>
                    <Form layout="vertical" size="small">
                        <Form.Item label="主题模式">
                            <Radio.Group value={themeType} onChange={e => setThemeType(e.target.value)} buttonStyle="solid">
                                <Radio.Button value="light">亮色</Radio.Button>
                                <Radio.Button value="dark">暗色</Radio.Button>
                            </Radio.Group>
                        </Form.Item>
                        <Form.Item label="主色调">
                            <ColorPicker value={colorPrimary} onChange={(c, hex) => setColorPrimary(hex)} showText />
                        </Form.Item>
                        <Space direction="vertical" style={{ width: '100%' }}>
                            <Checkbox checked={enablePalette} onChange={e => setEnablePalette(e.target.checked)}>启用多彩色板</Checkbox>
                            <Checkbox checked={useHandDrawn} onChange={e => setUseHandDrawn(e.target.checked)}>手绘风格</Checkbox>
                        </Space>
                    </Form>
                </Card>
            </div>
        </div>
    );
};

const AUTO_TEMPLATE = 'auto-detect';

const QUICK_PROMPTS = [
    '特斯拉 SWOT 分析',
    '产品开发流程图',
    '2024年季度销售报表',
    '互联网技术演进史',
    '用户画像分析',
];

const THEMES = [
    { label: '默认', value: '', color: '#eff6ff', borderColor: '#2563eb' },
    { label: '商务蓝', value: 'theme\n  palette #1677ff #4096ff #69b1ff #91caff', color: '#1677ff', borderColor: '#1677ff' },
    { label: '科技黑', value: 'theme dark\n  palette #1f2937 #4b5563 #9ca3af #e5e7eb', color: '#1f2937', borderColor: '#111827' },
    { label: '手绘风格', value: 'theme\n  stylize rough\n  base\n    text\n      font-family 851tegakizatsu', color: '#fff7ed', borderColor: '#c2410c' },
    { label: '活力橙', value: 'theme\n  palette #fa8c16 #ffbb96 #ffd591 #ffe7ba', color: '#fa8c16', borderColor: '#fa8c16' },
    { label: '清新绿', value: 'theme\n  palette #52c41a #95de64 #b7eb8f #d9f7be', color: '#52c41a', borderColor: '#52c41a' },
    { label: '深邃紫', value: 'theme\n  palette #722ed1 #b37feb #d3adf7 #efdbff', color: '#722ed1', borderColor: '#722ed1' },
    { label: '日落红', value: 'theme\n  palette #f5222d #ff4d4f #ff7875 #ffa39e', color: '#f5222d', borderColor: '#f5222d' },
];

const SYSTEM_PROMPT = `你是一个专业的信息图生成助手，精通 AntV Infographic 的 DSL 语法。

## 核心原则

**最重要的是：深入理解用户内容的本质，选择最能表达其语义的模板。**

在生成信息图之前，你必须先分析：
1. **内容类型**：是流程、对比、层级、数据还是概念？
2. **信息关系**：条目之间是顺序、并列、对比还是包含关系？
3. **表达目的**：用户想强调什么？时间演进？优劣对比？结构层次？

## 模板选择决策树（必须遵循）

### 第一步：识别内容类型

| 内容特征 | 推荐模板类别 |
|---------|-------------|
| 有明确的时间顺序或阶段 | sequence-timeline-*, sequence-roadmap-* |
| 描述步骤、流程、方法 | sequence-steps-*, sequence-snake-*, sequence-ascending-* |
| 两方对比、优劣分析、A vs B | compare-binary-* |
| SWOT、四个维度分析 | compare-swot, quadrant-* |
| 组织架构、分类层级 | hierarchy-tree-* |
| 功能列表、要点罗列 | list-grid-*, list-row-* |
| 数据占比、统计分布 | chart-pie-*, chart-column-* |
| 循环流程、闭环 | sequence-circular-* |
| 漏斗转化、筛选过程 | sequence-filter-mesh-* |
| 递进关系、金字塔结构 | sequence-pyramid-*, list-pyramid-* |

### 第二步：根据条目数量优化

| 条目数量 | 推荐模板 |
|---------|---------|
| 2-3 个 | sequence-steps-*, compare-binary-* |
| 4 个 | quadrant-*, compare-swot |
| 4-6 个 | list-grid-*, sequence-timeline-*, sequence-snake-* |
| 6-8 个 | sequence-roadmap-*, list-row-* |
| 8+ 个 | hierarchy-tree-*, chart-wordcloud |

### 第三步：考虑视觉效果

- 需要强调递进感 → sequence-ascending-*, sequence-stairs-*
- 需要强调循环 → sequence-circular-*, sequence-circle-arrows-*
- 需要强调对比 → compare-binary-*, compare-hierarchy-*
- 需要强调层次 → hierarchy-tree-*, list-pyramid-*
- 需要生动活泼 → *-illus 系列（带插图）
- 需要专业商务 → *-badge-card, *-compact-card 系列

## 输出格式

始终只输出 AntV Infographic Syntax 纯语法文本，外层包裹 \`\`\`plain 代码块。
严禁输出 JSON、Markdown、解释性文字或任何额外内容。

## AntV Infographic Syntax 语法

### 基本结构
\`\`\`plain
infographic <template-name>
data
  title 标题文本
  desc 描述文本
  items
    - label 条目标签
      value 12.5
      desc 条目描述
      icon mdi/rocket-launch
theme
  palette #3b82f6 #8b5cf6 #f97316
\`\`\`

### 语法要点

- 第一行以 \`infographic <template-name>\` 开头
- 使用 block 描述 data / theme，层级通过**两个空格**缩进
- 键值对使用「键 值」形式，数组通过 \`-\` 分项
- data 应包含 title/desc/items（根据语义可省略不必要字段）
- data.items 可包含 label/value/desc/icon/illus/children 等字段
- 对比类模板（compare-*）应构建两个根节点，对比项作为 children
- 使用 theme 定制色板或样式

## 图标资源（必须为每个条目添加图标）

**格式**: \`icon <collection>/<icon-name>\`

**图标选择原则**：
1. 图标必须与条目内容语义相关
2. 优先使用 mdi/* 图标集
3. 同一信息图中图标风格保持一致

**按语义分类的推荐图标**:

| 语义场景 | 推荐图标 |
|---------|---------|
| 开始/启动 | mdi/rocket-launch, mdi/play-circle, mdi/flag |
| 结束/完成 | mdi/check-circle, mdi/flag-checkered, mdi/trophy |
| 分析/研究 | mdi/magnify, mdi/chart-line, mdi/brain |
| 设计/创意 | mdi/pencil, mdi/palette, mdi/lightbulb |
| 开发/技术 | mdi/code-tags, mdi/laptop, mdi/server |
| 测试/验证 | mdi/bug, mdi/shield-check, mdi/test-tube |
| 发布/上线 | mdi/cloud-upload, mdi/rocket, mdi/send |
| 用户/客户 | mdi/account, mdi/account-group, mdi/human-greeting |
| 增长/提升 | mdi/trending-up, mdi/chart-line, mdi/arrow-up-bold |
| 安全/保护 | mdi/shield, mdi/lock, mdi/security |
| 速度/效率 | mdi/lightning-bolt, mdi/speedometer, mdi/clock-fast |
| 协作/团队 | mdi/account-group, mdi/handshake, mdi/link |
| 数据/存储 | mdi/database, mdi/cloud, mdi/folder |
| 通信/连接 | mdi/email, mdi/phone, mdi/message |
| 金融/商务 | mdi/currency-usd, mdi/briefcase, mdi/bank |
| 学习/教育 | mdi/school, mdi/book-open, mdi/graduation-cap |
| 健康/医疗 | mdi/heart-pulse, mdi/hospital, mdi/pill |
| 环境/自然 | mdi/leaf, mdi/earth, mdi/tree |

## 插图资源（仅用于 *-illus 模板）

**格式**: \`illus <illustration-name>\`（使用**连字符**分隔）

**常用插图**: programming, business-plan, data-report, team-work, analytics, creative-team, process, collaboration

## 模板详细列表

**时序/流程类** ⭐最常用:
- sequence-timeline-simple - 时间轴（适合：发展历程、演进史、里程碑）
- sequence-timeline-rounded-rect-node - 时间轴圆角节点
- sequence-roadmap-vertical-simple - 路线图（适合：规划、计划、路径）
- sequence-steps-simple - 步骤流程（适合：操作指南、方法步骤）
- sequence-ascending-steps - 上升台阶（适合：递进、成长、升级）
- sequence-snake-steps-simple - 蛇形步骤（适合：复杂流程、多步骤）
- sequence-circular-simple - 环形流程（适合：循环、闭环、周期）
- sequence-pyramid-simple - 金字塔（适合：层级、优先级、重要性递减）
- sequence-filter-mesh-simple - 漏斗图（适合：转化、筛选、过滤）

**对比分析类**:
- compare-swot - SWOT分析（适合：优势劣势机会威胁）
- compare-binary-horizontal-simple-fold - 双边对比（适合：A vs B、优劣对比）
- compare-binary-horizontal-badge-card-arrow - 双边对比卡片
- compare-hierarchy-left-right-circle-node-pill-badge - 左右层级对比

**层级结构类**:
- hierarchy-tree-tech-style-capsule-item - 技术风格树形（适合：组织架构、分类）
- hierarchy-tree-curved-line-rounded-rect-node - 曲线树形

**列表类**:
- list-grid-badge-card - 网格徽章卡片（适合：功能介绍、特点罗列）
- list-grid-candy-card-lite - 糖果卡片（适合：轻松活泼的内容）
- list-row-horizontal-icon-arrow - 横向图标箭头（适合：流程概览）

**图表类**:
- chart-pie-plain-text - 饼图（适合：占比、分布）
- chart-column-simple - 柱状图（适合：数量对比）
- chart-wordcloud - 词云（适合：关键词、热点）

**四象限类**:
- quadrant-quarter-simple-card - 四象限（适合：二维分析、矩阵）

## 完整示例

### 示例1：产品开发流程（选择 sequence-ascending-steps 强调递进）

\`\`\`plain
infographic sequence-ascending-steps
data
  title 产品开发流程
  desc 从概念到上线的完整路径
  items
    - label 需求分析
      desc 深入理解用户痛点
      icon mdi/magnify
    - label 产品设计
      desc 原型与交互设计
      icon mdi/pencil-ruler
    - label 技术开发
      desc 前后端实现
      icon mdi/code-tags
    - label 测试验证
      desc 质量保障
      icon mdi/bug-check
    - label 发布上线
      desc 产品交付
      icon mdi/rocket-launch
theme
  palette #3b82f6 #6366f1 #8b5cf6 #a855f7 #d946ef
\`\`\`

### 示例2：SWOT分析（选择 compare-swot）

\`\`\`plain
infographic compare-swot
data
  title 企业SWOT分析
  desc 战略规划基础
  items
    - label S 优势
      children
        - label 技术领先
        - label 品牌知名度高
        - label 团队经验丰富
    - label W 劣势
      children
        - label 市场份额较小
        - label 资金相对有限
    - label O 机会
      children
        - label 市场需求增长
        - label 政策支持
        - label 新技术应用
    - label T 威胁
      children
        - label 竞争加剧
        - label 成本上升
theme
  palette #22c55e #ef4444 #3b82f6 #f59e0b
\`\`\`

### 示例3：功能特点（选择 list-grid-badge-card）

\`\`\`plain
infographic list-grid-badge-card
data
  title 核心功能
  desc 为您提供全方位解决方案
  items
    - label 智能分析
      desc AI驱动的数据洞察
      icon mdi/brain
    - label 实时协作
      desc 团队高效沟通
      icon mdi/account-group
    - label 安全可靠
      desc 企业级数据保护
      icon mdi/shield-check
    - label 极速响应
      desc 毫秒级处理速度
      icon mdi/lightning-bolt
theme
  palette #6366f1 #8b5cf6 #a855f7 #d946ef
\`\`\`

## 重要提醒

1. **必须尊重用户语言**：用户用中文提问，所有内容必须用中文
2. **必须添加图标**：每个条目都要有语义相关的图标
3. **必须选对模板**：根据内容本质选择，不要随意选择
4. **保持简洁**：条目数量控制在 3-8 个，描述简明扼要
5. **缩进规范**：严格使用两个空格缩进`;

// 模板生成的系统提示词
const TEMPLATE_SYSTEM_PROMPT = `你是一个专业的信息图模板设计助手，精通 AntV Infographic 的模板配置系统。

## 核心任务

根据用户的描述，生成一个自定义模板配置。模板配置决定了信息图的布局结构和数据项展示方式。

## 模板配置结构

模板配置是一个 JSON 对象，包含 design 和可选的 themeConfig：

\`\`\`typescript
{
  design: {
    title: 'default',  // 标题样式，通常使用 'default'
    structure: {       // 结构布局配置
      type: string,    // 结构类型（必填）
      // ...其他结构配置
    },
    items: [           // 数据项配置数组
      {
        type: string,  // 数据项类型（必填）
        // ...其他数据项配置
      }
    ]
  },
  themeConfig?: {      // 可选的主题配置
    colorPrimary?: string,
    palette?: string[]
  }
}
\`\`\`

## 可用的结构布局 (structure.type)

### 时序/流程类 - 适合展示步骤、流程、时间线
| 类型 | 说明 | 常用配置 |
|------|------|----------|
| sequence-timeline | 时间轴 | gap: 间距 |
| sequence-roadmap-vertical | 垂直路线图 | gap: 间距 |
| sequence-steps | 步骤流程 | gap: 间距 |
| sequence-ascending-steps | 上升台阶 | vGap, hGap: 垂直/水平间距 |
| sequence-snake-steps | 蛇形步骤 | - |
| sequence-color-snake-steps | 彩色蛇形步骤 | - |
| sequence-horizontal-zigzag | 水平Z字形 | - |
| sequence-zigzag-steps | Z字形步骤 | - |
| sequence-circular | 环形流程 | - |
| sequence-pyramid | 金字塔 | - |
| sequence-filter-mesh | 漏斗图 | - |
| sequence-mountain | 山峰图 | - |
| sequence-cylinders-3d | 3D圆柱 | gapY: 垂直间距 |
| sequence-ascending-stairs-3d | 3D楼梯 | - |
| sequence-stairs-front | 正面阶梯 | - |
| sequence-circle-arrows | 环形箭头 | - |

### 列表类 - 适合展示要点、功能、特性
| 类型 | 说明 | 常用配置 |
|------|------|----------|
| list-grid | 网格列表 | gap: 间距, zigzag: 是否交错 |
| list-row | 横向列表 | gap: 间距, zigzag: 是否交错 |
| list-column | 纵向列表 | gap: 间距, zigzag: 是否交错 |
| list-pyramid | 金字塔列表 | - |
| list-sector | 扇形列表 | startAngle, endAngle: 起止角度 |

### 对比类 - 适合对比分析、SWOT
| 类型 | 说明 | 常用配置 |
|------|------|----------|
| compare-binary-horizontal | 双边对比 | dividerType: 'vs'/'pros-cons-fold'/'pros-cons-arrow' |
| compare-hierarchy-left-right | 左右层级对比 | decoration: 'split-line'/'dot-line', groupGap |
| compare-hierarchy-row | 行式层级对比 | itemGap, itemPadding, showColumnBackground |

### 层级类 - 适合组织架构、树形关系
| 类型 | 说明 | 常用配置 |
|------|------|----------|
| hierarchy-tree | 树形图 | - |
| hierarchy-mindmap | 思维导图 | - |

### 图表类 - 适合数据可视化
| 类型 | 说明 | 常用配置 |
|------|------|----------|
| chart-bar | 条形图 | - |
| chart-column | 柱状图 | - |
| chart-line | 折线图 | - |
| chart-pie | 饼图 | innerRadius: 内半径（环形图） |
| chart-wordcloud | 词云图 | - |

### 其他
| 类型 | 说明 | 常用配置 |
|------|------|----------|
| quadrant | 四象限图 | - |
| relation-circle | 圆形关系图 | - |

## 可用的数据项 (items[].type)

### 卡片类 - 信息丰富，适合详细展示
- **badge-card**: 徽章卡片，带图标和标签
- **compact-card**: 紧凑卡片，适合密集展示
- **candy-card-lite**: 糖果卡片，色彩丰富
- **ribbon-card**: 丝带卡片，带装饰
- **progress-card**: 进度卡片，带进度条
- **indexed-card**: 索引卡片，带序号
- **letter-card**: 字母卡片，适合 SWOT 等
- **l-corner-card**: L角卡片，适合阶梯

### 文本类 - 简洁，适合简单展示
- **simple**: 简单项，最基础
- **plain-text**: 纯文本
- **underline-text**: 下划线文本

### 节点类 - 适合层级、关系图
- **circle-node**: 圆形节点
- **rounded-rect-node**: 圆角矩形节点
- **capsule-item**: 胶囊项

### 进度类 - 适合展示数值、进度
- **circular-progress**: 环形进度
- **quarter-circular**: 四分环形
- **done-list**: 完成清单

### 徽章类 - 适合标签、标记
- **pill-badge**: 药丸徽章
- **icon-badge**: 图标徽章

### 箭头类 - 适合流程、步骤
- **horizontal-icon-arrow**: 横向图标箭头
- **horizontal-icon-line**: 横向图标线
- **vertical-icon-arrow**: 纵向图标箭头
- **simple-horizontal-arrow**: 简单横向箭头
- **simple-vertical-arrow**: 简单纵向箭头

## 数据项常用配置

- **showIcon**: boolean - 是否显示图标
- **usePaletteColor**: boolean - 是否使用色板颜色
- **width**: number - 宽度
- **positionV**: 'top' | 'middle' | 'bottom' - 垂直位置
- **positionH**: 'left' | 'center' | 'right' - 水平位置

## 输出格式

输出一个 JSON 对象，用 \`\`\`json 代码块包裹：

\`\`\`json
{
  "name": "模板英文名-用连字符分隔",
  "label": "模板中文名称",
  "config": {
    "design": {
      "title": "default",
      "structure": { "type": "结构类型", ...其他配置 },
      "items": [{ "type": "数据项类型", ...其他配置 }]
    },
    "themeConfig": {
      "colorPrimary": "#颜色值"
    }
  }
}
\`\`\`

## 示例

### 示例1：带徽章的时间轴
用户需求：我想要一个时间轴模板，每个节点用卡片展示

\`\`\`json
{
  "name": "timeline-badge-card",
  "label": "徽章时间轴",
  "config": {
    "design": {
      "title": "default",
      "structure": { "type": "sequence-timeline", "gap": 20 },
      "items": [{ "type": "badge-card" }]
    }
  }
}
\`\`\`

### 示例2：彩色网格列表
用户需求：做一个产品功能展示，用网格布局，要有颜色区分

\`\`\`json
{
  "name": "grid-candy-features",
  "label": "彩色功能网格",
  "config": {
    "design": {
      "title": "default",
      "structure": { "type": "list-grid" },
      "items": [{ "type": "candy-card-lite" }]
    },
    "themeConfig": {
      "colorPrimary": "#6366f1"
    }
  }
}
\`\`\`

### 示例3：层级对比
用户需求：做一个优缺点对比图

\`\`\`json
{
  "name": "pros-cons-compare",
  "label": "优缺点对比",
  "config": {
    "design": {
      "title": "default",
      "structure": { 
        "type": "compare-hierarchy-left-right", 
        "decoration": "split-line",
        "groupGap": -20
      },
      "items": [
        { "type": "circle-node", "width": 200 }, 
        { "type": "pill-badge" }
      ]
    }
  }
}
\`\`\`

## 注意事项

1. **结构与数据项匹配**：选择的数据项要与结构布局相匹配
2. **items 数组**：
   - 大多数结构只需要一个数据项
   - 层级结构（hierarchy-*、compare-hierarchy-*）可以用多个数据项表示不同层级
3. **命名规范**：name 使用小写英文和连字符，label 使用简洁的中文
4. **配置精简**：只添加必要的配置，不要添加默认值`;

const ProductAppContent = ({ initialPrompt, onGenerate }: { initialPrompt?: string; onGenerate?: () => boolean }) => {
    const { message, modal } = App.useApp();
    const [apiKey, setApiKey] = useState(localStorage.getItem('deepseek_api_key') || '');
    const [prompt, setPrompt] = useState(initialPrompt || '');
    const [selectedTemplate, setSelectedTemplate] = useState(AUTO_TEMPLATE);
    const [selectedTheme, setSelectedTheme] = useState('');
    const [loading, setLoading] = useState(false);
    const [aiDsl, setAiDsl] = useState(''); // AI 生成模式的 DSL
    const [compositeDsl, setCompositeDsl] = useState(''); // 灵活组合模式的 DSL
    const [viewMode, setViewMode] = useState<'preview' | 'visual' | 'code'>('preview');
    const [exportDpr, setExportDpr] = useState(3); // PNG 导出清晰度（1-5 倍）
    const [optimizationResult, setOptimizationResult] = useState<any>(null);
    const [optimizationLoading, setOptimizationLoading] = useState(false);
    const [sidebarMode, setSidebarMode] = useState<'ai' | 'composite' | 'templates' | 'settings'>('ai');
    const [galleryVisible, setGalleryVisible] = useState(false);
    const [aiGeneratedData, setAiGeneratedData] = useState<any>(null);
    
    // 批量生成相关状态
    const [batchModalVisible, setBatchModalVisible] = useState(false);
    const [batchTemplates, setBatchTemplates] = useState<string[]>([]);
    const [batchResults, setBatchResults] = useState<Array<{ template: string; dsl: string }>>([]);
    const [batchLoading, setBatchLoading] = useState(false);
    
    // 品牌配色相关状态
    const [brandColorModalVisible, setBrandColorModalVisible] = useState(false);
    const [brandColors, setBrandColors] = useState<Array<{ name: string; colors: string[]; primary: string }>>(() => {
        const saved = localStorage.getItem('brand_colors');
        return saved ? JSON.parse(saved) : [];
    });
    const [newBrandName, setNewBrandName] = useState('');
    const [newBrandColors, setNewBrandColors] = useState<string[]>(['#1677ff', '#4096ff', '#69b1ff', '#91caff']);
    const [editingBrandIndex, setEditingBrandIndex] = useState<number | null>(null);
    
    // 自定义模板相关状态
    const [templateModalVisible, setTemplateModalVisible] = useState(false);
    const [templatePrompt, setTemplatePrompt] = useState('');
    const [templateLoading, setTemplateLoading] = useState(false);
    const [customTemplates, setCustomTemplates] = useState<Array<{ name: string; label: string; config: any }>>(() => {
        const saved = localStorage.getItem('custom_templates');
        if (saved) {
            const parsed = JSON.parse(saved);
            // 重新注册已保存的自定义模板
            parsed.forEach((t: { name: string; config: any }) => {
                if (t.config) {
                    registerTemplate(t.name, t.config);
                }
            });
            return parsed;
        }
        return [];
    });
    const [allTemplates, setAllTemplates] = useState(getTemplates());
    const [generatedTemplateConfig, setGeneratedTemplateConfig] = useState<{ name: string; label: string; config: any } | null>(null);
    const [templateGenerationOutput, setTemplateGenerationOutput] = useState('');
    const [templatePreviewData, setTemplatePreviewData] = useState<any>(null);

    // AI 助手相关状态
    const [assistantOpen, setAssistantOpen] = useState(false);
    const [assistantExpanded, setAssistantExpanded] = useState(false);
    const [chatMessages, setChatMessages] = useState<Array<{ role: 'user' | 'assistant'; content: string; promptSuggestion?: string }>>([]);
    const [chatInput, setChatInput] = useState('');
    const [chatLoading, setChatLoading] = useState(false);

    // 根据当前模式获取对应的 DSL
    const dsl = sidebarMode === 'ai' ? aiDsl : compositeDsl;
    const setDsl = sidebarMode === 'ai' ? setAiDsl : setCompositeDsl;

    const handleCompositeChange = (optionStr: string) => {
        setCompositeDsl(optionStr);
        setViewMode('preview');
    };

    // AI 助手系统提示词 - 专注于生成优化的提示词
    const ASSISTANT_SYSTEM_PROMPT = `你是一个专业的信息图可视化顾问，帮助用户将模糊的想法转化为清晰的信息图描述。

## 核心任务

当用户描述他们想要创建的信息图时，你需要：
1. 理解用户的真实需求
2. 提供专业的可视化建议
3. **生成一个优化后的提示词**，用于信息图生成

## 回复格式

你的回复应该包含两部分：

1. **分析与建议**（使用 Markdown 格式）：
   - 简要分析用户需求
   - 推荐合适的模板类型
   - 提供设计建议

2. **优化后的提示词**（必须用特殊标记包裹）：
   在回复末尾，用 \`【提示词】\` 和 \`【/提示词】\` 包裹生成的提示词，例如：
   
   【提示词】
   帮我画一个产品开发流程图，包含5个阶段：需求分析、设计、开发、测试、上线。每个阶段用图标表示，整体风格简洁专业。
   【/提示词】

## 可用的模板类型

- **sequence-*** 系列：流程、时间线、步骤（推荐 3-8 个条目）
- **list-*** 系列：要点罗列、功能介绍（推荐 4-6 个条目）
- **compare-*** 系列：对比分析、SWOT分析
- **hierarchy-*** 系列：组织架构、树形关系
- **chart-*** 系列：数据可视化、统计图表
- **quadrant-*** 系列：四象限分析（恰好 4 个条目）
- **relation-*** 系列：关系展示

## 可用的主题

tech-blue（科技蓝）、gradient-purple（渐变紫）、fresh-green（清新绿）、warm-orange（暖橙）、business-gray（商务灰）、ocean（海洋）、forest（森林）、dark-tech（深色科技）

## 回答风格

- 使用 Markdown 格式，包括标题、列表、加粗等
- 简洁专业，直接给出建议
- 提示词要具体、结构化、易于 AI 理解
- 使用中文回答`;

    // AI 助手聊天处理
    const handleAssistantChat = async () => {
        if (!apiKey) {
            message.warning('请先设置 API Key');
            return;
        }
        if (!chatInput.trim()) return;

        const userMessage = chatInput.trim();
        setChatInput('');
        setChatMessages(prev => [...prev, { role: 'user', content: userMessage }]);
        setChatLoading(true);

        try {
            const response = await fetch('https://api.deepseek.com/chat/completions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${apiKey}`,
                },
                body: JSON.stringify({
                    model: 'deepseek-chat',
                    messages: [
                        { role: 'system', content: ASSISTANT_SYSTEM_PROMPT },
                        ...chatMessages.map(m => ({ role: m.role, content: m.content })),
                        { role: 'user', content: userMessage },
                    ],
                    stream: true,
                }),
            });

            if (!response.ok) throw new Error('API 请求失败');
            if (!response.body) throw new Error('No response body');

            const reader = response.body.getReader();
            const decoder = new TextDecoder();
            let accumulatedContent = '';
            let buffer = '';

            // 添加空的助手消息
            setChatMessages(prev => [...prev, { role: 'assistant', content: '' }]);

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;

                const chunk = decoder.decode(value, { stream: true });
                buffer += chunk;
                const lines = buffer.split('\n');
                buffer = lines.pop() || '';

                for (const line of lines) {
                    const trimmedLine = line.trim();
                    if (trimmedLine.startsWith('data: ') && trimmedLine !== 'data: [DONE]') {
                        try {
                            const data = JSON.parse(trimmedLine.slice(6));
                            const content = data.choices[0]?.delta?.content || '';
                            accumulatedContent += content;
                            
                            // 提取提示词
                            const promptMatch = accumulatedContent.match(/【提示词】\n?([\s\S]*?)(?:【\/提示词】|$)/);
                            const promptSuggestion = promptMatch ? promptMatch[1].trim() : undefined;
                            
                            // 更新最后一条消息
                            setChatMessages(prev => {
                                const newMessages = [...prev];
                                newMessages[newMessages.length - 1] = { 
                                    role: 'assistant', 
                                    content: accumulatedContent,
                                    promptSuggestion
                                };
                                return newMessages;
                            });
                        } catch (e) {
                            // ignore parse errors
                        }
                    }
                }
            }
        } catch (error: any) {
            message.error(error.message || '对话失败');
            setChatMessages(prev => prev.slice(0, -1)); // 移除空的助手消息
        } finally {
            setChatLoading(false);
        }
    };

    // 应用提示词到创意描述
    const handleApplyPrompt = (promptText: string) => {
        setPrompt(promptText);
        setSidebarMode('ai');
        message.success('已应用到创意描述');
    };

    // 快捷问题 - 引导用户描述需求
    const QUICK_QUESTIONS = [
        '我想做一个产品功能介绍',
        '帮我分析一下竞品对比',
        '我要展示项目时间线',
        '做一个团队组织架构图',
    ];

    // 生成自定义模板（流式）
    const handleGenerateTemplate = async () => {
        if (!apiKey) {
            message.warning('请先设置 API Key');
            return;
        }
        if (!templatePrompt) {
            message.warning('请描述你想要的模板');
            return;
        }

        setTemplateLoading(true);
        setGeneratedTemplateConfig(null);
        setTemplateGenerationOutput('');
        setTemplatePreviewData(null);

        try {
            const response = await fetch('https://api.deepseek.com/chat/completions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${apiKey}`,
                },
                body: JSON.stringify({
                    model: 'deepseek-chat',
                    messages: [
                        { role: 'system', content: TEMPLATE_SYSTEM_PROMPT },
                        { role: 'user', content: `请根据以下描述生成一个自定义模板：\n${templatePrompt}` },
                    ],
                    stream: true,
                }),
            });

            if (!response.ok) throw new Error('API 请求失败');
            if (!response.body) throw new Error('No response body');

            const reader = response.body.getReader();
            const decoder = new TextDecoder();
            let accumulatedContent = '';
            let buffer = '';

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;

                const chunk = decoder.decode(value, { stream: true });
                buffer += chunk;
                const lines = buffer.split('\n');
                buffer = lines.pop() || '';

                for (const line of lines) {
                    const trimmedLine = line.trim();
                    if (trimmedLine.startsWith('data: ') && trimmedLine !== 'data: [DONE]') {
                        try {
                            const data = JSON.parse(trimmedLine.slice(6));
                            const content = data.choices[0]?.delta?.content || '';
                            accumulatedContent += content;
                            setTemplateGenerationOutput(accumulatedContent);
                        } catch (e) {
                            // ignore parse errors
                        }
                    }
                }
            }

            // 解析生成的 JSON
            const jsonMatch = accumulatedContent.match(/```json\n([\s\S]*?)\n```/) || accumulatedContent.match(/\{[\s\S]*\}/);
            if (!jsonMatch) {
                throw new Error('无法解析模板配置');
            }

            const templateData = JSON.parse(jsonMatch[1] || jsonMatch[0]);
            const { name, label, config } = templateData;

            if (!name || !config) {
                throw new Error('模板配置不完整');
            }

            // 保存生成的配置，等待用户确认
            setGeneratedTemplateConfig({ name, label: label || name, config });
            
            // 生成预览数据
            const previewOptions: InfographicOptions = {
                ...config,
                data: DEFAULT_SAMPLE_DATA, // 使用示例数据预览
                padding: 20,
            };
            setTemplatePreviewData(previewOptions);
            
            message.success('模板生成完成，请预览确认');
        } catch (error: any) {
            message.error(error.message || '模板生成失败');
        } finally {
            setTemplateLoading(false);
        }
    };

    // 确认添加模板到库
    const handleConfirmTemplate = () => {
        if (!generatedTemplateConfig) return;
        
        const { name, label, config } = generatedTemplateConfig;
        
        // 注册模板
        registerTemplate(name, config);
        
        // 更新自定义模板列表（保存完整配置）
        const newCustomTemplates = [...customTemplates, { name, label, config }];
        setCustomTemplates(newCustomTemplates);
        localStorage.setItem('custom_templates', JSON.stringify(newCustomTemplates));
        
        // 更新模板列表
        setAllTemplates(getTemplates());
        
        message.success(`模板 "${label}" 已添加到模板库！`);
        
        // 重置状态
        setTemplateModalVisible(false);
        setTemplatePrompt('');
        setGeneratedTemplateConfig(null);
        setTemplateGenerationOutput('');
        setTemplatePreviewData(null);
        
        // 自动选择新创建的模板
        setSelectedTemplate(name);
    };

    // 取消/重新生成
    const handleCancelTemplate = () => {
        setGeneratedTemplateConfig(null);
        setTemplateGenerationOutput('');
        setTemplatePreviewData(null);
    };

    // Instant template switching without regeneration (only for AI mode)
    const handleTemplateChange = (newTemplate: string) => {
        setSelectedTemplate(newTemplate);

        // If we have existing AI DSL and the new template is not auto-detect, switch instantly
        if (aiDsl && newTemplate !== AUTO_TEMPLATE) {
            const lines = aiDsl.split('\n');
            // Check if the first line contains an infographic declaration
            if (lines[0] && lines[0].trim().startsWith('infographic ')) {
                lines[0] = `infographic ${newTemplate}`;
                setAiDsl(lines.join('\n'));
                message.info(`已切换到模板: ${getTemplateName(newTemplate)}`);
            }
        }
    };

    const handleThemeChange = (newThemeDsl: string) => {
        setSelectedTheme(newThemeDsl);
        // 主题切换只影响 AI 模式的 DSL
        if (!aiDsl) {
            // 即使没有 DSL，也显示提示
            if (newThemeDsl) {
                message.info('已选择主题，生成时将自动应用');
            }
            return;
        }

        // 检查 dsl 是否是 JSON 格式
        let isJson = false;
        let jsonObj: any = null;
        try {
            jsonObj = JSON.parse(aiDsl);
            if (jsonObj && typeof jsonObj === 'object' && jsonObj.design) {
                isJson = true;
            }
        } catch (e) {
            // 不是 JSON，是 DSL 格式
        }

        if (isJson && jsonObj) {
            // JSON 格式：直接修改 themeConfig
            if (newThemeDsl) {
                // 解析主题 DSL 并转换为 themeConfig
                const themeConfig: any = { ...jsonObj.themeConfig };
                if (newThemeDsl.includes('dark')) {
                    jsonObj.theme = 'dark';
                    themeConfig.colorBg = '#333';
                } else {
                    delete jsonObj.theme;
                    delete themeConfig.colorBg;
                }
                if (newThemeDsl.includes('stylize rough')) {
                    jsonObj.theme = 'hand-drawn';
                }
                // 提取 palette
                const paletteMatch = newThemeDsl.match(/palette\s+(#[a-fA-F0-9]{6}(?:\s+#[a-fA-F0-9]{6})*)/);
                if (paletteMatch) {
                    themeConfig.palette = paletteMatch[1].split(/\s+/);
                }
                jsonObj.themeConfig = themeConfig;
            } else {
                // 恢复默认主题
                delete jsonObj.theme;
                if (jsonObj.themeConfig) {
                    delete jsonObj.themeConfig.colorBg;
                    delete jsonObj.themeConfig.palette;
                }
            }
            setAiDsl(JSON.stringify(jsonObj, null, 2));
            message.info(newThemeDsl ? '已更新视觉主题' : '已恢复默认主题');
        } else {
            // DSL 格式：逐行处理，移除现有 theme 块
            const lines = aiDsl.split('\n');
            const filteredLines: string[] = [];
            let inThemeBlock = false;
            
            for (const line of lines) {
                if (line.match(/^theme(\s|$)/)) {
                    inThemeBlock = true;
                    continue;
                }
                if (inThemeBlock && line.match(/^  /)) {
                    continue;
                }
                inThemeBlock = false;
                filteredLines.push(line);
            }
            
            let newDsl = filteredLines.join('\n').trim();
            
            if (newThemeDsl) {
                // 追加新的 theme 块
                newDsl = newDsl + '\n' + newThemeDsl;
                setAiDsl(newDsl);
                message.info('已更新视觉主题');
            } else {
                setAiDsl(newDsl);
                message.info('已恢复默认主题');
            }
        }
    };

    const handleGenerate = async () => {
        // 检查是否可以生成
        if (onGenerate && !onGenerate()) {
            return;
        }

        if (!apiKey) {
            message.warning('请先设置 API Key');
            return;
        }
        if (!prompt) {
            message.warning('请输入描述内容');
            return;
        }

        setLoading(true);
        setViewMode('preview');
        setAiDsl('');

        try {
            // 检查是否选择了自定义模板
            const customTemplate = customTemplates.find(t => t.name === selectedTemplate);
            
            let userContent = selectedTemplate === AUTO_TEMPLATE
                ? `请根据以下内容生成信息图，自动选择最合适的模板：\n${prompt}`
                : customTemplate
                    ? `请使用自定义模板 "${selectedTemplate}" 生成信息图。

这是一个自定义模板，它的结构配置如下：
\`\`\`json
${JSON.stringify(customTemplate.config, null, 2)}
\`\`\`

请在生成的 DSL 中使用 "infographic ${selectedTemplate}" 作为第一行，然后根据模板的结构特点生成合适的数据。

用户需求：${prompt}`
                    : `请使用模板 ${selectedTemplate} 生成信息图。内容如下：\n${prompt}`;

            if (selectedTheme) {
                userContent += `\n\n请使用以下主题配置：\n${selectedTheme}`;
            }

            const response = await fetch('https://api.deepseek.com/chat/completions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${apiKey}`,
                },
                body: JSON.stringify({
                    model: 'deepseek-chat',
                    messages: [
                        { role: 'system', content: SYSTEM_PROMPT },
                        { role: 'user', content: userContent },
                    ],
                    stream: true,
                }),
            });

            if (response.status === 401) throw new Error('API Key 无效或过期');
            if (!response.ok) throw new Error('API Request Failed');
            if (!response.body) throw new Error('No response body');

            const reader = response.body.getReader();
            const decoder = new TextDecoder();
            let accumulatedContent = '';
            let buffer = '';
            let lastUpdateTime = 0;
            const UPDATE_INTERVAL = 300; // 每 300ms 更新一次，减少闪烁

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;

                const chunk = decoder.decode(value, { stream: true });
                buffer += chunk;
                const lines = buffer.split('\n');
                buffer = lines.pop() || '';

                for (const line of lines) {
                    const trimmedLine = line.trim();
                    if (trimmedLine.startsWith('data: ') && trimmedLine !== 'data: [DONE]') {
                        try {
                            const data = JSON.parse(trimmedLine.slice(6));
                            const content = data.choices[0]?.delta?.content || '';
                            accumulatedContent += content;
                            
                            // 限制更新频率，减少闪烁
                            const now = Date.now();
                            if (now - lastUpdateTime >= UPDATE_INTERVAL) {
                                // 尝试多种代码块格式提取 DSL
                                const match = accumulatedContent.match(/```(?:plain|plaintext)?\n([\s\S]*?)(?:```|$)/) 
                                    || accumulatedContent.match(/```\n?([\s\S]*?)(?:```|$)/);
                                if (match) {
                                    setAiDsl(match[1]);
                                } else {
                                    // 如果没有代码块，直接显示内容
                                    setAiDsl(accumulatedContent);
                                }
                                lastUpdateTime = now;
                            }
                        } catch (e) {
                            console.warn('Error parsing stream chunk', e);
                        }
                    }
                }
            }
            
            // 最终提取 DSL
            const finalMatch = accumulatedContent.match(/```(?:plain|plaintext)?\n([\s\S]*?)```/) 
                || accumulatedContent.match(/```\n?([\s\S]*?)```/);
            let finalDsl = finalMatch ? finalMatch[1] : accumulatedContent;
            
            // 如果有选择的主题配色，确保应用到 DSL 中
            if (selectedTheme) {
                // 移除 AI 生成的 theme 块（匹配 theme 开头的行及其后续缩进行）
                const lines = finalDsl.split('\n');
                const filteredLines: string[] = [];
                let inThemeBlock = false;
                
                for (const line of lines) {
                    if (line.match(/^theme(\s|$)/)) {
                        inThemeBlock = true;
                        continue;
                    }
                    if (inThemeBlock && line.match(/^  /)) {
                        continue;
                    }
                    inThemeBlock = false;
                    filteredLines.push(line);
                }
                
                // 追加用户选择的主题
                finalDsl = filteredLines.join('\n').trim() + '\n' + selectedTheme;
            }
            
            setAiDsl(finalDsl);
            
            message.success('生成成功');
            // 提取 AI 生成的数据，供灵活组合模式使用
            try {
                const parsed = parseSyntax(accumulatedContent.match(/```(?:plain)?\n([\s\S]*?)(?:```|$)/)?.[1] || accumulatedContent);
                if (parsed.options?.data) {
                    setAiGeneratedData(parsed.options.data);
                }
            } catch (e) {
                console.warn('Failed to parse syntax for data extraction:', e);
            }
            localStorage.setItem('deepseek_api_key', apiKey);
        } catch (error: any) {
            message.error(error.message || '生成失败');
        } finally {
            setLoading(false);
        }
    };

    // 如果有初始提示词，自动触发生成
    const [hasTriggeredInitial, setHasTriggeredInitial] = useState(false);
    useEffect(() => {
        if (initialPrompt && apiKey && !hasTriggeredInitial && !loading) {
            setHasTriggeredInitial(true);
            // 延迟一点执行，确保组件完全渲染
            setTimeout(() => {
                handleGenerate();
            }, 500);
        }
    }, [initialPrompt, apiKey, hasTriggeredInitial, loading]);

    // 批量生成 - 使用多个模板生成同一内容
    const handleBatchGenerate = async () => {
        if (!apiKey) {
            message.warning('请先设置 API Key');
            return;
        }
        if (!prompt) {
            message.warning('请输入描述内容');
            return;
        }
        if (batchTemplates.length === 0) {
            message.warning('请至少选择一个模板');
            return;
        }

        setBatchLoading(true);
        setBatchResults([]);

        try {
            const results: Array<{ template: string; dsl: string }> = [];
            
            for (const templateName of batchTemplates) {
                const userContent = `请使用模板 ${templateName} 生成信息图。内容如下：\n${prompt}`;
                
                const response = await fetch('https://api.deepseek.com/chat/completions', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${apiKey}`,
                    },
                    body: JSON.stringify({
                        model: 'deepseek-chat',
                        messages: [
                            { role: 'system', content: SYSTEM_PROMPT },
                            { role: 'user', content: userContent },
                        ],
                        stream: false,
                    }),
                });

                if (!response.ok) throw new Error(`模板 ${templateName} 生成失败`);
                
                const data = await response.json();
                const content = data.choices[0]?.message?.content || '';
                const match = content.match(/```(?:plain|plaintext)?\n([\s\S]*?)```/) 
                    || content.match(/```\n?([\s\S]*?)```/);
                const dsl = match ? match[1] : content;
                
                results.push({ template: templateName, dsl });
                setBatchResults([...results]);
            }
            
            message.success(`已生成 ${results.length} 个版本`);
        } catch (error: any) {
            message.error(error.message || '批量生成失败');
        } finally {
            setBatchLoading(false);
        }
    };

    // 应用批量生成的结果
    const handleApplyBatchResult = (dsl: string) => {
        setAiDsl(dsl);
        setBatchModalVisible(false);
        message.success('已应用选中的版本');
    };

    const handleDownload = async (format: 'png' | 'svg' = 'png') => {
        try {
            const instance = (window as any).infographic;
            if (instance) {
                const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
                const filename = `infographic-${timestamp}.${format}`;

                if (format === 'png') {
                    // 使用用户选择的 DPR 值导出 PNG
                    const dataUrl = await instance.toDataURL({ dpr: exportDpr });
                    const link = document.createElement('a');
                    link.download = filename;
                    link.href = dataUrl;
                    link.click();
                    message.success(`PNG 已下载（${exportDpr}x 高清）`);
                } else {
                    // SVG Download Logic - PPT "Perfect Visual" Mode
                    const container = instance.options?.container;
                    const svgElement = container?.querySelector('svg');

                    if (svgElement) {
                        const clonedSvg = processForOffice(svgElement);
                        
                        const serializer = new XMLSerializer();
                        const svgString = '<?xml version="1.0" encoding="UTF-8"?>\n' + serializer.serializeToString(clonedSvg);
                        const blob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
                        const url = URL.createObjectURL(blob);

                        const link = document.createElement('a');
                        link.href = url;
                        link.download = filename;
                        link.click();
                        URL.revokeObjectURL(url);
                        message.success('SVG 已下载，可直接导入 Office');
                    } else {
                        message.error('未找到 SVG 元素');
                    }
                }

            } else {
                message.error('无法获取图表实例');
            }
        } catch (e) {
            console.error(e);
            message.error('下载失败');
        }
    };

    // 处理 SVG 使其兼容 Office
    const processForOffice = (svgElement: SVGElement): SVGElement => {
        const processNode = (source: Element, target: Element) => {
            const computedStyle = window.getComputedStyle(source);
            const tagName = source.tagName.toLowerCase();

            // 1. Mandatory Attributes for Office (Transfer from CSS)
            const styleToAttrMap: Record<string, string> = {
                'fill': 'fill',
                'stroke': 'stroke',
                'stroke-width': 'stroke-width',
                'font-size': 'font-size',
                'font-weight': 'font-weight',
                'text-anchor': 'text-anchor',
                'opacity': 'opacity',
                'visibility': 'visibility'
            };

            Object.keys(styleToAttrMap).forEach(styleProp => {
                let val = computedStyle.getPropertyValue(styleProp);
                if (val && val !== 'none' && val !== 'normal' && val !== 'initial') {
                    if (val.includes('rgba')) {
                        val = val.replace(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*[\d.]+)?\)/, 'rgb($1,$2,$3)');
                    }
                    target.setAttribute(styleToAttrMap[styleProp], val);
                }
            });

            // 2. Specialized Text Fixes for Office
            if (tagName === 'text' || tagName === 'tspan') {
                const baseline = computedStyle.getPropertyValue('dominant-baseline') || computedStyle.getPropertyValue('alignment-baseline');
                if (baseline === 'middle' || baseline === 'central') {
                    target.setAttribute('dy', '0.35em');
                }

                target.setAttribute('font-family', 'SimHei, "Microsoft YaHei", Arial, sans-serif');
                target.setAttribute('xml:space', 'preserve');

                if (!target.getAttribute('fill') || target.getAttribute('fill') === 'none') {
                    target.setAttribute('fill', '#333333');
                }
            }

            // 3. Cleanup for Office compatibility
            target.removeAttribute('clip-path');
            target.removeAttribute('mask');
            target.removeAttribute('style');

            const transform = source.getAttribute('transform');
            if (transform) target.setAttribute('transform', transform);

            const sourceChildren = source.children;
            const targetChildren = target.children;
            for (let i = 0; i < sourceChildren.length; i++) {
                if (targetChildren[i]) {
                    processNode(sourceChildren[i], targetChildren[i]);
                }
            }
        };

        const clonedSvg = svgElement.cloneNode(true) as SVGElement;
        processNode(svgElement, clonedSvg);

        clonedSvg.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
        const rect = svgElement.getBoundingClientRect();
        clonedSvg.setAttribute('width', Math.round(rect.width).toString());
        clonedSvg.setAttribute('height', Math.round(rect.height).toString());
        if (!clonedSvg.getAttribute('viewBox')) {
            clonedSvg.setAttribute('viewBox', `0 0 ${rect.width} ${rect.height}`);
        }

        return clonedSvg;
    };

    // AI 优化建议相关函数
    const handleOptimize = async (useAI: boolean = true) => {
        if (!dsl) {
            message.warning('请先生成信息图');
            return;
        }

        setOptimizationLoading(true);

        try {
            if (useAI && apiKey) {
                // 使用 AI 分析
                const result = await analyzeInfographic(dsl, apiKey);
                setOptimizationResult(result);
                message.success('AI 分析完成');
            } else {
                // 使用快速规则分析
                const suggestions = getQuickSuggestions(dsl);
                setOptimizationResult({
                    score: 75,
                    summary: '基于规则的快速分析完成，建议使用 AI 分析获得更详细的建议',
                    suggestions,
                });
                message.success('快速分析完成');
            }
        } catch (error: any) {
            message.error(error.message || '分析失败');
            // 降级到快速分析
            const suggestions = getQuickSuggestions(dsl);
            setOptimizationResult({
                score: 75,
                summary: 'AI 分析失败，已切换到快速分析模式',
                suggestions,
            });
        } finally {
            setOptimizationLoading(false);
        }
    };

    const handleApplySuggestion = (suggestion: OptimizationSuggestion) => {
        if (!suggestion.action) {
            message.info('💡 该建议需要手动调整');
            return;
        }
        
        // 检查是否支持该 action type
        const supportedTypes = ['apply-palette', 'apply-template'];
        if (!supportedTypes.includes(suggestion.action.type)) {
            message.info('💡 该建议需要手动调整');
            return;
        }
        
        try {
            const newDsl = applySuggestion(dsl, suggestion);
            
            if (newDsl === dsl) {
                message.warning('应用失败：DSL 未发生变化');
                return;
            }
            
            setDsl(newDsl);
            message.success('✅ 已应用优化建议');
        } catch (error: any) {
            message.error(`应用失败: ${error.message || '未知错误'}`);
        }
    };

    // 复制到剪贴板，支持直接粘贴到 Office
    const handleCopyForOffice = async () => {
        try {
            const instance = (window as any).infographic;
            if (!instance) {
                message.error('无法获取图表实例');
                return;
            }

            const container = instance.options?.container;
            const svgElement = container?.querySelector('svg');

            if (!svgElement) {
                message.error('未找到 SVG 元素');
                return;
            }

            // 处理 SVG 使其兼容 Office
            const clonedSvg = processForOffice(svgElement);
            const serializer = new XMLSerializer();
            const svgString = serializer.serializeToString(clonedSvg);

            // 同时生成 PNG 用于更好的兼容性
            const dataUrl = await instance.toDataURL();
            const response = await fetch(dataUrl);
            const pngBlob = await response.blob();

            // 创建 SVG Blob
            const svgBlob = new Blob([svgString], { type: 'image/svg+xml' });

            // 使用 Clipboard API 复制多种格式
            try {
                // 尝试复制 PNG（Office 更好支持）
                await navigator.clipboard.write([
                    new ClipboardItem({
                        'image/png': pngBlob,
                    })
                ]);
                message.success('已复制为图片，可直接粘贴到 Word/PPT/Excel');
            } catch (clipboardError) {
                // 降级：复制 SVG 文本
                await navigator.clipboard.writeText(svgString);
                message.success('已复制 SVG 代码，可在 Office 中通过"插入图片"使用');
            }
        } catch (e) {
            console.error(e);
            message.error('复制失败');
        }
    };

    return (
        <>
            <style>
                {`
                @import url('https://assets.antv.antgroup.com/AlibabaPuHuiTi-Regular/result.css');
                
                * { box-sizing: border-box; }
                body { margin: 0; padding: 0; overflow: hidden; }
                
                .app-container {
                    min-height: 100vh;
                    background: #ffffff;
                    position: relative;
                    overflow: hidden;
                }
                
                /* Gradient decorations like site */
                .bg-decoration-1 {
                    position: absolute;
                    left: -8rem;
                    top: -10rem;
                    width: 24rem;
                    height: 24rem;
                    border-radius: 50%;
                    background: linear-gradient(to bottom right, rgba(255, 53, 106, 0.15), rgba(255, 53, 106, 0.03), transparent);
                    filter: blur(48px);
                    pointer-events: none;
                }
                
                .bg-decoration-2 {
                    position: absolute;
                    right: -8rem;
                    top: 5rem;
                    width: 24rem;
                    height: 24rem;
                    border-radius: 50%;
                    background: linear-gradient(to bottom right, rgba(147, 51, 234, 0.1), transparent, rgba(255, 53, 106, 0.03));
                    filter: blur(48px);
                    pointer-events: none;
                }
                
                .sidebar-card {
                    background: rgba(255, 255, 255, 0.9);
                    backdrop-filter: blur(20px);
                    -webkit-backdrop-filter: blur(20px);
                    border: 1px solid rgba(0, 0, 0, 0.06);
                    border-radius: 16px;
                    box-shadow: 0 4px 24px rgba(0, 0, 0, 0.06);
                }
                
                .canvas-card {
                    background: #ffffff;
                    border: 1px solid rgba(0, 0, 0, 0.08);
                    border-radius: 16px;
                    box-shadow: 0 8px 32px rgba(255, 53, 106, 0.08);
                }
                
                .primary-button {
                    background: linear-gradient(135deg, #ff6b35 0%, #ff8f5a 100%) !important;
                    border: none !important;
                    border-radius: 24px !important;
                    font-weight: 600 !important;
                    transition: all 0.2s ease !important;
                    box-shadow: 0 4px 12px rgba(255, 53, 106, 0.3) !important;
                }
                
                .primary-button:hover {
                    transform: translateY(-1px) !important;
                    box-shadow: 0 6px 20px rgba(255, 53, 106, 0.4) !important;
                }
                
                .tag-pill {
                    background: #f8fafc;
                    border: 1px solid rgba(0, 0, 0, 0.06);
                    border-radius: 20px;
                    padding: 6px 14px;
                    color: #64748b;
                    font-size: 13px;
                    cursor: pointer;
                    transition: all 0.2s ease;
                }
                
                .tag-pill:hover {
                    background: #fff;
                    border-color: #ff6b35;
                    color: #ff6b35;
                    box-shadow: 0 2px 8px rgba(255, 107, 53, 0.15);
                }
                
                .mode-tab {
                    flex: 1;
                    text-align: center;
                    padding: 10px 0;
                    border-radius: 10px;
                    cursor: pointer;
                    font-weight: 600;
                    font-size: 14px;
                    transition: all 0.2s ease;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 6px;
                    color: #94a3b8;
                }
                
                .mode-tab.active {
                    background: #fff;
                    color: #ff6b35;
                    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
                }
                
                .mode-tab:not(.active):hover {
                    color: #64748b;
                    background: rgba(0, 0, 0, 0.02);
                }
                
                .section-title {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    margin-bottom: 12px;
                    color: #1e293b;
                    font-size: 14px;
                    font-weight: 600;
                }
                
                .section-title .icon {
                    width: 24px;
                    height: 24px;
                    border-radius: 6px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 12px;
                }
                
                .theme-dot {
                    width: 28px;
                    height: 28px;
                    border-radius: 50%;
                    cursor: pointer;
                    transition: all 0.2s ease;
                    border: 2px solid transparent;
                }
                
                .theme-dot:hover {
                    transform: scale(1.1);
                }
                
                .theme-dot.active {
                    box-shadow: 0 0 0 2px #fff, 0 0 0 4px currentColor;
                }
                
                .view-toggle {
                    display: flex;
                    gap: 2px;
                    background: #f1f5f9;
                    padding: 3px;
                    border-radius: 8px;
                }
                
                .view-toggle button {
                    border: none !important;
                    background: transparent !important;
                    border-radius: 6px !important;
                    padding: 5px 10px !important;
                    font-size: 13px !important;
                    color: #64748b !important;
                    transition: all 0.2s ease !important;
                }
                
                .view-toggle button.active {
                    background: #fff !important;
                    color: #1e293b !important;
                    box-shadow: 0 1px 3px rgba(0,0,0,0.08) !important;
                }
                
                .custom-scrollbar::-webkit-scrollbar { width: 5px; }
                .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
                .custom-scrollbar::-webkit-scrollbar-thumb { 
                    background: rgba(0,0,0,0.1); 
                    border-radius: 10px; 
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover { 
                    background: rgba(0,0,0,0.2); 
                }
                
                /* Markdown 样式 */
                .markdown-content {
                    font-size: 13px;
                    line-height: 1.6;
                }
                .markdown-content h1, .markdown-content h2, .markdown-content h3 {
                    margin: 12px 0 8px 0;
                    font-weight: 600;
                    color: #1e293b;
                }
                .markdown-content h1 { font-size: 16px; }
                .markdown-content h2 { font-size: 15px; }
                .markdown-content h3 { font-size: 14px; }
                .markdown-content p {
                    margin: 6px 0;
                }
                .markdown-content ul, .markdown-content ol {
                    margin: 6px 0;
                    padding-left: 20px;
                }
                .markdown-content li {
                    margin: 4px 0;
                }
                .markdown-content code {
                    background: rgba(0,0,0,0.06);
                    padding: 2px 6px;
                    border-radius: 4px;
                    font-size: 12px;
                    font-family: 'Monaco', 'Menlo', monospace;
                }
                .markdown-content pre {
                    background: #1e293b;
                    color: #e2e8f0;
                    padding: 12px;
                    border-radius: 8px;
                    overflow-x: auto;
                    margin: 8px 0;
                }
                .markdown-content pre code {
                    background: transparent;
                    padding: 0;
                    color: inherit;
                }
                .markdown-content strong {
                    font-weight: 600;
                    color: #0f172a;
                }
                .markdown-content blockquote {
                    border-left: 3px solid #10b981;
                    padding-left: 12px;
                    margin: 8px 0;
                    color: #64748b;
                }
                
                .input-card {
                    background: #fff;
                    border: 1px solid rgba(0, 0, 0, 0.08);
                    border-radius: 12px;
                    transition: all 0.2s ease;
                }
                
                .input-card:focus-within {
                    border-color: rgba(255, 53, 106, 0.3);
                    box-shadow: 0 0 0 3px rgba(255, 53, 106, 0.1);
                }
                `}
            </style>
            
            <div className="app-container">
                {/* Background decorations */}
                <div className="bg-decoration-1" />
                <div className="bg-decoration-2" />
                
                <div style={{ position: 'relative', zIndex: 1, height: '100vh', display: 'flex', flexDirection: 'column' }}>
                    {/* Header */}
                    <header style={{ 
                        padding: '12px 24px', 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'space-between',
                        borderBottom: '1px solid rgba(0,0,0,0.06)',
                        background: 'rgba(255,255,255,0.8)',
                        backdropFilter: 'blur(12px)'
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                            <div style={{ 
                                width: 40, 
                                height: 40, 
                                background: 'linear-gradient(135deg, #ff6b35 0%, #ff8f5a 100%)', 
                                borderRadius: 12, 
                                display: 'flex', 
                                alignItems: 'center', 
                                justifyContent: 'center', 
                                color: 'white', 
                                fontSize: 20,
                                boxShadow: '0 4px 12px rgba(255, 107, 53, 0.3)'
                            }}>
                                <RobotOutlined />
                            </div>
                            <div>
                                <div style={{ fontSize: 18, fontWeight: 700, color: '#1e293b', letterSpacing: '-0.3px' }}>
                                    Infographic<span style={{ color: '#ff6b35', marginLeft: 6 }}>AI</span>
                                </div>
                            </div>
                        </div>
                        
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            {apiKey ? (
                                <div style={{ 
                                    display: 'flex', 
                                    alignItems: 'center', 
                                    gap: 6, 
                                    padding: '6px 12px', 
                                    background: '#f0fdf4', 
                                    borderRadius: 20,
                                    border: '1px solid #bbf7d0'
                                }}>
                                    <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#22c55e' }} />
                                    <span style={{ fontSize: 12, color: '#16a34a', fontWeight: 500 }}>API 已配置</span>
                                </div>
                            ) : (
                                <div style={{ 
                                    display: 'flex', 
                                    alignItems: 'center', 
                                    gap: 6, 
                                    padding: '6px 12px', 
                                    background: '#fef2f2', 
                                    borderRadius: 20,
                                    border: '1px solid #fecaca'
                                }}>
                                    <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#ef4444' }} />
                                    <span style={{ fontSize: 12, color: '#dc2626', fontWeight: 500 }}>未配置 API</span>
                                </div>
                            )}
                        </div>
                    </header>
                    
                    {/* Main Content */}
                    <div style={{ flex: 1, display: 'flex', padding: '20px 24px', gap: 20, overflow: 'hidden' }}>
                        {/* Left Sidebar */}
                        <div className="sidebar-card custom-scrollbar" style={{ width: 360, padding: 20, overflowY: 'auto' }}>
                            {/* Mode Toggle - 2x2 Grid Layout */}
                            <div style={{ 
                                display: 'grid', 
                                gridTemplateColumns: '1fr 1fr',
                                gap: 8, 
                                marginBottom: 24,
                            }}>
                                <div 
                                    onClick={() => setSidebarMode('ai')}
                                    style={{
                                        padding: '14px 16px',
                                        borderRadius: 12,
                                        cursor: 'pointer',
                                        transition: 'all 0.2s ease',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 10,
                                        background: sidebarMode === 'ai' 
                                            ? 'linear-gradient(135deg, rgba(255, 53, 106, 0.1) 0%, rgba(255, 95, 138, 0.1) 100%)' 
                                            : '#f8fafc',
                                        border: sidebarMode === 'ai' 
                                            ? '1px solid rgba(255, 53, 106, 0.3)' 
                                            : '1px solid transparent',
                                        boxShadow: sidebarMode === 'ai' ? '0 2px 8px rgba(255, 53, 106, 0.15)' : 'none'
                                    }}
                                >
                                    <div style={{
                                        width: 32,
                                        height: 32,
                                        borderRadius: 8,
                                        background: sidebarMode === 'ai' 
                                            ? 'linear-gradient(135deg, #ff6b35 0%, #ff8f5a 100%)' 
                                            : '#e2e8f0',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        color: sidebarMode === 'ai' ? '#fff' : '#94a3b8',
                                        fontSize: 14
                                    }}>
                                        <RobotOutlined />
                                    </div>
                                    <div>
                                        <div style={{ 
                                            fontSize: 13, 
                                            fontWeight: 600, 
                                            color: sidebarMode === 'ai' ? '#ff6b35' : '#64748b' 
                                        }}>
                                            AI 生成
                                        </div>
                                        <div style={{ fontSize: 11, color: '#94a3b8' }}>智能创作</div>
                                    </div>
                                </div>
                                <div 
                                    onClick={() => setSidebarMode('composite')}
                                    style={{
                                        padding: '14px 16px',
                                        borderRadius: 12,
                                        cursor: 'pointer',
                                        transition: 'all 0.2s ease',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 10,
                                        background: sidebarMode === 'composite' 
                                            ? 'linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(139, 92, 246, 0.1) 100%)' 
                                            : '#f8fafc',
                                        border: sidebarMode === 'composite' 
                                            ? '1px solid rgba(99, 102, 241, 0.3)' 
                                            : '1px solid transparent',
                                        boxShadow: sidebarMode === 'composite' ? '0 2px 8px rgba(99, 102, 241, 0.15)' : 'none'
                                    }}
                                >
                                    <div style={{
                                        width: 32,
                                        height: 32,
                                        borderRadius: 8,
                                        background: sidebarMode === 'composite' 
                                            ? 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)' 
                                            : '#e2e8f0',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        color: sidebarMode === 'composite' ? '#fff' : '#94a3b8',
                                        fontSize: 14
                                    }}>
                                        <AppstoreOutlined />
                                    </div>
                                    <div>
                                        <div style={{ 
                                            fontSize: 13, 
                                            fontWeight: 600, 
                                            color: sidebarMode === 'composite' ? '#6366f1' : '#64748b' 
                                        }}>
                                            灵活组合
                                        </div>
                                        <div style={{ fontSize: 11, color: '#94a3b8' }}>自由搭配</div>
                                    </div>
                                </div>
                                <div 
                                    onClick={() => setSidebarMode('templates')}
                                    style={{
                                        padding: '14px 16px',
                                        borderRadius: 12,
                                        cursor: 'pointer',
                                        transition: 'all 0.2s ease',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 10,
                                        background: sidebarMode === 'templates' 
                                            ? 'linear-gradient(135deg, rgba(147, 51, 234, 0.1) 0%, rgba(192, 132, 252, 0.1) 100%)' 
                                            : '#f8fafc',
                                        border: sidebarMode === 'templates' 
                                            ? '1px solid rgba(147, 51, 234, 0.3)' 
                                            : '1px solid transparent',
                                        boxShadow: sidebarMode === 'templates' ? '0 2px 8px rgba(147, 51, 234, 0.15)' : 'none'
                                    }}
                                >
                                    <div style={{
                                        width: 32,
                                        height: 32,
                                        borderRadius: 8,
                                        background: sidebarMode === 'templates' 
                                            ? 'linear-gradient(135deg, #9333ea 0%, #c084fc 100%)' 
                                            : '#e2e8f0',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        color: sidebarMode === 'templates' ? '#fff' : '#94a3b8',
                                        fontSize: 14
                                    }}>
                                        <FormatPainterOutlined />
                                    </div>
                                    <div>
                                        <div style={{ 
                                            fontSize: 13, 
                                            fontWeight: 600, 
                                            color: sidebarMode === 'templates' ? '#9333ea' : '#64748b' 
                                        }}>
                                            模板库
                                        </div>
                                        <div style={{ fontSize: 11, color: '#94a3b8' }}>自定义模板</div>
                                    </div>
                                </div>
                                <div 
                                    onClick={() => setSidebarMode('settings')}
                                    style={{
                                        padding: '14px 16px',
                                        borderRadius: 12,
                                        cursor: 'pointer',
                                        transition: 'all 0.2s ease',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 10,
                                        background: sidebarMode === 'settings' 
                                            ? 'linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(52, 211, 153, 0.1) 100%)' 
                                            : '#f8fafc',
                                        border: sidebarMode === 'settings' 
                                            ? '1px solid rgba(16, 185, 129, 0.3)' 
                                            : '1px solid transparent',
                                        boxShadow: sidebarMode === 'settings' ? '0 2px 8px rgba(16, 185, 129, 0.15)' : 'none'
                                    }}
                                >
                                    <div style={{
                                        width: 32,
                                        height: 32,
                                        borderRadius: 8,
                                        background: sidebarMode === 'settings' 
                                            ? 'linear-gradient(135deg, #10b981 0%, #34d399 100%)' 
                                            : '#e2e8f0',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        color: sidebarMode === 'settings' ? '#fff' : '#94a3b8',
                                        fontSize: 14
                                    }}>
                                        <SettingOutlined />
                                    </div>
                                    <div>
                                        <div style={{ 
                                            fontSize: 13, 
                                            fontWeight: 600, 
                                            color: sidebarMode === 'settings' ? '#10b981' : '#64748b' 
                                        }}>
                                            设置
                                        </div>
                                        <div style={{ fontSize: 11, color: '#94a3b8' }}>API 配置</div>
                                    </div>
                                </div>
                            </div>

                            {sidebarMode === 'ai' ? (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                                    {/* Prompt Input */}
                                    <div>
                                        <div className="section-title">
                                            <div className="icon" style={{ background: 'rgba(255, 107, 53, 0.1)', color: '#ff6b35' }}>
                                                <BulbOutlined />
                                            </div>
                                            <span>创意描述</span>
                                        </div>
                                        <div className="input-card" style={{ padding: 4 }}>
                                            <TextArea
                                                rows={4}
                                                placeholder="描述你想画的信息图..."
                                                value={prompt}
                                                onChange={e => setPrompt(e.target.value)}
                                                style={{ 
                                                    background: 'transparent', 
                                                    border: 'none', 
                                                    color: '#1e293b',
                                                    resize: 'none',
                                                    fontSize: 14,
                                                    lineHeight: 1.6
                                                }}
                                            />
                                            <div style={{ 
                                                padding: '10px 12px 8px', 
                                                display: 'flex', 
                                                justifyContent: 'space-between', 
                                                alignItems: 'center' 
                                            }}>
                                                <span style={{ fontSize: 12, color: '#94a3b8' }}>
                                                    {prompt.length} 字
                                                </span>
                                                <Space>
                                                    <Tooltip title="使用多个模板生成同一内容进行对比">
                                                        <Button 
                                                            icon={<AppstoreOutlined />}
                                                            onClick={() => setBatchModalVisible(true)}
                                                            style={{ height: 36 }}
                                                        >
                                                            批量生成
                                                        </Button>
                                                    </Tooltip>
                                                    <Button 
                                                        type="primary" 
                                                        className="primary-button"
                                                        icon={loading ? null : <SendOutlined />} 
                                                        onClick={handleGenerate} 
                                                        loading={loading}
                                                        style={{ height: 36, paddingLeft: 20, paddingRight: 20 }}
                                                    >
                                                        {loading ? '生成中...' : '生成'}
                                                    </Button>
                                                </Space>
                                            </div>
                                        </div>
                                        
                                        {/* Quick prompts */}
                                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 12 }}>
                                            {QUICK_PROMPTS.map(p => (
                                                <div 
                                                    key={p} 
                                                    className="tag-pill"
                                                    onClick={() => setPrompt(`帮我画一个${p}`)}
                                                >
                                                    {p}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                    
                                    {/* Template Selection */}
                                    <div>
                                        <div className="section-title">
                                            <div className="icon" style={{ background: 'rgba(99, 102, 241, 0.1)', color: '#6366f1' }}>
                                                <FormatPainterOutlined />
                                            </div>
                                            <span>图表模板</span>
                                            <div style={{ marginLeft: 'auto', display: 'flex', gap: 12 }}>
                                                <span 
                                                    style={{ fontSize: 12, color: '#ff6b35', cursor: 'pointer' }}
                                                    onClick={() => setTemplateModalVisible(true)}
                                                >
                                                    <PlusOutlined /> 创建
                                                </span>
                                                <span 
                                                    style={{ fontSize: 12, color: '#64748b', cursor: 'pointer' }}
                                                    onClick={() => setGalleryVisible(true)}
                                                >
                                                    浏览画廊 →
                                                </span>
                                            </div>
                                        </div>
                                        <Select
                                            style={{ width: '100%' }}
                                            size="large"
                                            value={selectedTemplate}
                                            onChange={handleTemplateChange}
                                            options={[
                                                { label: '✨ 智能推荐', value: AUTO_TEMPLATE },
                                                ...(customTemplates.length > 0 ? [{ label: '── 我的模板 ──', value: '__divider_custom__', disabled: true }] : []),
                                                ...customTemplates.map(t => ({ label: `🎨 ${t.label}`, value: t.name })),
                                                { label: '── 内置模板 ──', value: '__divider_builtin__', disabled: true },
                                                ...templates.map(t => ({ label: getTemplateName(t), value: t }))
                                            ]}
                                            showSearch
                                            optionFilterProp="label"
                                        />
                                    </div>
                                    
                                    {/* Theme Selection */}
                                    <div>
                                        <div className="section-title">
                                            <div className="icon" style={{ background: 'rgba(147, 51, 234, 0.1)', color: '#9333ea' }}>
                                                <ExperimentOutlined />
                                            </div>
                                            <span>视觉主题</span>
                                            <span 
                                                style={{ marginLeft: 'auto', fontSize: 12, color: '#9333ea', cursor: 'pointer' }}
                                                onClick={() => setBrandColorModalVisible(true)}
                                            >
                                                <PlusOutlined /> 品牌配色
                                            </span>
                                        </div>
                                        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                                            {THEMES.map(t => (
                                                <Tooltip title={t.label} key={t.label}>
                                                    <div
                                                        className={`theme-dot ${selectedTheme === t.value ? 'active' : ''}`}
                                                        onClick={() => handleThemeChange(t.value)}
                                                        style={{ 
                                                            background: t.color,
                                                            borderColor: selectedTheme === t.value ? t.borderColor : 'transparent',
                                                            boxShadow: selectedTheme === t.value ? `0 0 0 2px #fff, 0 0 0 4px ${t.borderColor}` : 'none'
                                                        }}
                                                    />
                                                </Tooltip>
                                            ))}
                                            {/* 品牌配色 */}
                                            {brandColors.map(brand => {
                                                const brandThemeValue = `theme\n  palette ${brand.colors.join(' ')}`;
                                                return (
                                                <Tooltip title={brand.name} key={brand.name}>
                                                    <div
                                                        className={`theme-dot ${selectedTheme === brandThemeValue ? 'active' : ''}`}
                                                        onClick={() => handleThemeChange(brandThemeValue)}
                                                        style={{ 
                                                            background: `linear-gradient(135deg, ${brand.colors[0]} 0%, ${brand.colors[1] || brand.colors[0]} 100%)`,
                                                            borderColor: selectedTheme === brandThemeValue ? brand.primary : 'transparent',
                                                            boxShadow: selectedTheme === brandThemeValue ? `0 0 0 2px #fff, 0 0 0 4px ${brand.primary}` : 'none',
                                                            position: 'relative'
                                                        }}
                                                    >
                                                        <div style={{
                                                            position: 'absolute',
                                                            bottom: -2,
                                                            right: -2,
                                                            width: 10,
                                                            height: 10,
                                                            borderRadius: '50%',
                                                            background: '#9333ea',
                                                            border: '1px solid #fff',
                                                            fontSize: 6,
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            justifyContent: 'center',
                                                            color: '#fff'
                                                        }}>
                                                            ★
                                                        </div>
                                                    </div>
                                                </Tooltip>
                                            );
                                            })}
                                        </div>
                                    </div>

                                    {/* AI 优化建议 */}
                                    {dsl && (
                                        <div>
                                            <div className="section-title">
                                                <div className="icon" style={{ background: 'rgba(255, 107, 53, 0.1)', color: '#ff6b35' }}>
                                                    <BulbOutlined />
                                                </div>
                                                <span>AI 优化建议</span>
                                                <Button
                                                    type="text"
                                                    size="small"
                                                    icon={<ReloadOutlined />}
                                                    loading={optimizationLoading}
                                                    onClick={() => handleOptimize(!!apiKey)}
                                                    style={{ marginLeft: 'auto', color: '#ff6b35' }}
                                                >
                                                    {optimizationResult ? '重新分析' : '开始分析'}
                                                </Button>
                                            </div>

                                            {optimizationLoading ? (
                                                <div style={{ 
                                                    padding: 40, 
                                                    textAlign: 'center',
                                                    background: '#f8fafc',
                                                    borderRadius: 12
                                                }}>
                                                    <Spin />
                                                    <div style={{ marginTop: 12, fontSize: 13, color: '#999' }}>
                                                        AI 正在分析中...
                                                    </div>
                                                </div>
                                            ) : optimizationResult ? (
                                                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                                                    {/* 评分卡片 */}
                                                    <div style={{
                                                        padding: 16,
                                                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                                        borderRadius: 12,
                                                        color: '#fff',
                                                        textAlign: 'center'
                                                    }}>
                                                        <div style={{ fontSize: 12, opacity: 0.9, marginBottom: 8 }}>
                                                            设计评分
                                                        </div>
                                                        <div style={{ fontSize: 32, fontWeight: 700 }}>
                                                            {optimizationResult.score}
                                                        </div>
                                                        <div style={{ fontSize: 13, marginTop: 4 }}>
                                                            {optimizationResult.score >= 90 ? '优秀' :
                                                             optimizationResult.score >= 80 ? '良好' :
                                                             optimizationResult.score >= 60 ? '一般' : '需改进'}
                                                        </div>
                                                    </div>

                                                    {/* 总结 */}
                                                    {optimizationResult.summary && (
                                                        <Alert
                                                            message={optimizationResult.summary}
                                                            type="info"
                                                            showIcon
                                                            style={{ fontSize: 12 }}
                                                        />
                                                    )}

                                                    {/* 建议列表 */}
                                                    {optimizationResult.suggestions && optimizationResult.suggestions.length > 0 ? (
                                                        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                                                            {optimizationResult.suggestions.map((suggestion: any) => (
                                                                <div
                                                                    key={suggestion.id}
                                                                    style={{
                                                                        padding: 12,
                                                                        background: '#fff',
                                                                        border: '1px solid #e2e8f0',
                                                                        borderLeft: `3px solid ${
                                                                            suggestion.priority === 'high' ? '#ef4444' :
                                                                            suggestion.priority === 'medium' ? '#f59e0b' : '#3b82f6'
                                                                        }`,
                                                                        borderRadius: 8
                                                                    }}
                                                                >
                                                                    <div style={{ 
                                                                        fontSize: 13, 
                                                                        fontWeight: 600, 
                                                                        marginBottom: 6,
                                                                        display: 'flex',
                                                                        alignItems: 'center',
                                                                        gap: 6
                                                                    }}>
                                                                        <span>
                                                                            {suggestion.type === 'color' ? '🎨' :
                                                                             suggestion.type === 'layout' ? '📐' :
                                                                             suggestion.type === 'content' ? '📝' :
                                                                             suggestion.type === 'typography' ? '🔤' : '💡'}
                                                                        </span>
                                                                        {suggestion.title}
                                                                    </div>
                                                                    <div style={{ 
                                                                        fontSize: 12, 
                                                                        color: '#64748b', 
                                                                        marginBottom: 8,
                                                                        lineHeight: 1.5
                                                                    }}>
                                                                        {suggestion.description}
                                                                    </div>
                                                                    {suggestion.action && 
                                                                     (suggestion.action.type === 'apply-palette' || 
                                                                      suggestion.action.type === 'apply-template') && (
                                                                        <Button
                                                                            type="primary"
                                                                            size="small"
                                                                            icon={<ThunderboltOutlined />}
                                                                            onClick={() => handleApplySuggestion(suggestion)}
                                                                            style={{
                                                                                background: '#ff6b35',
                                                                                border: 'none',
                                                                                fontSize: 12
                                                                            }}
                                                                        >
                                                                            一键应用
                                                                        </Button>
                                                                    )}
                                                                </div>
                                                            ))}
                                                        </div>
                                                    ) : (
                                                        <div style={{ 
                                                            padding: 20, 
                                                            textAlign: 'center',
                                                            fontSize: 12,
                                                            color: '#999'
                                                        }}>
                                                            暂无优化建议，当前设计已经很棒了！
                                                        </div>
                                                    )}
                                                </div>
                                            ) : (
                                                <div style={{ 
                                                    padding: 30, 
                                                    textAlign: 'center',
                                                    background: '#f8fafc',
                                                    borderRadius: 12
                                                }}>
                                                    <BulbOutlined style={{ fontSize: 32, color: '#cbd5e1', marginBottom: 12 }} />
                                                    <div style={{ fontSize: 13, color: '#64748b' }}>
                                                        点击"开始分析"获取 AI 优化建议
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            ) : sidebarMode === 'composite' ? (
                                <CompositePanel onChange={handleCompositeChange} aiGeneratedData={aiGeneratedData} />
                            ) : sidebarMode === 'templates' ? (
                                /* 模板管理页签 */
                                <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                                    {/* 创建新模板 */}
                                    <div>
                                        <div className="section-title">
                                            <div className="icon" style={{ background: 'rgba(147, 51, 234, 0.1)', color: '#9333ea' }}>
                                                <PlusOutlined />
                                            </div>
                                            <span>创建自定义模板</span>
                                        </div>
                                        <div style={{ 
                                            padding: 16, 
                                            background: '#f8fafc', 
                                            borderRadius: 12,
                                            border: '1px solid rgba(0,0,0,0.06)'
                                        }}>
                                            <TextArea
                                                rows={3}
                                                placeholder="描述你想要的模板样式，例如：我想要一个时间轴模板，每个节点用卡片展示..."
                                                value={templatePrompt}
                                                onChange={e => setTemplatePrompt(e.target.value)}
                                                disabled={templateLoading}
                                                style={{ marginBottom: 12, borderRadius: 8 }}
                                            />
                                            <Button
                                                type="primary"
                                                icon={<RobotOutlined />}
                                                loading={templateLoading}
                                                onClick={handleGenerateTemplate}
                                                disabled={!apiKey}
                                                style={{ 
                                                    background: 'linear-gradient(135deg, #9333ea 0%, #7c3aed 100%)', 
                                                    border: 'none',
                                                    width: '100%'
                                                }}
                                            >
                                                {templateLoading ? '生成中...' : 'AI 生成模板'}
                                            </Button>
                                            {!apiKey && (
                                                <div style={{ fontSize: 12, color: '#ef4444', marginTop: 8, textAlign: 'center' }}>
                                                    请先在"设置"页签配置 API Key
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* 生成预览 */}
                                    {(templateLoading || generatedTemplateConfig) && (
                                        <div>
                                            <div className="section-title">
                                                <div className="icon" style={{ background: 'rgba(16, 185, 129, 0.1)', color: '#10b981' }}>
                                                    <EyeOutlined />
                                                </div>
                                                <span>生成结果</span>
                                            </div>
                                            
                                            {templateLoading && !generatedTemplateConfig && (
                                                <div style={{ 
                                                    padding: 16, 
                                                    background: '#1e1e1e', 
                                                    borderRadius: 12,
                                                    maxHeight: 150,
                                                    overflow: 'auto'
                                                }}>
                                                    <div style={{ fontSize: 12, color: '#888', marginBottom: 8 }}>
                                                        🤖 AI 正在生成模板配置...
                                                    </div>
                                                    <pre style={{ 
                                                        margin: 0, 
                                                        fontSize: 11, 
                                                        color: '#d4d4d4',
                                                        whiteSpace: 'pre-wrap',
                                                        wordBreak: 'break-all'
                                                    }}>
                                                        {templateGenerationOutput || '等待响应...'}
                                                    </pre>
                                                </div>
                                            )}

                                            {generatedTemplateConfig && (
                                                <div style={{ 
                                                    padding: 16, 
                                                    background: '#f0fdf4', 
                                                    borderRadius: 12,
                                                    border: '1px solid #bbf7d0'
                                                }}>
                                                    <div style={{ 
                                                        display: 'flex', 
                                                        alignItems: 'center', 
                                                        gap: 8, 
                                                        marginBottom: 12 
                                                    }}>
                                                        <span style={{ fontSize: 20 }}>🎨</span>
                                                        <div>
                                                            <div style={{ fontWeight: 600, color: '#166534' }}>
                                                                {generatedTemplateConfig.label}
                                                            </div>
                                                            <div style={{ fontSize: 11, color: '#64748b' }}>
                                                                ID: {generatedTemplateConfig.name}
                                                            </div>
                                                        </div>
                                                    </div>
                                                    
                                                    {templatePreviewData && (
                                                        <div style={{ 
                                                            background: '#fff', 
                                                            borderRadius: 8, 
                                                            height: 150,
                                                            marginBottom: 12,
                                                            overflow: 'hidden'
                                                        }}>
                                                            <Infographic options={templatePreviewData} />
                                                        </div>
                                                    )}
                                                    
                                                    <div style={{ display: 'flex', gap: 8 }}>
                                                        <Button 
                                                            size="small"
                                                            onClick={handleCancelTemplate}
                                                        >
                                                            重新生成
                                                        </Button>
                                                        <Button 
                                                            type="primary" 
                                                            size="small"
                                                            onClick={handleConfirmTemplate}
                                                            style={{ 
                                                                background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', 
                                                                border: 'none',
                                                                flex: 1
                                                            }}
                                                        >
                                                            ✓ 添加到模板库
                                                        </Button>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    )}

                                    {/* 我的模板列表 */}
                                    <div>
                                        <div className="section-title">
                                            <div className="icon" style={{ background: 'rgba(99, 102, 241, 0.1)', color: '#6366f1' }}>
                                                <AppstoreOutlined />
                                            </div>
                                            <span>我的模板 ({customTemplates.length})</span>
                                        </div>
                                        
                                        {customTemplates.length === 0 ? (
                                            <div style={{ 
                                                padding: 24, 
                                                textAlign: 'center', 
                                                color: '#94a3b8',
                                                background: '#f8fafc',
                                                borderRadius: 12,
                                                border: '1px dashed rgba(0,0,0,0.1)'
                                            }}>
                                                <div style={{ fontSize: 32, marginBottom: 8 }}>📦</div>
                                                <div style={{ fontSize: 13 }}>还没有自定义模板</div>
                                                <div style={{ fontSize: 12, marginTop: 4 }}>在上方描述你想要的模板样式</div>
                                            </div>
                                        ) : (
                                            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                                                {customTemplates.map(t => (
                                                    <div
                                                        key={t.name}
                                                        style={{
                                                            padding: '14px 16px',
                                                            borderRadius: 12,
                                                            background: selectedTemplate === t.name 
                                                                ? 'linear-gradient(135deg, rgba(99, 102, 241, 0.08) 0%, rgba(147, 51, 234, 0.08) 100%)' 
                                                                : '#f8fafc',
                                                            border: selectedTemplate === t.name 
                                                                ? '1px solid rgba(99, 102, 241, 0.3)' 
                                                                : '1px solid rgba(0,0,0,0.06)',
                                                            transition: 'all 0.2s',
                                                        }}
                                                    >
                                                        {/* 模板信息行 */}
                                                        <div style={{ 
                                                            display: 'flex', 
                                                            alignItems: 'center', 
                                                            gap: 10,
                                                            marginBottom: 10
                                                        }}>
                                                            <div style={{
                                                                width: 36,
                                                                height: 36,
                                                                borderRadius: 8,
                                                                background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                                                                display: 'flex',
                                                                alignItems: 'center',
                                                                justifyContent: 'center',
                                                                color: '#fff',
                                                                fontSize: 16
                                                            }}>
                                                                🎨
                                                            </div>
                                                            <div style={{ flex: 1 }}>
                                                                <div style={{ 
                                                                    fontWeight: 600, 
                                                                    fontSize: 14,
                                                                    color: selectedTemplate === t.name ? '#6366f1' : '#334155'
                                                                }}>
                                                                    {t.label}
                                                                </div>
                                                                <div style={{ fontSize: 11, color: '#94a3b8' }}>
                                                                    ID: {t.name}
                                                                </div>
                                                            </div>
                                                        </div>
                                                        
                                                        {/* 操作按钮行 */}
                                                        <div style={{ 
                                                            display: 'flex', 
                                                            gap: 6,
                                                            paddingTop: 10,
                                                            borderTop: '1px solid rgba(0,0,0,0.06)'
                                                        }}>
                                                            <Button
                                                                size="small"
                                                                type="primary"
                                                                icon={<CheckOutlined />}
                                                                onClick={() => {
                                                                    setSelectedTemplate(t.name);
                                                                    setSidebarMode('ai');
                                                                    message.success(`已选择模板: ${t.label}`);
                                                                }}
                                                                style={{ 
                                                                    flex: 1,
                                                                    background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                                                                    border: 'none',
                                                                    borderRadius: 6,
                                                                    fontSize: 12
                                                                }}
                                                            >
                                                                使用
                                                            </Button>
                                                            <Tooltip title="预览模板">
                                                                <Button
                                                                    size="small"
                                                                    icon={<EyeOutlined />}
                                                                    onClick={() => {
                                                                        setTemplatePreviewData({
                                                                            ...t.config,
                                                                            data: DEFAULT_SAMPLE_DATA,
                                                                            padding: 20,
                                                                        });
                                                                        setGeneratedTemplateConfig(t);
                                                                        message.info('预览模板效果');
                                                                    }}
                                                                    style={{ borderRadius: 6 }}
                                                                />
                                                            </Tooltip>
                                                            <Tooltip title="重命名">
                                                                <Button
                                                                    size="small"
                                                                    icon={<EditOutlined />}
                                                                    onClick={() => {
                                                                        const newLabel = window.prompt('请输入新的模板名称:', t.label);
                                                                        if (newLabel && newLabel.trim() && newLabel !== t.label) {
                                                                            const updated = customTemplates.map(item => 
                                                                                item.name === t.name 
                                                                                    ? { ...item, label: newLabel.trim() } 
                                                                                    : item
                                                                            );
                                                                            setCustomTemplates(updated);
                                                                            localStorage.setItem('custom_templates', JSON.stringify(updated));
                                                                            message.success('模板已重命名');
                                                                        }
                                                                    }}
                                                                    style={{ borderRadius: 6 }}
                                                                />
                                                            </Tooltip>
                                                            <Tooltip title="删除模板">
                                                                <Button
                                                                    size="small"
                                                                    danger
                                                                    icon={<CloseOutlined />}
                                                                    onClick={() => {
                                                                        modal.confirm({
                                                                            title: '确认删除',
                                                                            content: `确定要删除模板「${t.label}」吗？此操作不可恢复。`,
                                                                            okText: '删除',
                                                                            okType: 'danger',
                                                                            cancelText: '取消',
                                                                            onOk: () => {
                                                                                const updated = customTemplates.filter(item => item.name !== t.name);
                                                                                setCustomTemplates(updated);
                                                                                localStorage.setItem('custom_templates', JSON.stringify(updated));
                                                                                if (selectedTemplate === t.name) {
                                                                                    setSelectedTemplate(AUTO_TEMPLATE);
                                                                                }
                                                                                message.success('模板已删除');
                                                                            }
                                                                        });
                                                                    }}
                                                                    style={{ borderRadius: 6 }}
                                                                />
                                                            </Tooltip>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ) : (
                                /* 设置页签 */
                                <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                                    {/* API Key 设置 */}
                                    <div>
                                        <div className="section-title">
                                            <div className="icon" style={{ background: 'rgba(255, 107, 53, 0.1)', color: '#ff6b35' }}>
                                                <KeyOutlined />
                                            </div>
                                            <span>API 配置</span>
                                        </div>
                                        <div style={{ 
                                            padding: 16, 
                                            background: '#f8fafc', 
                                            borderRadius: 12,
                                            border: '1px solid rgba(0,0,0,0.06)'
                                        }}>
                                            <div style={{ marginBottom: 12 }}>
                                                <div style={{ fontSize: 13, fontWeight: 500, color: '#334155', marginBottom: 8 }}>
                                                    DeepSeek API Key
                                                </div>
                                                <Input.Password
                                                    prefix={<KeyOutlined style={{ color: '#94a3b8' }} />}
                                                    placeholder="sk-..."
                                                    value={apiKey}
                                                    onChange={e => {
                                                        setApiKey(e.target.value);
                                                        localStorage.setItem('deepseek_api_key', e.target.value);
                                                    }}
                                                    style={{ borderRadius: 8 }}
                                                />
                                            </div>
                                            <div style={{ 
                                                fontSize: 12, 
                                                color: '#64748b', 
                                                lineHeight: 1.6,
                                                padding: '10px 12px',
                                                background: 'rgba(0,0,0,0.02)',
                                                borderRadius: 8
                                            }}>
                                                <div style={{ marginBottom: 4 }}>
                                                    💡 获取 API Key：
                                                </div>
                                                <a 
                                                    href="https://platform.deepseek.com/api_keys" 
                                                    target="_blank" 
                                                    rel="noopener noreferrer"
                                                    style={{ color: '#ff6b35' }}
                                                >
                                                    https://platform.deepseek.com
                                                </a>
                                            </div>
                                        </div>
                                    </div>

                                    {/* 状态显示 */}
                                    <div>
                                        <div className="section-title">
                                            <div className="icon" style={{ background: 'rgba(16, 185, 129, 0.1)', color: '#10b981' }}>
                                                <CheckOutlined />
                                            </div>
                                            <span>当前状态</span>
                                        </div>
                                        <div style={{ 
                                            padding: 16, 
                                            background: apiKey ? '#f0fdf4' : '#fef2f2', 
                                            borderRadius: 12,
                                            border: apiKey ? '1px solid #bbf7d0' : '1px solid #fecaca'
                                        }}>
                                            <div style={{ 
                                                display: 'flex', 
                                                alignItems: 'center', 
                                                gap: 10 
                                            }}>
                                                <div style={{ 
                                                    width: 40, 
                                                    height: 40, 
                                                    borderRadius: '50%', 
                                                    background: apiKey ? '#dcfce7' : '#fee2e2',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    fontSize: 20
                                                }}>
                                                    {apiKey ? '✓' : '!'}
                                                </div>
                                                <div>
                                                    <div style={{ 
                                                        fontWeight: 600, 
                                                        color: apiKey ? '#166534' : '#dc2626',
                                                        fontSize: 14
                                                    }}>
                                                        {apiKey ? 'API 已配置' : 'API 未配置'}
                                                    </div>
                                                    <div style={{ fontSize: 12, color: '#64748b' }}>
                                                        {apiKey 
                                                            ? `Key: ${apiKey.substring(0, 8)}...${apiKey.substring(apiKey.length - 4)}`
                                                            : '请输入 DeepSeek API Key'
                                                        }
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* 关于 */}
                                    <div>
                                        <div className="section-title">
                                            <div className="icon" style={{ background: 'rgba(99, 102, 241, 0.1)', color: '#6366f1' }}>
                                                <BulbOutlined />
                                            </div>
                                            <span>关于</span>
                                        </div>
                                        <div style={{ 
                                            padding: 16, 
                                            background: '#f8fafc', 
                                            borderRadius: 12,
                                            border: '1px solid rgba(0,0,0,0.06)',
                                            fontSize: 13,
                                            color: '#64748b',
                                            lineHeight: 1.8
                                        }}>
                                            <div style={{ fontWeight: 600, color: '#334155', marginBottom: 8 }}>
                                                Infographic AI
                                            </div>
                                            <div>基于 AntV Infographic 的智能信息图生成工具</div>
                                            <div style={{ marginTop: 8 }}>
                                                • AI 生成：描述需求，自动生成信息图<br/>
                                                • 灵活组合：自由搭配结构和数据项<br/>
                                                • 自定义模板：创建专属模板样式<br/>
                                                • AI 助手：获取可视化建议
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                        
                        {/* Main Canvas Area */}
                        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 12 }}>
                            {/* Toolbar */}
                            <div className="canvas-card" style={{ padding: '10px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                    <span style={{ fontWeight: 600, color: '#1e293b', fontSize: 14 }}>画布预览</span>
                                    <div className="view-toggle">
                                        <Button 
                                            className={viewMode === 'preview' ? 'active' : ''} 
                                            icon={<EyeOutlined />} 
                                            size="small" 
                                            onClick={() => setViewMode('preview')}
                                        >
                                            预览
                                        </Button>
                                        <Button 
                                            className={viewMode === 'visual' ? 'active' : ''} 
                                            icon={<EditOutlined />} 
                                            size="small" 
                                            disabled={sidebarMode === 'composite'}
                                            onClick={() => setViewMode('visual')}
                                        >
                                            编辑
                                        </Button>
                                        <Button 
                                            className={viewMode === 'code' ? 'active' : ''} 
                                            icon={<CodeOutlined />} 
                                            size="small" 
                                            disabled={sidebarMode === 'composite'}
                                            onClick={() => setViewMode('code')}
                                        >
                                            代码
                                        </Button>
                                    </div>
                                </div>
                                <Space>
                                    <Tooltip title="选择 PNG 导出清晰度">
                                        <Select
                                            value={exportDpr}
                                            onChange={setExportDpr}
                                            style={{ width: 120, borderRadius: 8 }}
                                            disabled={!dsl}
                                        >
                                            <Select.Option value={1}>标准 (1x)</Select.Option>
                                            <Select.Option value={2}>高清 (2x)</Select.Option>
                                            <Select.Option value={3}>超清 (3x)</Select.Option>
                                            <Select.Option value={4}>极清 (4x)</Select.Option>
                                            <Select.Option value={5}>顶级 (5x)</Select.Option>
                                        </Select>
                                    </Tooltip>
                                    <Button
                                        icon={<DownloadOutlined />}
                                        onClick={() => handleDownload('png')}
                                        disabled={!dsl}
                                        style={{ borderRadius: 8 }}
                                    >
                                        PNG
                                    </Button>
                                    <Button
                                        icon={<DownloadOutlined />}
                                        onClick={() => handleDownload('svg')}
                                        disabled={!dsl}
                                        style={{ borderRadius: 8 }}
                                    >
                                        SVG
                                    </Button>
                                    <Tooltip title="复制为 EMF 兼容格式，可直接粘贴到 Office">
                                        <Button
                                            type="primary"
                                            icon={<CopyOutlined />}
                                            onClick={() => handleCopyForOffice()}
                                            disabled={!dsl}
                                            style={{ background: '#2563eb', borderRadius: 8, border: 'none' }}
                                        >
                                            复制到 Office
                                        </Button>
                                    </Tooltip>
                                </Space>
                            </div>
                            
                            {/* Canvas */}
                            <div className="canvas-card" style={{ flex: 1, overflow: 'hidden', display: 'flex' }}>
                                {viewMode !== 'preview' && (
                                    <div style={{ 
                                        width: '40%', 
                                        borderRight: '1px solid rgba(0,0,0,0.06)', 
                                        display: 'flex', 
                                        flexDirection: 'column',
                                        background: viewMode === 'code' ? '#1e1e1e' : '#fff'
                                    }}>
                                        {viewMode === 'visual' ? (
                                            <VisualEditor dsl={dsl} onChange={setDsl} />
                                        ) : (
                                            <Editor
                                                height="100%"
                                                defaultLanguage="plaintext"
                                                value={dsl}
                                                theme="vs-dark"
                                                onChange={(value) => setDsl(value || '')}
                                                options={{ 
                                                    minimap: { enabled: false }, 
                                                    fontSize: 14, 
                                                    wordWrap: 'on', 
                                                    padding: { top: 20, bottom: 20 }, 
                                                    scrollBeyondLastLine: false 
                                                }}
                                            />
                                        )}
                                    </div>
                                )}
                                
                                <div style={{ 
                                    flex: 1, 
                                    overflow: 'auto', 
                                    padding: 24, 
                                    display: 'flex', 
                                    justifyContent: 'center', 
                                    alignItems: 'center',
                                    background: '#f8fafc'
                                }}>
                                    {dsl ? (
                                        <div style={{ 
                                            width: '100%', 
                                            height: '100%', 
                                            maxWidth: 1200, 
                                            background: '#fff',
                                            borderRadius: 8,
                                            boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
                                            overflow: 'hidden'
                                        }}>
                                            <Infographic 
                                                options={(() => {
                                                    try {
                                                        const parsed = JSON.parse(dsl);
                                                        if (parsed && typeof parsed === 'object' && parsed.design) {
                                                            return parsed;
                                                        }
                                                    } catch (e) {}
                                                    return dsl.replace(/\\n/g, '\n');
                                                })()} 
                                                onError={(err) => {
                                                    if (err) {
                                                        console.error('Infographic render error:', err);
                                                        message.error(`渲染错误: ${err.message}`);
                                                    }
                                                }}
                                            />
                                        </div>
                                    ) : (
                                        <div style={{ textAlign: 'center' }}>
                                            <div style={{ 
                                                width: 100, 
                                                height: 100, 
                                                background: 'linear-gradient(135deg, rgba(255, 53, 106, 0.1) 0%, rgba(147, 51, 234, 0.1) 100%)', 
                                                borderRadius: '50%', 
                                                display: 'flex', 
                                                alignItems: 'center', 
                                                justifyContent: 'center', 
                                                margin: '0 auto 20px',
                                                fontSize: 40
                                            }}>
                                                🎨
                                            </div>
                                            <div style={{ fontSize: 18, fontWeight: 600, color: '#1e293b', marginBottom: 6 }}>
                                                开始创作
                                            </div>
                                            <div style={{ color: '#94a3b8', fontSize: 14 }}>
                                                在左侧输入描述或选择组合模式
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* AI Assistant Panel */}
                        {assistantOpen && (
                            <div 
                                className="sidebar-card custom-scrollbar" 
                                style={{ 
                                    width: assistantExpanded ? 420 : 340, 
                                    display: 'flex', 
                                    flexDirection: 'column',
                                    transition: 'width 0.2s ease'
                                }}
                            >
                                {/* Assistant Header */}
                                <div style={{ 
                                    padding: '16px 20px', 
                                    borderBottom: '1px solid rgba(0,0,0,0.06)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between'
                                }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                        <div style={{ 
                                            width: 36, 
                                            height: 36, 
                                            background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', 
                                            borderRadius: 10, 
                                            display: 'flex', 
                                            alignItems: 'center', 
                                            justifyContent: 'center', 
                                            color: 'white', 
                                            fontSize: 16 
                                        }}>
                                            <MessageOutlined />
                                        </div>
                                        <div>
                                            <div style={{ fontSize: 15, fontWeight: 600, color: '#1e293b' }}>AI 助手</div>
                                            <div style={{ fontSize: 11, color: '#94a3b8' }}>可视化顾问</div>
                                        </div>
                                    </div>
                                    <div style={{ display: 'flex', gap: 4 }}>
                                        <Button 
                                            type="text" 
                                            size="small" 
                                            icon={assistantExpanded ? <CompressOutlined /> : <ExpandOutlined />}
                                            onClick={() => setAssistantExpanded(!assistantExpanded)}
                                            style={{ color: '#94a3b8' }}
                                        />
                                        <Button 
                                            type="text" 
                                            size="small" 
                                            icon={<CloseOutlined />}
                                            onClick={() => setAssistantOpen(false)}
                                            style={{ color: '#94a3b8' }}
                                        />
                                    </div>
                                </div>

                                {/* Chat Messages */}
                                <div style={{ 
                                    flex: 1, 
                                    overflow: 'auto', 
                                    padding: 16,
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: 16
                                }}>
                                    {chatMessages.length === 0 ? (
                                        <div style={{ textAlign: 'center', padding: '40px 20px' }}>
                                            <div style={{ 
                                                width: 64, 
                                                height: 64, 
                                                background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(5, 150, 105, 0.1) 100%)', 
                                                borderRadius: '50%', 
                                                display: 'flex', 
                                                alignItems: 'center', 
                                                justifyContent: 'center', 
                                                margin: '0 auto 16px',
                                                fontSize: 28
                                            }}>
                                                💬
                                            </div>
                                            <div style={{ fontSize: 15, fontWeight: 600, color: '#1e293b', marginBottom: 6 }}>
                                                描述你的想法
                                            </div>
                                            <div style={{ color: '#94a3b8', fontSize: 13, marginBottom: 20 }}>
                                                告诉我你想做什么，我来帮你优化提示词
                                            </div>
                                            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                                                {QUICK_QUESTIONS.map(q => (
                                                    <div 
                                                        key={q}
                                                        onClick={() => {
                                                            setChatInput(q);
                                                        }}
                                                        style={{
                                                            padding: '10px 14px',
                                                            background: '#f8fafc',
                                                            border: '1px solid rgba(0,0,0,0.06)',
                                                            borderRadius: 10,
                                                            fontSize: 13,
                                                            color: '#475569',
                                                            cursor: 'pointer',
                                                            transition: 'all 0.2s',
                                                            textAlign: 'left'
                                                        }}
                                                        onMouseEnter={e => {
                                                            e.currentTarget.style.borderColor = '#10b981';
                                                            e.currentTarget.style.background = '#f0fdf4';
                                                        }}
                                                        onMouseLeave={e => {
                                                            e.currentTarget.style.borderColor = 'rgba(0,0,0,0.06)';
                                                            e.currentTarget.style.background = '#f8fafc';
                                                        }}
                                                    >
                                                        {q}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    ) : (
                                        chatMessages.map((msg, idx) => (
                                            <div 
                                                key={idx} 
                                                style={{ 
                                                    display: 'flex', 
                                                    gap: 10,
                                                    flexDirection: msg.role === 'user' ? 'row-reverse' : 'row'
                                                }}
                                            >
                                                <Avatar 
                                                    size={32}
                                                    style={{ 
                                                        background: msg.role === 'user' 
                                                            ? 'linear-gradient(135deg, #ff6b35 0%, #ff8f5a 100%)' 
                                                            : 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                                                        flexShrink: 0
                                                    }}
                                                    icon={msg.role === 'user' ? <UserOutlined /> : <RobotOutlined />}
                                                />
                                                <div style={{ maxWidth: '85%' }}>
                                                    <div style={{ 
                                                        padding: '10px 14px',
                                                        borderRadius: msg.role === 'user' ? '12px 12px 4px 12px' : '12px 12px 12px 4px',
                                                        background: msg.role === 'user' ? 'linear-gradient(135deg, #ff6b35 0%, #ff8f5a 100%)' : '#f1f5f9',
                                                        color: msg.role === 'user' ? '#fff' : '#334155',
                                                        fontSize: 13,
                                                        lineHeight: 1.6,
                                                    }}>
                                                        {msg.role === 'user' ? (
                                                            msg.content
                                                        ) : msg.content ? (
                                                            <div className="markdown-content">
                                                                <ReactMarkdown>
                                                                    {msg.content.replace(/【提示词】[\s\S]*?【\/提示词】/g, '').trim()}
                                                                </ReactMarkdown>
                                                            </div>
                                                        ) : (
                                                            chatLoading && idx === chatMessages.length - 1 ? '思考中...' : ''
                                                        )}
                                                    </div>
                                                    
                                                    {/* 提示词应用按钮 */}
                                                    {msg.role === 'assistant' && msg.promptSuggestion && (
                                                        <div style={{ 
                                                            marginTop: 8,
                                                            padding: '10px 12px',
                                                            background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(5, 150, 105, 0.1) 100%)',
                                                            borderRadius: 10,
                                                            border: '1px solid rgba(16, 185, 129, 0.2)'
                                                        }}>
                                                            <div style={{ 
                                                                fontSize: 11, 
                                                                color: '#059669', 
                                                                fontWeight: 600,
                                                                marginBottom: 6,
                                                                display: 'flex',
                                                                alignItems: 'center',
                                                                gap: 4
                                                            }}>
                                                                <BulbOutlined /> 优化后的提示词
                                                            </div>
                                                            <div style={{ 
                                                                fontSize: 12, 
                                                                color: '#334155',
                                                                lineHeight: 1.5,
                                                                marginBottom: 8,
                                                                padding: '8px 10px',
                                                                background: 'rgba(255,255,255,0.8)',
                                                                borderRadius: 6
                                                            }}>
                                                                {msg.promptSuggestion}
                                                            </div>
                                                            <Button
                                                                type="primary"
                                                                size="small"
                                                                icon={<ArrowRightOutlined />}
                                                                onClick={() => handleApplyPrompt(msg.promptSuggestion!)}
                                                                style={{ 
                                                                    background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                                                                    border: 'none',
                                                                    borderRadius: 6,
                                                                    fontSize: 12
                                                                }}
                                                            >
                                                                应用到创意描述
                                                            </Button>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>

                                {/* Chat Input */}
                                <div style={{ 
                                    padding: 16, 
                                    borderTop: '1px solid rgba(0,0,0,0.06)',
                                    background: 'rgba(255,255,255,0.5)'
                                }}>
                                    <div style={{ 
                                        display: 'flex', 
                                        gap: 8,
                                        background: '#f8fafc',
                                        borderRadius: 12,
                                        padding: 4,
                                        border: '1px solid rgba(0,0,0,0.06)'
                                    }}>
                                        <Input
                                            placeholder="描述你想要的信息图，我来帮你优化..."
                                            value={chatInput}
                                            onChange={e => setChatInput(e.target.value)}
                                            onPressEnter={handleAssistantChat}
                                            disabled={chatLoading}
                                            style={{ 
                                                border: 'none', 
                                                background: 'transparent',
                                                boxShadow: 'none'
                                            }}
                                        />
                                        <Button
                                            type="primary"
                                            icon={<SendOutlined />}
                                            onClick={handleAssistantChat}
                                            loading={chatLoading}
                                            style={{ 
                                                background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', 
                                                border: 'none',
                                                borderRadius: 8
                                            }}
                                        />
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* AI Assistant Toggle Button (when closed) */}
                        {!assistantOpen && (
                            <Tooltip title="AI 助手" placement="left">
                                <div
                                    onClick={() => setAssistantOpen(true)}
                                    style={{
                                        position: 'fixed',
                                        right: 24,
                                        bottom: 24,
                                        width: 56,
                                        height: 56,
                                        background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                                        borderRadius: '50%',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        color: 'white',
                                        fontSize: 24,
                                        cursor: 'pointer',
                                        boxShadow: '0 4px 20px rgba(16, 185, 129, 0.4)',
                                        transition: 'all 0.2s ease',
                                        zIndex: 100
                                    }}
                                    onMouseEnter={e => {
                                        e.currentTarget.style.transform = 'scale(1.1)';
                                        e.currentTarget.style.boxShadow = '0 6px 24px rgba(16, 185, 129, 0.5)';
                                    }}
                                    onMouseLeave={e => {
                                        e.currentTarget.style.transform = 'scale(1)';
                                        e.currentTarget.style.boxShadow = '0 4px 20px rgba(16, 185, 129, 0.4)';
                                    }}
                                >
                                    <MessageOutlined />
                                </div>
                            </Tooltip>
                        )}
                    </div>
                </div>
            </div>

            {/* Brand Color Modal */}
            <Modal
                title={
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 0' }}>
                        <div style={{ width: 32, height: 32, background: 'linear-gradient(135deg, #9333ea 0%, #7c3aed 100%)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <FormatPainterOutlined style={{ color: '#fff' }} />
                        </div>
                        <div>
                            <div style={{ fontSize: 18, fontWeight: 700 }}>品牌配色管理</div>
                            <div style={{ fontSize: 12, fontWeight: 400, color: '#64748b' }}>导入企业品牌色，让信息图更符合品牌调性</div>
                        </div>
                    </div>
                }
                open={brandColorModalVisible}
                onCancel={() => setBrandColorModalVisible(false)}
                footer={null}
                width={600}
            >
                <div style={{ padding: '16px 0' }}>
                    {/* 添加新品牌配色 */}
                    <div style={{ marginBottom: 24 }}>
                        <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 12, color: '#334155' }}>
                            添加品牌配色
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                            <Input
                                placeholder="品牌名称，如：阿里巴巴、腾讯、字节跳动"
                                value={newBrandName}
                                onChange={e => setNewBrandName(e.target.value)}
                                style={{ borderRadius: 8 }}
                            />
                            <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
                                <span style={{ fontSize: 13, color: '#64748b', minWidth: 60 }}>色板颜色：</span>
                                {newBrandColors.map((color, index) => (
                                    <ColorPicker
                                        key={index}
                                        value={color}
                                        onChange={(value) => {
                                            const newColors = [...newBrandColors];
                                            // 确保颜色是 #hex 格式
                                            newColors[index] = value.toHexString();
                                            setNewBrandColors(newColors);
                                        }}
                                        size="small"
                                    />
                                ))}
                                {newBrandColors.length < 6 && (
                                    <Button 
                                        size="small" 
                                        icon={<PlusOutlined />}
                                        onClick={() => setNewBrandColors([...newBrandColors, '#666666'])}
                                    />
                                )}
                                {newBrandColors.length > 2 && (
                                    <Button 
                                        size="small" 
                                        danger
                                        onClick={() => setNewBrandColors(newBrandColors.slice(0, -1))}
                                    >
                                        减少
                                    </Button>
                                )}
                            </div>
                            {/* 预览 */}
                            <div style={{ 
                                display: 'flex', 
                                gap: 4, 
                                padding: 12, 
                                background: '#f8fafc', 
                                borderRadius: 8,
                                alignItems: 'center'
                            }}>
                                <span style={{ fontSize: 12, color: '#94a3b8', marginRight: 8 }}>预览：</span>
                                {newBrandColors.map((color, index) => (
                                    <div 
                                        key={index}
                                        style={{ 
                                            width: 32, 
                                            height: 32, 
                                            background: color, 
                                            borderRadius: 6,
                                            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                                        }} 
                                    />
                                ))}
                            </div>
                            <Button
                                type="primary"
                                icon={<PlusOutlined />}
                                onClick={() => {
                                    if (!newBrandName.trim()) {
                                        message.warning('请输入品牌名称');
                                        return;
                                    }
                                    const newBrand = {
                                        name: newBrandName.trim(),
                                        colors: newBrandColors,
                                        primary: newBrandColors[0]
                                    };
                                    const updated = [...brandColors, newBrand];
                                    setBrandColors(updated);
                                    localStorage.setItem('brand_colors', JSON.stringify(updated));
                                    setNewBrandName('');
                                    setNewBrandColors(['#1677ff', '#4096ff', '#69b1ff', '#91caff']);
                                    message.success(`品牌配色 "${newBrand.name}" 已添加`);
                                }}
                                style={{ background: 'linear-gradient(135deg, #9333ea 0%, #7c3aed 100%)', border: 'none' }}
                            >
                                添加到配色库
                            </Button>
                        </div>
                    </div>
                    
                    {/* 已保存的品牌配色 */}
                    {brandColors.length > 0 && (
                        <div>
                            <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 12, color: '#334155' }}>
                                已保存的品牌配色
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                                {brandColors.map((brand, index) => (
                                    <div 
                                        key={brand.name + index}
                                        style={{ 
                                            padding: '12px 16px',
                                            background: '#f8fafc',
                                            borderRadius: 10,
                                            border: editingBrandIndex === index ? '1px solid #9333ea' : '1px solid #e2e8f0'
                                        }}
                                    >
                                        {editingBrandIndex === index ? (
                                            /* 编辑模式 */
                                            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                                                <Input
                                                    value={newBrandName}
                                                    onChange={e => setNewBrandName(e.target.value)}
                                                    placeholder="品牌名称"
                                                    size="small"
                                                    style={{ borderRadius: 6 }}
                                                />
                                                <div style={{ display: 'flex', gap: 6, alignItems: 'center', flexWrap: 'wrap' }}>
                                                    {newBrandColors.map((color, i) => (
                                                        <ColorPicker
                                                            key={i}
                                                            value={color}
                                                            onChange={(value) => {
                                                                const updated = [...newBrandColors];
                                                                updated[i] = value.toHexString();
                                                                setNewBrandColors(updated);
                                                            }}
                                                            size="small"
                                                        />
                                                    ))}
                                                    {newBrandColors.length < 6 && (
                                                        <Button 
                                                            size="small" 
                                                            icon={<PlusOutlined />}
                                                            onClick={() => setNewBrandColors([...newBrandColors, '#666666'])}
                                                        />
                                                    )}
                                                    {newBrandColors.length > 2 && (
                                                        <Button 
                                                            size="small" 
                                                            onClick={() => setNewBrandColors(newBrandColors.slice(0, -1))}
                                                        >
                                                            减少
                                                        </Button>
                                                    )}
                                                </div>
                                                <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
                                                    <Button 
                                                        size="small"
                                                        onClick={() => {
                                                            setEditingBrandIndex(null);
                                                            setNewBrandName('');
                                                            setNewBrandColors(['#1677ff', '#4096ff', '#69b1ff', '#91caff']);
                                                        }}
                                                    >
                                                        取消
                                                    </Button>
                                                    <Button 
                                                        size="small" 
                                                        type="primary"
                                                        onClick={() => {
                                                            if (!newBrandName.trim()) {
                                                                message.warning('请输入品牌名称');
                                                                return;
                                                            }
                                                            const updated = [...brandColors];
                                                            updated[index] = {
                                                                name: newBrandName.trim(),
                                                                colors: newBrandColors,
                                                                primary: newBrandColors[0]
                                                            };
                                                            setBrandColors(updated);
                                                            localStorage.setItem('brand_colors', JSON.stringify(updated));
                                                            setEditingBrandIndex(null);
                                                            setNewBrandName('');
                                                            setNewBrandColors(['#1677ff', '#4096ff', '#69b1ff', '#91caff']);
                                                            message.success('已保存修改');
                                                        }}
                                                        style={{ background: '#9333ea', border: 'none' }}
                                                    >
                                                        保存
                                                    </Button>
                                                </div>
                                            </div>
                                        ) : (
                                            /* 显示模式 */
                                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                                    <div style={{ display: 'flex', gap: 3 }}>
                                                        {brand.colors.map((color, i) => (
                                                            <div 
                                                                key={i}
                                                                style={{ 
                                                                    width: 20, 
                                                                    height: 20, 
                                                                    background: color, 
                                                                    borderRadius: 4 
                                                                }} 
                                                            />
                                                        ))}
                                                    </div>
                                                    <span style={{ fontWeight: 600, color: '#334155' }}>{brand.name}</span>
                                                </div>
                                                <Space>
                                                    <Button 
                                                        size="small"
                                                        icon={<EditOutlined />}
                                                        onClick={() => {
                                                            setEditingBrandIndex(index);
                                                            setNewBrandName(brand.name);
                                                            setNewBrandColors([...brand.colors]);
                                                        }}
                                                    >
                                                        编辑
                                                    </Button>
                                                    <Button 
                                                        size="small" 
                                                        type="primary"
                                                        onClick={() => {
                                                            handleThemeChange(`theme\n  palette ${brand.colors.join(' ')}`);
                                                            setBrandColorModalVisible(false);
                                                            message.success(`已应用 "${brand.name}" 配色`);
                                                        }}
                                                    >
                                                        应用
                                                    </Button>
                                                    <Button 
                                                        size="small" 
                                                        danger
                                                        onClick={() => {
                                                            modal.confirm({
                                                                title: '确认删除',
                                                                content: `确定要删除品牌配色 "${brand.name}" 吗？`,
                                                                onOk: () => {
                                                                    const updated = brandColors.filter((_, i) => i !== index);
                                                                    setBrandColors(updated);
                                                                    localStorage.setItem('brand_colors', JSON.stringify(updated));
                                                                    message.success('已删除');
                                                                }
                                                            });
                                                        }}
                                                    >
                                                        删除
                                                    </Button>
                                                </Space>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                    
                    {/* 常见品牌配色参考 */}
                    <div style={{ marginTop: 24, paddingTop: 16, borderTop: '1px solid #f0f0f0' }}>
                        <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 12, color: '#334155' }}>
                            常见品牌配色参考
                        </div>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                            {[
                                { name: '阿里橙', colors: ['#ff6a00', '#ff8533', '#ffa366', '#ffc299'] },
                                { name: '腾讯蓝', colors: ['#1677ff', '#4096ff', '#69b1ff', '#91caff'] },
                                { name: '字节跳动', colors: ['#fe2c55', '#ff5c7c', '#ff8ca3', '#ffbdca'] },
                                { name: '美团黄', colors: ['#ffc300', '#ffd033', '#ffdd66', '#ffeb99'] },
                                { name: '滴滴橙', colors: ['#ff8c00', '#ffa333', '#ffba66', '#ffd199'] },
                                { name: '网易红', colors: ['#d43c33', '#dd6360', '#e68a8d', '#efb1ba'] },
                            ].map(preset => (
                                <div
                                    key={preset.name}
                                    onClick={() => {
                                        setNewBrandName(preset.name);
                                        setNewBrandColors(preset.colors);
                                    }}
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 6,
                                        padding: '6px 12px',
                                        background: '#fff',
                                        borderRadius: 20,
                                        border: '1px solid #e2e8f0',
                                        cursor: 'pointer',
                                        transition: 'all 0.2s'
                                    }}
                                    onMouseEnter={e => {
                                        e.currentTarget.style.borderColor = preset.colors[0];
                                        e.currentTarget.style.boxShadow = `0 2px 8px ${preset.colors[0]}33`;
                                    }}
                                    onMouseLeave={e => {
                                        e.currentTarget.style.borderColor = '#e2e8f0';
                                        e.currentTarget.style.boxShadow = 'none';
                                    }}
                                >
                                    <div style={{ display: 'flex', gap: 2 }}>
                                        {preset.colors.slice(0, 3).map((c, i) => (
                                            <div key={i} style={{ width: 12, height: 12, background: c, borderRadius: 2 }} />
                                        ))}
                                    </div>
                                    <span style={{ fontSize: 12, color: '#64748b' }}>{preset.name}</span>
                                </div>
                            ))}
                        </div>
                        <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 8 }}>
                            点击快速填充，可修改后添加
                        </div>
                    </div>
                </div>
            </Modal>

            {/* Batch Generate Modal */}
            <Modal
                title={
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 0' }}>
                        <div style={{ width: 32, height: 32, background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <AppstoreOutlined style={{ color: '#fff' }} />
                        </div>
                        <div>
                            <div style={{ fontSize: 18, fontWeight: 700 }}>批量生成</div>
                            <div style={{ fontSize: 12, fontWeight: 400, color: '#64748b' }}>选择多个模板，生成同一内容的不同版本进行对比</div>
                        </div>
                    </div>
                }
                open={batchModalVisible}
                onCancel={() => {
                    setBatchModalVisible(false);
                    setBatchResults([]);
                }}
                footer={null}
                width={batchResults.length > 0 ? 1200 : 700}
            >
                <div style={{ padding: '16px 0' }}>
                    {batchResults.length === 0 ? (
                        <>
                            {/* 模板选择 */}
                            <div style={{ marginBottom: 16 }}>
                                <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 12, color: '#334155' }}>
                                    选择要对比的模板（最多选择 6 个）
                                </div>
                                <Checkbox.Group
                                    value={batchTemplates}
                                    onChange={(values) => setBatchTemplates(values.slice(0, 6) as string[])}
                                    style={{ width: '100%' }}
                                >
                                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
                                        {TEMPLATE_CATEGORIES.slice(0, 3).flatMap(cat => cat.templates.slice(0, 4)).map(t => (
                                            <Checkbox 
                                                key={t} 
                                                value={t}
                                                disabled={batchTemplates.length >= 6 && !batchTemplates.includes(t)}
                                                style={{
                                                    padding: '10px 12px',
                                                    background: batchTemplates.includes(t) ? '#f0f7ff' : '#f8fafc',
                                                    borderRadius: 8,
                                                    border: batchTemplates.includes(t) ? '1px solid #6366f1' : '1px solid transparent',
                                                    margin: 0
                                                }}
                                            >
                                                <span style={{ fontSize: 13 }}>{getTemplateName(t)}</span>
                                            </Checkbox>
                                        ))}
                                    </div>
                                </Checkbox.Group>
                            </div>
                            
                            {/* 快速选择 */}
                            <div style={{ marginBottom: 20 }}>
                                <Space wrap>
                                    <Button size="small" onClick={() => setBatchTemplates(['sequence-timeline-simple', 'sequence-snake-steps-simple', 'sequence-ascending-steps'])}>
                                        流程类
                                    </Button>
                                    <Button size="small" onClick={() => setBatchTemplates(['list-grid-badge-card', 'list-grid-candy-card-lite', 'list-row-horizontal-icon-arrow'])}>
                                        列表类
                                    </Button>
                                    <Button size="small" onClick={() => setBatchTemplates([])}>
                                        清空选择
                                    </Button>
                                </Space>
                            </div>
                            
                            {/* 当前描述预览 */}
                            <div style={{ 
                                padding: 12, 
                                background: '#f8fafc', 
                                borderRadius: 8, 
                                marginBottom: 16,
                                border: '1px solid #e2e8f0'
                            }}>
                                <div style={{ fontSize: 12, color: '#64748b', marginBottom: 4 }}>当前描述：</div>
                                <div style={{ fontSize: 14, color: '#334155' }}>{prompt || '（请先在左侧输入描述内容）'}</div>
                            </div>
                            
                            {/* 生成按钮 */}
                            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12 }}>
                                <Button onClick={() => setBatchModalVisible(false)}>取消</Button>
                                <Button
                                    type="primary"
                                    icon={<SendOutlined />}
                                    loading={batchLoading}
                                    onClick={handleBatchGenerate}
                                    disabled={!prompt || batchTemplates.length === 0}
                                    style={{ background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)', border: 'none' }}
                                >
                                    {batchLoading ? `生成中 (${batchResults.length}/${batchTemplates.length})...` : `生成 ${batchTemplates.length} 个版本`}
                                </Button>
                            </div>
                        </>
                    ) : (
                        <>
                            {/* 结果展示 */}
                            <div style={{ marginBottom: 16 }}>
                                <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 12, color: '#334155' }}>
                                    生成结果（点击选择要使用的版本）
                                </div>
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
                                    {batchResults.map((result, index) => (
                                        <Card
                                            key={result.template}
                                            hoverable
                                            size="small"
                                            onClick={() => handleApplyBatchResult(result.dsl)}
                                            style={{
                                                borderRadius: 12,
                                                overflow: 'hidden',
                                                border: '1px solid #e2e8f0'
                                            }}
                                            styles={{ body: { padding: 0 } }}
                                        >
                                            <div style={{ 
                                                height: 180, 
                                                background: '#f8fafc',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                overflow: 'hidden'
                                            }}>
                                                <div style={{ transform: 'scale(0.4)', transformOrigin: 'center center' }}>
                                                    <Infographic options={result.dsl} />
                                                </div>
                                            </div>
                                            <div style={{ padding: 12, borderTop: '1px solid #f0f0f0' }}>
                                                <div style={{ fontSize: 13, fontWeight: 600, color: '#334155' }}>
                                                    {getTemplateName(result.template)}
                                                </div>
                                                <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 2 }}>
                                                    点击应用此版本
                                                </div>
                                            </div>
                                        </Card>
                                    ))}
                                    {batchLoading && batchResults.length < batchTemplates.length && (
                                        <Card
                                            size="small"
                                            style={{
                                                borderRadius: 12,
                                                border: '1px dashed #d1d5db',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                minHeight: 220
                                            }}
                                            styles={{ body: { display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' } }}
                                        >
                                            <div style={{ textAlign: 'center', color: '#94a3b8' }}>
                                                <div style={{ fontSize: 24, marginBottom: 8 }}>⏳</div>
                                                <div>生成中...</div>
                                            </div>
                                        </Card>
                                    )}
                                </div>
                            </div>
                            
                            {/* 操作按钮 */}
                            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12 }}>
                                <Button onClick={() => setBatchResults([])}>重新选择模板</Button>
                                <Button onClick={() => {
                                    setBatchModalVisible(false);
                                    setBatchResults([]);
                                }}>关闭</Button>
                            </div>
                        </>
                    )}
                </div>
            </Modal>

            {/* Template Gallery Modal */}
            <Modal
                title={
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 0' }}>
                        <div style={{ width: 32, height: 32, background: '#e0f2fe', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <FormatPainterOutlined style={{ color: '#0369a1' }} />
                        </div>
                        <div>
                            <div style={{ fontSize: 18, fontWeight: 700 }}>图表模板画廊</div>
                            <div style={{ fontSize: 12, fontWeight: 400, color: '#64748b' }}>选择最适合您内容的表现形式</div>
                        </div>
                    </div>
                }
                open={galleryVisible}
                onCancel={() => setGalleryVisible(false)}
                footer={null}
                width={800}
                styles={{ body: { padding: '24px 0', maxHeight: '70vh', overflowY: 'auto' } }}
            >
                <div style={{ padding: '0 24px' }}>
                    <Tabs
                        defaultActiveKey="all"
                        items={[
                            { label: '全部', key: 'all' },
                            ...TEMPLATE_CATEGORIES.map(cat => ({ label: cat.name, key: cat.key }))
                        ].map(item => ({
                            ...item,
                            children: (
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 16, paddingTop: 16 }}>
                                    {(item.key === 'all'
                                        ? templates.slice(0, 40) // Limit "all" to first 40 for performance
                                        : TEMPLATE_CATEGORIES.find(c => c.key === item.key)?.templates || []
                                    ).map(t => (
                                        <Card
                                            key={t}
                                            hoverable
                                            size="small"
                                            onClick={() => {
                                                handleTemplateChange(t);
                                                setGalleryVisible(false);
                                            }}
                                            style={{
                                                border: selectedTemplate === t ? '2px solid #2563eb' : '1px solid #f1f5f9',
                                                background: selectedTemplate === t ? '#f0f7ff' : '#fff',
                                                borderRadius: 12,
                                                overflow: 'hidden'
                                            }}
                                            styles={{ body: { padding: 12, textAlign: 'center' } }}
                                        >
                                            <div style={{
                                                height: 80,
                                                background: '#f8fafc',
                                                borderRadius: 8,
                                                marginBottom: 8,
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                fontSize: 24
                                            }}>
                                                {t.startsWith('list') ? '📋' : t.startsWith('sequence') ? '⏳' : t.startsWith('compare') ? '⚖️' : t.startsWith('chart') ? '📊' : '📄'}
                                            </div>
                                            <div style={{ fontSize: 13, fontWeight: 600, color: '#334155', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                                {getTemplateName(t)}
                                            </div>
                                            <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 2, textTransform: 'uppercase' }}>
                                                {t.split('-')[0]}
                                            </div>
                                        </Card>
                                    ))}
                                </div>
                            )
                        }))}
                    />
                </div>
            </Modal>

            {/* Create Template Modal */}
            <Modal
                title={
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 0' }}>
                        <div style={{ width: 32, height: 32, background: 'linear-gradient(135deg, #ff6b35 0%, #ff8f5a 100%)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <PlusOutlined style={{ color: '#fff' }} />
                        </div>
                        <div>
                            <div style={{ fontSize: 18, fontWeight: 700 }}>创建自定义模板</div>
                            <div style={{ fontSize: 12, fontWeight: 400, color: '#64748b' }}>
                                {generatedTemplateConfig ? '预览模板效果，确认后添加到模板库' : '描述你想要的模板样式，AI 将为你生成'}
                            </div>
                        </div>
                    </div>
                }
                open={templateModalVisible}
                onCancel={() => {
                    setTemplateModalVisible(false);
                    handleCancelTemplate();
                }}
                footer={null}
                width={generatedTemplateConfig ? 900 : 600}
            >
                <div style={{ padding: '16px 0' }}>
                    {!generatedTemplateConfig ? (
                        <>
                            {/* 输入描述阶段 */}
                            <TextArea
                                rows={4}
                                placeholder="例如：我想要一个适合展示项目里程碑的时间轴模板，每个节点用卡片样式展示，带有图标和进度指示..."
                                value={templatePrompt}
                                onChange={e => setTemplatePrompt(e.target.value)}
                                style={{ marginBottom: 16, borderRadius: 12 }}
                                disabled={templateLoading}
                            />
                            
                            {/* 流式输出显示 */}
                            {(templateLoading || templateGenerationOutput) && (
                                <div style={{ 
                                    marginBottom: 16, 
                                    padding: 16, 
                                    background: '#1e1e1e', 
                                    borderRadius: 12,
                                    maxHeight: 200,
                                    overflow: 'auto'
                                }}>
                                    <div style={{ fontSize: 12, color: '#888', marginBottom: 8 }}>
                                        {templateLoading ? '🤖 AI 正在生成模板配置...' : '✅ 生成完成'}
                                    </div>
                                    <pre style={{ 
                                        margin: 0, 
                                        fontSize: 12, 
                                        color: '#d4d4d4',
                                        whiteSpace: 'pre-wrap',
                                        wordBreak: 'break-all'
                                    }}>
                                        {templateGenerationOutput || '等待响应...'}
                                    </pre>
                                </div>
                            )}
                            
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div style={{ fontSize: 13, color: '#64748b' }}>
                                    💡 提示：描述越详细，生成的模板越符合预期
                                </div>
                                <Button
                                    type="primary"
                                    icon={<RobotOutlined />}
                                    loading={templateLoading}
                                    onClick={handleGenerateTemplate}
                                    style={{ background: 'linear-gradient(135deg, #ff6b35 0%, #ff8f5a 100%)', border: 'none' }}
                                >
                                    {templateLoading ? '生成中...' : '生成模板'}
                                </Button>
                            </div>
                        </>
                    ) : (
                        <>
                            {/* 预览确认阶段 */}
                            <div style={{ display: 'flex', gap: 24 }}>
                                {/* 左侧：配置代码 */}
                                <div style={{ flex: 1 }}>
                                    <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 12, color: '#334155' }}>
                                        📝 模板配置
                                    </div>
                                    <div style={{ 
                                        background: '#1e1e1e', 
                                        borderRadius: 12, 
                                        padding: 16,
                                        height: 300,
                                        overflow: 'auto'
                                    }}>
                                        <pre style={{ 
                                            margin: 0, 
                                            fontSize: 12, 
                                            color: '#d4d4d4',
                                            whiteSpace: 'pre-wrap'
                                        }}>
                                            {JSON.stringify(generatedTemplateConfig, null, 2)}
                                        </pre>
                                    </div>
                                </div>
                                
                                {/* 右侧：预览 */}
                                <div style={{ flex: 1 }}>
                                    <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 12, color: '#334155' }}>
                                        👁️ 效果预览
                                    </div>
                                    <div style={{ 
                                        background: '#f8fafc', 
                                        borderRadius: 12, 
                                        height: 300,
                                        overflow: 'auto',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center'
                                    }}>
                                        {templatePreviewData && (
                                            <Infographic options={templatePreviewData} />
                                        )}
                                    </div>
                                </div>
                            </div>
                            
                            {/* 模板信息 */}
                            <div style={{ 
                                marginTop: 16, 
                                padding: 12, 
                                background: '#f0f9ff', 
                                borderRadius: 8,
                                display: 'flex',
                                alignItems: 'center',
                                gap: 12
                            }}>
                                <span style={{ fontSize: 20 }}>🎨</span>
                                <div>
                                    <div style={{ fontWeight: 600, color: '#0369a1' }}>{generatedTemplateConfig.label}</div>
                                    <div style={{ fontSize: 12, color: '#64748b' }}>模板ID: {generatedTemplateConfig.name}</div>
                                </div>
                            </div>
                            
                            {/* 操作按钮 */}
                            <div style={{ marginTop: 20, display: 'flex', justifyContent: 'flex-end', gap: 12 }}>
                                <Button onClick={handleCancelTemplate}>
                                    重新生成
                                </Button>
                                <Button 
                                    type="primary" 
                                    onClick={handleConfirmTemplate}
                                    style={{ background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', border: 'none' }}
                                >
                                    ✓ 添加到模板库
                                </Button>
                            </div>
                        </>
                    )}
                    
                    {/* 我的模板列表 */}
                    {customTemplates.length > 0 && !generatedTemplateConfig && (
                        <div style={{ marginTop: 24, paddingTop: 16, borderTop: '1px solid #f0f0f0' }}>
                            <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 12, color: '#334155' }}>我的模板</div>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                                {customTemplates.map(t => (
                                    <div
                                        key={t.name}
                                        onClick={() => {
                                            setSelectedTemplate(t.name);
                                            setTemplateModalVisible(false);
                                        }}
                                        style={{
                                            padding: '6px 14px',
                                            borderRadius: 20,
                                            fontSize: 13,
                                            background: selectedTemplate === t.name ? 'linear-gradient(135deg, #ff6b35 0%, #ff8f5a 100%)' : '#f1f5f9',
                                            color: selectedTemplate === t.name ? '#fff' : '#475569',
                                            cursor: 'pointer',
                                            fontWeight: 500,
                                            transition: 'all 0.2s'
                                        }}
                                    >
                                        🎨 {t.label}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </Modal>
        </>
    );
};

export const ProductApp = ({ initialPrompt, onGenerate }: { initialPrompt?: string; onGenerate?: () => boolean }) => {
    return (
        <ConfigProvider
            theme={{
                algorithm: theme.defaultAlgorithm,
                token: {
                    colorPrimary: '#ff6b35',
                    borderRadius: 16,
                    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
                },
            }}
        >
            <App>
                <ProductAppContent initialPrompt={initialPrompt} onGenerate={onGenerate} />
            </App>
        </ConfigProvider>
    );
};

export default ProductApp;
