/**
 * 中文翻译映射
 * 用于将英文标识符翻译为中文显示名称
 */
// 模板名称翻译
export const TEMPLATE_NAMES = {
    // 序列/流程类
    'sequence-zigzag-steps-underline-text': '之字形步骤-下划线文本',
    'sequence-horizontal-zigzag-underline-text': '水平之字形-下划线文本',
    'sequence-circular-simple': '环形流程-简约',
    'sequence-filter-mesh-simple': '漏斗筛选-简约',
    'sequence-mountain-underline-text': '山峰图-下划线文本',
    'sequence-cylinders-3d-simple': '3D圆柱-简约',
    'sequence-ascending-steps': '递进阶梯',
    'sequence-color-snake-steps-horizontal-icon-line': '彩色蛇形步骤-图标线',
    'sequence-pyramid-simple': '金字塔-简约',
    'sequence-roadmap-vertical-simple': '垂直路线图-简约',
    'sequence-zigzag-pucks-3d-simple': '3D之字形圆盘-简约',
    'sequence-ascending-stairs-3d-underline-text': '3D递进阶梯-下划线文本',
    'sequence-steps-badge-card': '步骤流程-徽章卡片',
    'sequence-steps-simple': '步骤流程-简约',
    'sequence-timeline-done-list': '时间线-完成列表',
    'sequence-timeline-plain-text': '时间线-纯文本',
    'sequence-timeline-rounded-rect-node': '时间线-圆角矩形节点',
    'sequence-timeline-simple': '时间线-简约',
    'sequence-snake-steps-compact-card': '蛇形步骤-紧凑卡片',
    'sequence-snake-steps-pill-badge': '蛇形步骤-胶囊徽章',
    'sequence-snake-steps-simple': '蛇形步骤-简约',
    'sequence-circle-arrows-indexed-card': '环形箭头-索引卡片',
    'sequence-circular-underline-text': '环形流程-下划线文本',
    'sequence-filter-mesh-underline-text': '漏斗筛选-下划线文本',
    'sequence-mountain-simple': '山峰图-简约',
    'sequence-zigzag-pucks-3d-underline-text': '3D之字形圆盘-下划线文本',
    'sequence-zigzag-pucks-3d-indexed-card': '3D之字形圆盘-索引卡片',
    'sequence-ascending-stairs-3d-simple': '3D递进阶梯-简约',
    'sequence-horizontal-zigzag-simple-illus': '水平之字形-插图',
    'sequence-horizontal-zigzag-horizontal-icon-line': '水平之字形-图标线',
    'sequence-horizontal-zigzag-plain-text': '水平之字形-纯文本',
    'sequence-horizontal-zigzag-simple-horizontal-arrow': '水平之字形-水平箭头',
    'sequence-horizontal-zigzag-simple': '水平之字形-简约',
    'sequence-roadmap-vertical-plain-text': '垂直路线图-纯文本',
    'sequence-roadmap-vertical-badge-card': '垂直路线图-徽章卡片',
    'sequence-roadmap-vertical-pill-badge': '垂直路线图-胶囊徽章',
    'sequence-roadmap-vertical-quarter-circular': '垂直路线图-四分之一圆',
    'sequence-roadmap-vertical-quarter-simple-card': '垂直路线图-四分之一简约卡片',
    'sequence-roadmap-vertical-underline-text': '垂直路线图-下划线文本',
    'sequence-snake-steps-underline-text': '蛇形步骤-下划线文本',
    'sequence-color-snake-steps-simple-illus': '彩色蛇形步骤-插图',
    'sequence-snake-steps-simple-illus': '蛇形步骤-插图',
    'sequence-steps-simple-illus': '步骤流程-插图',
    'sequence-timeline-simple-illus': '时间线-插图',
    // 对比类
    'compare-binary-horizontal-simple-fold': '二元对比-折叠',
    'compare-hierarchy-left-right-circle-node-pill-badge': '层级对比-圆形节点胶囊徽章',
    'compare-swot': 'SWOT分析',
    'compare-binary-horizontal-badge-card-arrow': '二元对比-徽章卡片箭头',
    'compare-binary-horizontal-underline-text-vs': '二元对比-下划线文本VS',
    'compare-hierarchy-left-right-circle-node-plain-text': '层级对比-圆形节点纯文本',
    'compare-hierarchy-row-letter-card-compact-card': '行对比-字母卡片紧凑卡片',
    'compare-hierarchy-row-letter-card-rounded-rect-node': '行对比-字母卡片圆角矩形',
    'compare-binary-horizontal-underline-text-fold': '二元对比-下划线文本折叠',
    'compare-binary-horizontal-badge-card-fold': '二元对比-徽章卡片折叠',
    'compare-binary-horizontal-compact-card-fold': '二元对比-紧凑卡片折叠',
    'compare-binary-horizontal-simple-arrow': '二元对比-简约箭头',
    'compare-binary-horizontal-underline-text-arrow': '二元对比-下划线文本箭头',
    'compare-binary-horizontal-compact-card-arrow': '二元对比-紧凑卡片箭头',
    'compare-binary-horizontal-simple-vs': '二元对比-简约VS',
    'compare-binary-horizontal-badge-card-vs': '二元对比-徽章卡片VS',
    'compare-binary-horizontal-compact-card-vs': '二元对比-紧凑卡片VS',
    // 象限类
    'quadrant-quarter-simple-card': '象限图-简约卡片',
    'quadrant-quarter-circular': '象限图-圆形',
    'quadrant-simple-illus': '象限图-插图',
    // 列表类
    'list-grid-badge-card': '网格列表-徽章卡片',
    'list-grid-candy-card-lite': '网格列表-糖果卡片精简版',
    'list-grid-ribbon-card': '网格列表-丝带卡片',
    'list-row-horizontal-icon-arrow': '行列表-水平图标箭头',
    'list-pyramid-rounded-rect-node': '金字塔列表-圆角矩形节点',
    'list-pyramid-badge-card': '金字塔列表-徽章卡片',
    'list-pyramid-compact-card': '金字塔列表-紧凑卡片',
    'list-column-done-list': '列列表-完成列表',
    'list-column-vertical-icon-arrow': '列列表-垂直图标箭头',
    'list-grid-circular-progress': '网格列表-环形进度',
    'list-grid-compact-card': '网格列表-紧凑卡片',
    'list-grid-done-list': '网格列表-完成列表',
    'list-grid-horizontal-icon-arrow': '网格列表-水平图标箭头',
    'list-grid-progress-card': '网格列表-进度卡片',
    'list-grid-simple': '网格列表-简约',
    'list-row-circular-progress': '行列表-环形进度',
    'list-column-simple-vertical-arrow': '列列表-简约垂直箭头',
    'list-row-simple-horizontal-arrow': '行列表-简约水平箭头',
    'list-row-horizontal-icon-line': '行列表-水平图标线',
    'list-sector-simple': '扇形列表-简约',
    'list-sector-plain-text': '扇形列表-纯文本',
    'list-sector-half-plain-text': '半扇形列表-纯文本',
    'list-row-simple-illus': '行列表-插图',
    // 关系类
    'relation-circle-icon-badge': '关系圆-图标徽章',
    'relation-circle-circular-progress': '关系圆-环形进度',
    // 层级类
    'hierarchy-tree-tech-style-capsule-item': '层级树-科技风胶囊项',
    'hierarchy-tree-curved-line-rounded-rect-node': '层级树-曲线圆角矩形节点',
    'hierarchy-tree-tech-style-badge-card': '层级树-科技风徽章卡片',
    'hierarchy-mindmap-branch-gradient-circle-node': '思维导图-分支渐变圆形节点',
    'hierarchy-mindmap-level-gradient-circle-node': '思维导图-层级渐变圆形节点',
    'hierarchy-mindmap-branch-gradient-rounded-rect-node': '思维导图-分支渐变圆角矩形',
    'hierarchy-mindmap-level-gradient-rounded-rect-node': '思维导图-层级渐变圆角矩形',
    'hierarchy-mindmap-branch-gradient-compact-card': '思维导图-分支渐变紧凑卡片',
    'hierarchy-mindmap-level-gradient-compact-card': '思维导图-层级渐变紧凑卡片',
    // 图表类
    'chart-column-simple': '柱状图-简约',
    'chart-bar-plain-text': '条形图-纯文本',
    'chart-line-plain-text': '折线图-纯文本',
    'chart-pie-plain-text': '饼图-纯文本',
    'chart-pie-compact-card': '饼图-紧凑卡片',
    'chart-pie-donut-plain-text': '环形饼图-纯文本',
    'chart-pie-donut-pill-badge': '环形饼图-胶囊徽章',
    'chart-pie-pill-badge': '饼图-胶囊徽章',
    'chart-pie-donut-compact-card': '环形饼图-紧凑卡片',
    // 阶梯类
    'sequence-stairs-front-pill-badge': '正面阶梯-胶囊徽章',
    'sequence-stairs-front-compact-card': '正面阶梯-紧凑卡片',
    'sequence-stairs-front-simple': '正面阶梯-简约',
    'sequence-stairs-side-pill-badge': '侧面阶梯-胶囊徽章',
    'sequence-stairs-side-compact-card': '侧面阶梯-紧凑卡片',
    'sequence-stairs-side-simple': '侧面阶梯-简约',
    // 词云
    'word-cloud': '词云',
};
// 结构布局名称翻译
export const STRUCTURE_NAMES = {
    'list-grid': '网格列表',
    'list-row': '行列表',
    'list-column': '列列表',
    'list-pyramid': '金字塔列表',
    'list-sector': '扇形列表',
    'sequence-steps': '步骤流程',
    'sequence-timeline': '时间线',
    'sequence-snake-steps': '蛇形步骤',
    'sequence-color-snake-steps': '彩色蛇形步骤',
    'sequence-zigzag-steps': '之字形步骤',
    'sequence-horizontal-zigzag': '水平之字形',
    'sequence-roadmap-vertical': '垂直路线图',
    'sequence-ascending-steps': '递进阶梯',
    'sequence-circular': '环形流程',
    'sequence-filter-mesh': '漏斗筛选',
    'sequence-mountain': '山峰图',
    'sequence-pyramid': '金字塔',
    'sequence-cylinders-3d': '3D圆柱',
    'sequence-zigzag-pucks-3d': '3D之字形圆盘',
    'sequence-ascending-stairs-3d': '3D递进阶梯',
    'sequence-circle-arrows': '环形箭头',
    'sequence-stairs-front': '正面阶梯',
    'sequence-stairs-side': '侧面阶梯',
    'compare-binary-horizontal': '二元水平对比',
    'compare-hierarchy-left-right': '左右层级对比',
    'compare-hierarchy-row': '行层级对比',
    'quadrant': '象限图',
    'relation-circle': '关系圆',
    'relation-network': '关系网络',
    'hierarchy-tree': '层级树',
    'hierarchy-mindmap': '思维导图',
    'chart-column': '柱状图',
    'chart-bar': '条形图',
    'chart-line': '折线图',
    'chart-pie': '饼图',
    'word-cloud': '词云',
};
// 数据项名称翻译
export const ITEM_NAMES = {
    'simple': '简约',
    'simple-illus': '简约插图',
    'simple-horizontal-arrow': '简约水平箭头',
    'simple-vertical-arrow': '简约垂直箭头',
    'plain-text': '纯文本',
    'underline-text': '下划线文本',
    'badge-card': '徽章卡片',
    'compact-card': '紧凑卡片',
    'candy-card-lite': '糖果卡片精简版',
    'ribbon-card': '丝带卡片',
    'progress-card': '进度卡片',
    'indexed-card': '索引卡片',
    'l-corner-card': 'L角卡片',
    'letter-card': '字母卡片',
    'pill-badge': '胶囊徽章',
    'icon-badge': '图标徽章',
    'circular-progress': '环形进度',
    'done-list': '完成列表',
    'horizontal-icon-arrow': '水平图标箭头',
    'vertical-icon-arrow': '垂直图标箭头',
    'horizontal-icon-line': '水平图标线',
    'circle-node': '圆形节点',
    'rounded-rect-node': '圆角矩形节点',
    'quarter-simple-card': '四分之一简约卡片',
    'quarter-circular': '四分之一圆形',
    'capsule-item': '胶囊项',
};
// 主题名称翻译
export const THEME_NAMES = {
    'dark': '深色',
    'hand-drawn': '手绘风格',
    'tech-blue': '科技蓝',
    'gradient-purple': '渐变紫',
    'fresh-green': '清新绿',
    'warm-orange': '暖橙',
    'business-gray': '商务灰',
    'rose-pink': '玫瑰粉',
    'dark-tech': '深色科技',
    'dark-violet': '深色紫罗兰',
    'rainbow': '彩虹',
    'ocean': '海洋',
    'forest': '森林',
    'sunset': '日落',
};
/**
 * 获取模板的中文名称
 */
export function getTemplateDisplayName(templateId) {
    return TEMPLATE_NAMES[templateId] || templateId;
}
/**
 * 获取结构的中文名称
 */
export function getStructureDisplayName(structureId) {
    return STRUCTURE_NAMES[structureId] || structureId;
}
/**
 * 获取数据项的中文名称
 */
export function getItemDisplayName(itemId) {
    return ITEM_NAMES[itemId] || itemId;
}
/**
 * 获取主题的中文名称
 */
export function getThemeDisplayName(themeId) {
    return THEME_NAMES[themeId] || themeId;
}
