"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LabelText = void 0;
const jsx_runtime_1 = require("@antv/infographic/jsx-runtime");
const components_1 = require("../components");
const utils_1 = require("../utils");
const registry_1 = require("./registry");
const LabelText = (props) => {
    const [{ indexes, datum, width = 120, themeColors, positionH = 'normal', positionV = 'center', formatter = (text) => text || '', usePaletteColor = false, lineNumber = 1, }, restProps,] = (0, utils_1.getItemProps)(props, [
        'width',
        'formatter',
        'usePaletteColor',
        'lineNumber',
    ]);
    const fontSize = 14;
    const lineHeight = 1.4;
    const height = restProps.height ??
        Math.ceil(lineNumber * lineHeight * fontSize);
    return ((0, jsx_runtime_1.jsx)(components_1.ItemLabel, { ...restProps, indexes: indexes, width: width, height: height, lineHeight: lineHeight, fill: usePaletteColor ? themeColors.colorPrimary : themeColors.colorText, fontSize: fontSize, fontWeight: "regular", alignHorizontal: positionH === 'flipped'
            ? 'right'
            : positionH === 'center'
                ? 'center'
                : 'left', alignVertical: positionV === 'flipped'
            ? 'bottom'
            : positionV === 'center'
                ? 'middle'
                : 'top', children: formatter(datum.label || datum.desc) }));
};
exports.LabelText = LabelText;
(0, registry_1.registerItem)('plain-text', {
    component: exports.LabelText,
    composites: ['label'],
});
