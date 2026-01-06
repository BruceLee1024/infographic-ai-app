import { jsx as _jsx, jsxs as _jsxs } from "@antv/infographic/jsx-runtime";
import { getElementBounds } from '../../jsx';
import { Illus, ItemDesc, ItemLabel } from '../components';
import { FlexLayout } from '../layouts';
import { getItemProps } from '../utils';
import { registerItem } from './registry';
export const SimpleIllusItem = (props) => {
    const [{ indexes, datum, width = 180, illusSize = width, gap = 8, themeColors, usePaletteColor = false, }, restProps,] = getItemProps(props, ['width', 'illusSize', 'gap', 'usePaletteColor']);
    const { label, desc } = datum;
    const labelColor = usePaletteColor
        ? themeColors.colorPrimary
        : themeColors.colorText;
    const labelContent = (_jsx(ItemLabel, { indexes: indexes, width: width, alignHorizontal: "center", alignVertical: "middle", fill: labelColor, children: label }));
    const labelBounds = getElementBounds(labelContent);
    return (_jsxs(FlexLayout, { ...restProps, width: width, height: illusSize + gap + labelBounds.height + gap + 48, flexDirection: "column", alignItems: "center", justifyContent: "center", gap: gap, children: [_jsx(Illus, { indexes: indexes, width: illusSize, height: illusSize }), labelContent, _jsx(ItemDesc, { indexes: indexes, width: width, alignHorizontal: "center", alignVertical: "top", fill: themeColors.colorTextSecondary, lineNumber: 3, children: desc })] }));
};
registerItem('simple-illus', {
    component: SimpleIllusItem,
    composites: ['illus', 'label', 'desc'],
});
