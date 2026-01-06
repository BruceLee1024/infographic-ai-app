"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ItemLabel = void 0;
const jsx_runtime_1 = require("@antv/infographic/jsx-runtime");
const jsx_1 = require("../../jsx");
const ItemLabel = ({ indexes, children, ...props }) => {
    const finalProps = {
        fontSize: 18,
        fontWeight: 'bold',
        fill: '#252525',
        lineHeight: 1.4,
        children,
        ...props,
    };
    finalProps.height ?? (finalProps.height = Math.ceil(+finalProps.lineHeight * +finalProps.fontSize));
    return ((0, jsx_runtime_1.jsx)(jsx_1.Text, { ...finalProps, "data-indexes": indexes, "data-element-type": "item-label" /* ElementTypeEnum.ItemLabel */ }));
};
exports.ItemLabel = ItemLabel;
