import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "@antv/infographic/jsx-runtime";
import { Defs, Ellipse, getElementBounds, Group, Rect, } from '../../jsx';
import { ItemDesc, ItemIconCircle, ItemLabel } from '../components';
import { DropShadow } from '../defs';
import { getItemProps } from '../utils';
import { registerItem } from './registry';
export const CapsuleItem = (props) => {
    const [{ datum, indexes, width = 300, height = 80, gap = 12, positionH = 'normal', iconPadding = height / 10, themeColors, }, restProps,] = getItemProps(props, ['width', 'height', 'gap', 'iconPadding']);
    // Capsule border radius and icon size (icon with some padding inside)
    const borderRadius = height / 2;
    const iconSize = height - iconPadding * 2; // Icon diameter with padding
    // Calculate positions based on positionH and icon presence
    const isFlipped = positionH === 'flipped';
    const hasIcon = !!datum.icon;
    // Calculate text area dimensions
    const textWidth = hasIcon ? width - height - gap : width - gap * 2;
    const textX = hasIcon ? (isFlipped ? gap : height) : gap;
    const textAlign = hasIcon ? (isFlipped ? 'right' : 'left') : 'center';
    const labelProps = {
        indexes,
        width: textWidth,
        alignHorizontal: textAlign,
        alignVertical: 'middle',
        fontSize: 16,
        fontWeight: '600',
        fill: themeColors.colorWhite,
    };
    // Get label bounds to calculate layout
    const labelBounds = getElementBounds(_jsx(ItemLabel, { ...labelProps, children: datum.label }));
    const descProps = {
        indexes,
        width: textWidth,
        alignHorizontal: textAlign,
        alignVertical: 'top',
        fontSize: 12,
        lineNumber: 1,
        fill: themeColors.colorWhite,
    };
    // Get desc bounds to calculate layout
    const descBounds = getElementBounds(datum.desc ? _jsx(ItemDesc, { ...descProps, children: datum.desc }) : null);
    // Calculate vertical positions for text elements
    const textGap = 4;
    const totalTextHeight = labelBounds.height + textGap + descBounds.height;
    const textStartY = (height - totalTextHeight) / 2;
    const labelY = textStartY;
    const descY = labelY + labelBounds.height + textGap;
    // Calculate icon position (centered in the circle area with padding)
    const iconX = isFlipped ? width - height + iconPadding : iconPadding;
    const iconY = iconPadding;
    return (_jsxs(Group, { ...restProps, children: [_jsx(Defs, { children: _jsx(DropShadow, {}) }), _jsx(Rect, { x: 0, y: 0, width: width, height: height, fill: themeColors.colorPrimary, rx: borderRadius, ry: borderRadius, "data-element-type": "shape" }), datum.icon && (_jsxs(_Fragment, { children: [_jsx(Ellipse, { x: iconX, y: iconY, width: iconSize, height: iconSize, fillOpacity: 0.5, fill: themeColors.colorBg, filter: "url(#drop-shadow)" }), _jsx(ItemIconCircle, { indexes: indexes, x: iconX, y: iconY, size: iconSize, fill: themeColors.colorBg, colorBg: themeColors.colorPrimary })] })), datum.label && (_jsx(ItemLabel, { x: textX, y: labelY, ...labelProps, children: datum.label })), datum.desc && (_jsx(ItemDesc, { x: textX, y: descY, ...descProps, children: datum.desc }))] }));
};
registerItem('capsule-item', {
    component: CapsuleItem,
    composites: ['icon', 'label', 'desc'],
});
