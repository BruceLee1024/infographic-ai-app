import { jsx as _jsx } from "@antv/infographic/jsx-runtime";
import { ItemLabel } from '../components';
import { getItemProps } from '../utils';
import { registerItem } from './registry';
export const LabelText = (props) => {
    const [{ indexes, datum, width = 120, themeColors, positionH = 'normal', positionV = 'center', formatter = (text) => text || '', usePaletteColor = false, lineNumber = 1, }, restProps,] = getItemProps(props, [
        'width',
        'formatter',
        'usePaletteColor',
        'lineNumber',
    ]);
    const fontSize = 14;
    const lineHeight = 1.4;
    const height = restProps.height ??
        Math.ceil(lineNumber * lineHeight * fontSize);
    return (_jsx(ItemLabel, { ...restProps, indexes: indexes, width: width, height: height, lineHeight: lineHeight, fill: usePaletteColor ? themeColors.colorPrimary : themeColors.colorText, fontSize: fontSize, fontWeight: "regular", alignHorizontal: positionH === 'flipped'
            ? 'right'
            : positionH === 'center'
                ? 'center'
                : 'left', alignVertical: positionV === 'flipped'
            ? 'bottom'
            : positionV === 'center'
                ? 'middle'
                : 'top', children: formatter(datum.label || datum.desc) }));
};
registerItem('plain-text', {
    component: LabelText,
    composites: ['label'],
});
