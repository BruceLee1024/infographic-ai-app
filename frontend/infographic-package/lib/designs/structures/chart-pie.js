"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChartPie = void 0;
const jsx_runtime_1 = require("@antv/infographic/jsx-runtime");
const d3_1 = require("d3");
const jsx_1 = require("../../jsx");
const components_1 = require("../components");
const layouts_1 = require("../layouts");
const utils_1 = require("../utils");
const registry_1 = require("./registry");
const ChartPie = (props) => {
    const { Title, Item, data, radius = 140, innerRadius = 0, padding = 30, showPercentage = true, options, } = props;
    const { title, desc, items = [] } = data;
    const titleContent = Title ? (0, jsx_runtime_1.jsx)(Title, { title: title, desc: desc }) : null;
    const btnBounds = (0, jsx_1.getElementBounds)((0, jsx_runtime_1.jsx)(components_1.BtnAdd, { indexes: [0] }));
    // 获取 Item 的预估尺寸
    const sampleDatum = items[0] ?? { label: '', value: 0 };
    const itemBounds = (0, jsx_1.getElementBounds)((0, jsx_runtime_1.jsx)(Item, { indexes: [0], datum: sampleDatum, data: data, positionH: "center", positionV: "middle" }));
    const labelWidth = itemBounds.width || 140;
    const labelHeight = itemBounds.height || 32;
    // 基础半径设置
    const outerRadius = Math.max(radius, 60);
    // 连线水平拉伸的系数
    const extensionFactor = 1.35;
    const textGap = 8;
    // 计算画布中心和总尺寸
    // 水平方向：半径 * 系数 + 间距 + 标签宽度 + 边缘padding
    const maxHorizontalDistance = outerRadius * extensionFactor + textGap + labelWidth;
    const maxVerticalDistance = outerRadius;
    const centerX = padding + maxHorizontalDistance;
    const centerY = padding + maxVerticalDistance;
    const totalWidth = centerX * 2;
    const totalHeight = centerY * 2;
    // 空数据处理
    if (items.length === 0) {
        return ((0, jsx_runtime_1.jsxs)(layouts_1.FlexLayout, { id: "infographic-container", flexDirection: "column", justifyContent: "center", alignItems: "center", children: [titleContent, (0, jsx_runtime_1.jsx)(jsx_1.Group, { width: totalWidth, height: totalHeight, children: (0, jsx_runtime_1.jsx)(components_1.BtnsGroup, { children: (0, jsx_runtime_1.jsx)(components_1.BtnAdd, { indexes: [0], x: centerX - btnBounds.width / 2, y: centerY - btnBounds.height / 2 }) }) })] }));
    }
    const totalValue = items.reduce((sum, item) => sum + Math.max(item.value ?? 0, 0), 0);
    const colorPrimary = (0, utils_1.getColorPrimary)(options);
    const themeColors = (0, utils_1.getThemeColors)(options.themeConfig);
    // 1. 饼图生成器
    const pieGenerator = (0, d3_1.pie)()
        .value((item) => Math.max(item.value ?? 0, 0))
        .sort(null)
        .startAngle(0)
        .endAngle(Math.PI * 2);
    const arcData = pieGenerator(items);
    // 2. 弧形生成器
    const arcGenerator = (0, d3_1.arc)()
        .innerRadius(innerRadius)
        .outerRadius(outerRadius)
        .cornerRadius(2);
    // 连线起点
    const innerArc = (0, d3_1.arc)()
        .innerRadius(outerRadius)
        .outerRadius(outerRadius);
    // 连线拐点
    const outerArc = (0, d3_1.arc)()
        .innerRadius(outerRadius * 1.15)
        .outerRadius(outerRadius * 1.15);
    const percentTextRadius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const percentageArc = (0, d3_1.arc)()
        .innerRadius(percentTextRadius)
        .outerRadius(percentTextRadius);
    // 删除按钮位置
    const deleteButtonArc = (0, d3_1.arc)()
        .innerRadius(outerRadius * 0.85)
        .outerRadius(outerRadius * 0.85);
    const sliceElements = [];
    const percentElements = [];
    const connectorElements = [];
    const itemElements = [];
    const btnElements = [];
    // 3. 遍历生成图形
    arcData.forEach((arcDatum) => {
        const currentItem = arcDatum.data;
        const originalIndex = arcDatum.index;
        const color = (0, utils_1.getPaletteColor)(options, [originalIndex]) ||
            themeColors.colorPrimary ||
            colorPrimary;
        // --- 绘制扇形 ---
        const pathD = arcGenerator(arcDatum) || '';
        sliceElements.push((0, jsx_runtime_1.jsx)(jsx_1.Path, { d: pathD, fill: color, stroke: themeColors.colorBg, strokeWidth: 1, "data-element-type": "shape", width: outerRadius * 2, height: outerRadius * 2 }));
        // --- 计算关键点 ---
        const midAngle = arcDatum.startAngle + (arcDatum.endAngle - arcDatum.startAngle) / 2;
        const isRight = midAngle < Math.PI;
        // 1. 起点
        const p0 = innerArc.centroid(arcDatum);
        // 2. 拐点
        const p1 = outerArc.centroid(arcDatum);
        // 3. 终点 (水平拉伸)
        const labelXOffset = outerRadius * extensionFactor * (isRight ? 1 : -1);
        const p2 = [labelXOffset, p1[1]];
        // --- 绘制连线 ---
        connectorElements.push((0, jsx_runtime_1.jsx)(jsx_1.Path, { d: `M${centerX + p0[0]} ${centerY + p0[1]} L${centerX + p1[0]} ${centerY + p1[1]} L${centerX + p2[0]} ${centerY + p2[1]}`, stroke: colorPrimary, strokeOpacity: 0.45, strokeWidth: 2, fill: "none", "data-element-type": "shape" }));
        // --- 绘制 Item ---
        const itemX = centerX + p2[0] + (isRight ? textGap : -textGap - labelWidth);
        const itemY = centerY + p2[1] - labelHeight / 2;
        itemElements.push((0, jsx_runtime_1.jsx)(Item, { indexes: [originalIndex], datum: currentItem, data: data, x: itemX, y: itemY, width: labelWidth, height: labelHeight, positionH: isRight ? 'normal' : 'flipped', positionV: "middle", themeColors: (0, utils_1.getThemeColors)({ colorPrimary: color }, options) }));
        // --- 绘制百分比 ---
        if (showPercentage && totalValue > 0) {
            const percentPos = percentageArc.centroid(arcDatum);
            const value = Math.max(arcDatum.value, 0);
            const percentText = ((value * 100) / totalValue).toFixed(1);
            // 定义文本框尺寸
            const textWidth = 50;
            const textHeight = 20;
            percentElements.push((0, jsx_runtime_1.jsx)(jsx_1.Text, { x: centerX + percentPos[0] - textWidth / 2, y: centerY + percentPos[1] - textHeight / 2, width: textWidth, height: textHeight, alignHorizontal: "center", alignVertical: "middle", fontSize: 12, fontWeight: "bold", fill: "#ffffff", "data-value": value, "data-indexes": [originalIndex], "data-element-type": "item-value" /* ElementTypeEnum.ItemValue */, children: `${percentText}%` }));
        }
        // --- 绘制删除按钮 ---
        const deletePos = deleteButtonArc.centroid(arcDatum);
        btnElements.push((0, jsx_runtime_1.jsx)(components_1.BtnRemove, { indexes: [originalIndex], x: centerX + deletePos[0] - btnBounds.width / 2, y: centerY + deletePos[1] - btnBounds.height / 2 }));
    });
    // --- 绘制添加按钮 ---
    arcData.forEach((arcDatum, index) => {
        const nextIndex = (index + 1) % arcData.length;
        const currentEnd = arcDatum.endAngle;
        const nextStart = arcData[nextIndex].startAngle + (nextIndex === 0 ? Math.PI * 2 : 0);
        const midAngle = (currentEnd + nextStart) / 2;
        const btnR = outerRadius * 1.0;
        const btnX = Math.sin(midAngle) * btnR;
        const btnY = -Math.cos(midAngle) * btnR;
        btnElements.push((0, jsx_runtime_1.jsx)(components_1.BtnAdd, { indexes: [index + 1], x: centerX + btnX - btnBounds.width / 2, y: centerY + btnY - btnBounds.height / 2 }));
    });
    return ((0, jsx_runtime_1.jsxs)(layouts_1.FlexLayout, { id: "infographic-container", flexDirection: "column", justifyContent: "center", alignItems: "center", gap: 30, children: [titleContent, (0, jsx_runtime_1.jsxs)(jsx_1.Group, { width: totalWidth, height: totalHeight, children: [(0, jsx_runtime_1.jsx)(jsx_1.Group, { x: centerX, y: centerY, children: sliceElements }), (0, jsx_runtime_1.jsx)(jsx_1.Group, { children: connectorElements }), (0, jsx_runtime_1.jsx)(jsx_1.Group, { children: percentElements }), (0, jsx_runtime_1.jsx)(components_1.ItemsGroup, { children: itemElements }), (0, jsx_runtime_1.jsx)(components_1.BtnsGroup, { children: btnElements })] })] }));
};
exports.ChartPie = ChartPie;
(0, registry_1.registerStructure)('chart-pie', {
    component: exports.ChartPie,
    composites: ['title', 'item'],
});
