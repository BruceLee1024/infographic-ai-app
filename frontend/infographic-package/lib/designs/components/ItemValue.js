"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ItemValue = void 0;
const jsx_runtime_1 = require("@antv/infographic/jsx-runtime");
const jsx_1 = require("../../jsx");
const ItemValue = ({ indexes, value, formatter = (v) => String(v), ...props }) => {
    const finalProps = {
        fontSize: 14,
        fill: '#666',
        wordWrap: true,
        lineHeight: 1.4,
        children: formatter(value),
        'data-value': value,
        ...props,
    };
    finalProps.height ?? (finalProps.height = Math.ceil(+finalProps.lineHeight * +finalProps.fontSize));
    return ((0, jsx_runtime_1.jsx)(jsx_1.Text, { ...finalProps, "data-indexes": indexes, "data-element-type": "item-value" /* ElementTypeEnum.ItemValue */ }));
};
exports.ItemValue = ItemValue;
