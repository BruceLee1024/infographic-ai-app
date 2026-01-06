"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.renderIcon = renderIcon;
exports.renderItemIcon = renderItemIcon;
const resource_1 = require("../../resource");
const utils_1 = require("../../utils");
const utils_2 = require("../utils");
function renderIcon(svg, node, value, attrs = {}) {
    if (!value)
        return null;
    const parsedAttrs = (0, utils_2.parseDynamicAttributes)(node, attrs);
    return createIcon(svg, node, value, parsedAttrs);
}
function renderItemIcon(svg, node, value, options) {
    if (!value)
        return null;
    const { themeConfig } = options;
    const attrs = {
        ...themeConfig.item?.icon,
    };
    const parsedAttrs = (0, utils_2.parseDynamicAttributes)(node, attrs);
    return createIcon(svg, node, value, parsedAttrs);
}
function createIcon(svg, node, value, attrs) {
    // load async
    (0, resource_1.loadResource)(svg, 'icon', value);
    return (0, utils_1.createIconElement)(value, {
        ...(0, utils_1.getAttributes)(node, [
            'id',
            'x',
            'y',
            'width',
            'height',
            'fill',
            'stroke',
            'data-element-type',
            'data-indexes',
        ]),
        ...attrs,
    });
}
