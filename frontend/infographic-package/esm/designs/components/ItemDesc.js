import { jsx as _jsx } from "@antv/infographic/jsx-runtime";
import { Text } from '../../jsx';
export const ItemDesc = ({ indexes, lineNumber = 2, children, ...props }) => {
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
    return (_jsx(Text, { ...finalProps, "data-indexes": indexes, "data-element-type": "item-desc" /* ElementTypeEnum.ItemDesc */ }));
};
