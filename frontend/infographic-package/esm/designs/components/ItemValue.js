import { jsx as _jsx } from "@antv/infographic/jsx-runtime";
import { Text } from '../../jsx';
export const ItemValue = ({ indexes, value, formatter = (v) => String(v), ...props }) => {
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
    return (_jsx(Text, { ...finalProps, "data-indexes": indexes, "data-element-type": "item-value" /* ElementTypeEnum.ItemValue */ }));
};
