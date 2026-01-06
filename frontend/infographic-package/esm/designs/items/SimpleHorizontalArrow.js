import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "@antv/infographic/jsx-runtime";
import { getElementBounds, Group, Polygon, Text, } from '../../jsx';
import { Gap, ItemDesc, ItemLabel } from '../components';
import { FlexLayout } from '../layouts';
import { AlignLayout } from '../layouts/Align';
import { getItemProps } from '../utils';
import { registerItem } from './registry';
export const SimpleHorizontalArrow = (props) => {
    const [{ indexes, datum, width = 140, themeColors, positionV = 'normal' }, restProps,] = getItemProps(props, ['width']);
    const isVNormal = positionV !== 'flipped';
    const textAlignVertical = isVNormal ? 'bottom' : 'top';
    const label = (_jsx(ItemLabel, { indexes: indexes, width: width, fill: themeColors.colorText, alignHorizontal: "center", alignVertical: textAlignVertical, fontSize: 14, children: datum.label }));
    const desc = (_jsx(ItemDesc, { indexes: indexes, width: width, fill: themeColors.colorTextSecondary, alignHorizontal: "center", alignVertical: textAlignVertical, children: datum.desc }));
    const arrowHeight = 30;
    const labelGap = 10;
    const labelBounds = getElementBounds(label);
    const descBounds = getElementBounds(desc);
    const textHeight = labelBounds.height + descBounds.height;
    const totalHeight = textHeight + labelGap + arrowHeight + labelGap + textHeight;
    return (_jsx(Group, { width: width, height: totalHeight, ...restProps, children: _jsxs(FlexLayout, { flexDirection: "column", alignItems: "center", children: [isVNormal ? (_jsxs(_Fragment, { children: [desc, label, _jsx(Gap, { height: labelGap })] })) : (_jsx(_Fragment, { children: _jsx(Gap, { height: textHeight + labelGap }) })), _jsxs(AlignLayout, { horizontal: "center", vertical: "middle", children: [_jsx(HorizontalArrow, { width: width, height: arrowHeight, fill: themeColors.colorPrimary }), _jsx(Text, { width: width, height: arrowHeight, alignHorizontal: "center", alignVertical: "middle", fill: themeColors.colorWhite, fontWeight: "bold", fontSize: 16, children: datum.time
                                ? datum.time
                                : String(indexes[0] + 1)
                                    .padStart(2, '0')
                                    .slice(-2) })] }), !isVNormal ? (_jsxs(_Fragment, { children: [_jsx(Gap, { height: labelGap }), label, desc] })) : (_jsx(_Fragment, { children: _jsx(Gap, { height: textHeight + labelGap }) }))] }) }));
};
const HorizontalArrow = (props) => {
    const { x = 0, y = 0, width = 100, height = 40, fill = '#FF356A', size = 10, } = props;
    return (_jsx(Polygon, { width: width, height: height, points: [
            { x, y },
            { x: x + width - size, y },
            { x: x + width, y: y + height / 2 },
            { x: x + width - size, y: y + height },
            { x, y: y + height },
            { x: x + size, y: y + height / 2 },
        ], fill: fill, "data-element-type": "shape" }));
};
registerItem('simple-horizontal-arrow', {
    component: SimpleHorizontalArrow,
    composites: ['label', 'desc', 'time'],
});
