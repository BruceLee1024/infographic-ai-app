"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.renderSVG = renderSVG;
const fonts_1 = require("../fonts");
function renderSVG(svg, options) {
    const { themeConfig } = options;
    const { 'font-family': fontFamily = fonts_1.DEFAULT_FONT } = themeConfig.base?.text || {};
    svg.setAttribute('font-family', fontFamily);
}
