"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.renderText = renderText;
exports.renderItemText = renderItemText;
exports.renderStaticText = renderStaticText;
const lodash_es_1 = require("lodash-es");
const utils_1 = require("../../utils");
const utils_2 = require("../utils");
function renderText(node, text, attrs = {}) {
    if (!text)
        return null;
    const textElement = node;
    const staticAttrs = (0, utils_2.parseDynamicAttributes)(textElement, attrs);
    (0, utils_1.setAttributes)(textElement, staticAttrs);
    const renderedText = layoutText(text, textElement);
    for (const key in textElement.dataset) {
        renderedText.setAttribute(`data-${(0, lodash_es_1.kebabCase)(key)}`, textElement.dataset[key]);
    }
    return renderedText;
}
function renderItemText(type, node, options) {
    const textShape = node.nodeName === 'text' ? node : null;
    if (!textShape)
        return null;
    const { data, themeConfig } = options;
    const indexes = (0, utils_1.getItemIndexes)(node.dataset.indexes || '0');
    const text = String((0, lodash_es_1.get)((0, utils_1.getDatumByIndexes)(data, indexes), type, ''));
    const attrs = Object.assign({}, themeConfig.base?.text, themeConfig.item?.[type]);
    const staticAttrs = (0, utils_2.parseDynamicAttributes)(textShape, attrs);
    return renderText(node, node.textContent || text, staticAttrs);
}
function renderStaticText(text, options) {
    const attrs = options.themeConfig.base?.text || {};
    (0, utils_1.setAttributes)(text, attrs);
    if (attrs['font-family']) {
        text.setAttribute('font-family', (0, utils_1.encodeFontFamily)(attrs['font-family']));
    }
    text.style.userSelect = 'none';
    text.style.pointerEvents = 'none';
}
const norm = (value, defaultValue) => {
    if (!value)
        return defaultValue;
    return parseFloat(value);
};
function layoutText(textContent, text) {
    const x = norm(text.dataset.x, 0);
    const y = norm(text.dataset.y, 0);
    const width = norm(text.getAttribute('width'));
    const height = norm(text.getAttribute('height'));
    const attributes = getTextAttributes(text);
    Object.assign(attributes, {
        x,
        y,
        width,
        height,
        'data-horizontal-align': text.dataset.horizontalAlign || 'LEFT',
        'data-vertical-align': text.dataset.verticalAlign || 'TOP',
    });
    const element = (0, utils_1.createTextElement)(textContent, attributes);
    return element;
}
function getTextAttributes(textElement) {
    const attrs = (0, utils_1.getAttributes)(textElement, [
        'font-family',
        'font-size',
        'font-weight',
        'font-style',
        'font-variant',
        'letter-spacing',
        'line-height',
        'fill',
        'stroke',
        'stroke-width',
    ]);
    return attrs;
}
