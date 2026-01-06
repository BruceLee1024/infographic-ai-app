"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ItemDesc = void 0;
const jsx_runtime_1 = require("@antv/infographic/jsx-runtime");
const jsx_1 = require("../../jsx");
const ItemDesc = ({ indexes, lineNumber = 2, children, ...props }) => {
    if (!children)
        return null;
    const finalProps = {
        fontSize: 14,
        fill: '#666',
        wordWrap: true,
        lineHeight: 1.4,
        children,
        ...props,
    };
    finalProps.height ?? (finalProps.height = Math.ceil(lineNumber * +finalProps.lineHeight * +finalProps.fontSize));
    return ((0, jsx_runtime_1.jsx)(jsx_1.Text, { ...finalProps, "data-indexes": indexes, "data-element-type": "item-desc" /* ElementTypeEnum.ItemDesc */ }));
};
exports.ItemDesc = ItemDesc;
