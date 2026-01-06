import { jsx as _jsx } from "@antv/infographic/jsx-runtime";
import { Text } from '../../jsx';
export const ItemLabel = ({ indexes, children, ...props }) => {
    const finalProps = {
        fontSize: 18,
        fontWeight: 'bold',
        fill: '#252525',
        lineHeight: 1.4,
        children,
        ...props,
    };
    finalProps.height ?? (finalProps.height = Math.ceil(+finalProps.lineHeight * +finalProps.fontSize));
    return (_jsx(Text, { ...finalProps, "data-indexes": indexes, "data-element-type": "item-label" /* ElementTypeEnum.ItemLabel */ }));
};
