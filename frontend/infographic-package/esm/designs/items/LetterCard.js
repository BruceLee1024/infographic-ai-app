import { jsx as _jsx, jsxs as _jsxs } from "@antv/infographic/jsx-runtime";
import tinycolor from 'tinycolor2';
import { Defs, Group, Rect } from '../../jsx';
import { ItemLabel } from '../components';
import { getItemProps } from '../utils';
import { registerItem } from './registry';
/**
 * 字母卡片组件
 * 用于显示大字母和标题
 * 支持渐变背景、斜纹和底部阴影效果
 */
export const LetterCard = (props) => {
    const [{ datum, indexes, width = 280, height = 160, showStripe = true, showGradient = true, showBottomShade = true, themeColors, }, restProps,] = getItemProps(props, [
        'width',
        'height',
        'showStripe',
        'showGradient',
        'showBottomShade',
    ]);
    const displayLetter = datum.label?.[0].toUpperCase();
    const displayTitle = datum.label?.toUpperCase();
    const baseColor = themeColors.colorPrimary;
    const base = tinycolor(baseColor);
    const stripeWidth = 4;
    const gapWidth = 6;
    const rotationDeg = 45;
    const bottomShadeHeight = 40;
    const gradientLighten = 12;
    const gradientDarken = 4;
    const gradStart = base.clone().darken(gradientDarken).toHexString();
    const gradEnd = base.clone().lighten(gradientLighten).toHexString();
    const lightStripe = 'rgba(255, 255, 255, 0)';
    const darkStripe = 'rgba(0, 0, 0, 0.03)';
    const uniqueId = `letter-card-${indexes.join('-')}`;
    const gradientId = `${uniqueId}-gradient`;
    const patternId = `${uniqueId}-pattern`;
    const shadeId = `${uniqueId}-shade`;
    const tile = stripeWidth + gapWidth;
    const ratio = 1;
    const letterFontSize = 96;
    const letterHeight = letterFontSize * ratio;
    const titleFontSize = 16;
    const titleHeight = titleFontSize * ratio;
    const textGap = height / 16;
    const textTotalHeight = letterHeight + textGap + titleHeight;
    const letterY = (height - textTotalHeight) / 2;
    const titleY = letterY + letterHeight + textGap;
    return (_jsxs(Group, { ...restProps, width: width, height: height, children: [_jsxs(Defs, { children: [showGradient && (_jsxs("linearGradient", { id: gradientId, x1: "0%", y1: "0%", x2: "100%", y2: "100%", children: [_jsx("stop", { offset: "0%", stopColor: gradStart }), _jsx("stop", { offset: "100%", stopColor: gradEnd })] })), showStripe && (_jsxs("pattern", { id: patternId, patternUnits: "userSpaceOnUse", width: tile, height: tile, patternTransform: `rotate(${rotationDeg})`, children: [_jsx("rect", { x: "0", y: "0", width: tile, height: tile, fill: lightStripe }), _jsx("rect", { x: "0", y: "0", width: stripeWidth, height: tile, fill: darkStripe })] })), showBottomShade && (_jsxs("linearGradient", { id: shadeId, x1: "0%", y1: "0%", x2: "0%", y2: "100%", children: [_jsx("stop", { offset: "0%", stopColor: "rgba(0,0,0,0)" }), _jsx("stop", { offset: "100%", stopColor: "rgba(0,0,0,0.16)" })] }))] }), _jsx(Rect, { x: 0, y: 0, width: width, height: height, fill: showGradient ? `url(#${gradientId})` : baseColor, rx: 0, ry: 0, "data-element-type": "shape" }), showStripe && (_jsx(Rect, { x: 0, y: 0, width: width, height: height, fill: `url(#${patternId})`, rx: 0, ry: 0 })), showBottomShade && (_jsx(Rect, { x: 0, y: height - bottomShadeHeight, width: width, height: bottomShadeHeight, fill: `url(#${shadeId})`, rx: 0, ry: 0 })), displayLetter && (_jsx(ItemLabel, { indexes: indexes, x: 0, y: letterY, width: width, fontSize: letterFontSize, fontWeight: "bold", fill: "#FFFFFF", alignHorizontal: "center", alignVertical: "top", lineHeight: 1, children: displayLetter })), _jsx(ItemLabel, { indexes: indexes, x: 0, y: titleY, width: width, fontSize: titleFontSize, fontWeight: "bold", fill: "#FFFFFF", alignHorizontal: "center", alignVertical: "middle", lineHeight: 1, children: displayTitle })] }));
};
registerItem('letter-card', {
    component: LetterCard,
    composites: ['label'],
});
