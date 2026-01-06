"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.decodeFontFamily = decodeFontFamily;
exports.encodeFontFamily = encodeFontFamily;
exports.normalizeFontWeightName = normalizeFontWeightName;
function decodeFontFamily(font) {
    return font.trim().replace(/["']/g, '');
}
function encodeFontFamily(font) {
    if (font.startsWith('"'))
        return font;
    if (/^\d/.test(font))
        return `"${font}"`;
    if (font.includes(' '))
        return `"${font}"`;
    return font;
}
const FontWeightNameMap = {
    '100': 'thin',
    hairline: 'thin',
    thin: 'thin',
    '200': 'extralight',
    ultralight: 'extralight',
    extralight: 'extralight',
    '300': 'light',
    light: 'light',
    '400': 'regular',
    normal: 'regular',
    regular: 'regular',
    '500': 'medium',
    medium: 'medium',
    '600': 'semibold',
    demibold: 'semibold',
    semibold: 'semibold',
    '700': 'bold',
    bold: 'bold',
    '800': 'extrabold',
    ultrabold: 'extrabold',
    extrabold: 'extrabold',
    '900': 'black',
    heavy: 'black',
    black: 'black',
    '950': 'extrablack',
    ultrablack: 'extrablack',
    extrablack: 'extrablack',
};
function normalizeFontWeightName(fontWeight) {
    const key = String(fontWeight).toLowerCase();
    return FontWeightNameMap[key] || 'regular';
}
