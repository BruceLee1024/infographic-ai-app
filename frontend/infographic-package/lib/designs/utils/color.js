"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getColorPrimary = getColorPrimary;
exports.getPaletteColors = getPaletteColors;
exports.getPaletteColor = getPaletteColor;
exports.getThemeColors = getThemeColors;
const renderer_1 = require("../../renderer");
const themes_1 = require("../../themes");
const utils_1 = require("../../utils");
const DEFAULT_COLOR = '#FF356A';
function getColorPrimary(options) {
    return options?.themeConfig?.colorPrimary || DEFAULT_COLOR;
}
function getPaletteColors(options) {
    const { themeConfig = {}, data } = options;
    const { colorPrimary, palette } = themeConfig;
    if (!palette || palette.length === 0) {
        return Array(data?.items?.length || 1).fill(colorPrimary || DEFAULT_COLOR);
    }
    return data.items.map((_, i) => (0, renderer_1.getPaletteColor)(palette, [i], data.items.length) || DEFAULT_COLOR);
}
function getPaletteColor(options, indexes) {
    return (0, renderer_1.getPaletteColor)(options?.themeConfig?.palette, indexes, options.data?.items?.length);
}
function getThemeColors(colors, options) {
    const { colorBg = options?.themeConfig?.colorBg || 'white', colorPrimary = options ? getColorPrimary(options) : 'black', } = colors;
    return (0, themes_1.generateThemeColors)({
        colorPrimary: colorPrimary,
        isDarkMode: (0, utils_1.isDarkColor)(colorBg),
        colorBg: colorBg,
    });
}
