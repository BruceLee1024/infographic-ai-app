"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.renderShape = renderShape;
exports.renderStaticShape = renderStaticShape;
const utils_1 = require("../../utils");
const stylize_1 = require("../stylize");
const utils_2 = require("../utils");
function renderShape(svg, node, options) {
    const { themeConfig } = options;
    const attrs = Object.assign({}, themeConfig.base?.shape, themeConfig.shape);
    const parsedAttrs = (0, utils_2.parseDynamicAttributes)(node, attrs);
    (0, utils_1.setAttributes)(node, parsedAttrs);
    stylizeShape(node, svg, options);
    return node;
}
function renderStaticShape(node, options) {
    (0, utils_1.setAttributes)(node, options.themeConfig.base?.shape || {});
}
function stylizeShape(node, svg, options) {
    const config = options.themeConfig.stylize;
    if (!config)
        return node;
    const { type } = config;
    if (!type)
        return node;
    if (type === 'rough') {
        return (0, stylize_1.applyRoughStyle)(node, svg, config);
    }
    if (type === 'pattern') {
        return (0, stylize_1.applyPatternStyle)(node, svg, options);
    }
    if (type === 'linear-gradient' || type === 'radial-gradient') {
        const { fill, stroke } = (0, utils_1.getAttributes)(node, ['fill', 'stroke']);
        if ((0, utils_1.hasColor)(fill)) {
            (0, stylize_1.applyGradientStyle)(node, svg, config, 'fill');
        }
        if ((0, utils_1.hasColor)(stroke)) {
            (0, stylize_1.applyGradientStyle)(node, svg, config, 'stroke');
        }
        return;
    }
}
