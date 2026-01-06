import { jsx as _jsx, jsxs as _jsxs } from "@antv/infographic/jsx-runtime";
import { Ellipse, Group, Rect } from '../../jsx';
export const ItemIcon = (props) => {
    const { indexes, size = 32, ...restProps } = props;
    const finalProps = {
        fill: 'lightgray',
        width: size,
        height: size,
        ...restProps,
    };
    return (_jsx(Rect, { ...finalProps, "data-indexes": indexes, "data-element-type": "item-icon" }));
};
export const ItemIconCircle = (props) => {
    const { indexes, size = 50, fill, colorBg = 'white', ...restProps } = props;
    // 圆形内最大内切正方形的边长 = 圆的直径 / √2
    const innerSize = (size / Math.SQRT2) * 0.9;
    const offset = (size - innerSize) / 2;
    const iconProps = {
        fill: colorBg,
        ...restProps,
        x: offset,
        y: offset,
        width: innerSize,
        height: innerSize,
    };
    return (_jsxs(Group, { ...restProps, width: size, height: size, "data-element-type": "item-icon-group" /* ElementTypeEnum.ItemIconGroup */, children: [_jsx(Ellipse, { width: size, height: size, fill: fill, "data-element-type": "shape" }), _jsx(Rect, { ...iconProps, "data-indexes": indexes, "data-element-type": "item-icon" /* ElementTypeEnum.ItemIcon */ })] }));
};
