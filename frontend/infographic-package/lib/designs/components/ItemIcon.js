"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ItemIconCircle = exports.ItemIcon = void 0;
const jsx_runtime_1 = require("@antv/infographic/jsx-runtime");
const jsx_1 = require("../../jsx");
const ItemIcon = (props) => {
    const { indexes, size = 32, ...restProps } = props;
    const finalProps = {
        fill: 'lightgray',
        width: size,
        height: size,
        ...restProps,
    };
    return ((0, jsx_runtime_1.jsx)(jsx_1.Rect, { ...finalProps, "data-indexes": indexes, "data-element-type": "item-icon" }));
};
exports.ItemIcon = ItemIcon;
const ItemIconCircle = (props) => {
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
    return ((0, jsx_runtime_1.jsxs)(jsx_1.Group, { ...restProps, width: size, height: size, "data-element-type": "item-icon-group" /* ElementTypeEnum.ItemIconGroup */, children: [(0, jsx_runtime_1.jsx)(jsx_1.Ellipse, { width: size, height: size, fill: fill, "data-element-type": "shape" }), (0, jsx_runtime_1.jsx)(jsx_1.Rect, { ...iconProps, "data-indexes": indexes, "data-element-type": "item-icon" /* ElementTypeEnum.ItemIcon */ })] }));
};
exports.ItemIconCircle = ItemIconCircle;
