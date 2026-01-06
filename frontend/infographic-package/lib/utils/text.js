"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTextEntity = getTextEntity;
exports.createTextElement = createTextElement;
exports.updateTextElement = updateTextElement;
exports.getTextStyle = getTextStyle;
exports.getTextContent = getTextContent;
exports.setTextContent = setTextContent;
exports.getTextElementProps = getTextElementProps;
const camelCase_1 = __importDefault(require("lodash-es/camelCase"));
const font_1 = require("./font");
const recognizer_1 = require("./recognizer");
const svg_1 = require("./svg");
function getTextEntity(text) {
    if (!(0, recognizer_1.isForeignObjectElement)(text))
        return null;
    return text.querySelector('span');
}
function createTextElement(textContent, attributes) {
    const entity = document.createElement('span');
    const foreignObject = (0, svg_1.createElement)('foreignObject', { overflow: 'visible' });
    foreignObject.appendChild(entity);
    updateTextElement(foreignObject, { textContent, attributes });
    return foreignObject;
}
function updateTextElement(text, props) {
    const { textContent, attributes } = props;
    if (textContent !== undefined) {
        setTextContent(text, textContent);
    }
    if (!attributes)
        return;
    const entity = getTextEntity(text);
    let { width, height } = attributes;
    const textAttrs = {};
    if (entity) {
        Object.assign(entity.style, getTextStyle(attributes));
        if (!width || !height) {
            const rect = measureTextSpan(entity);
            if (!width && !text.hasAttribute('width'))
                width = String(rect.width);
            if (!height && !text.hasAttribute('height'))
                height = String(rect.height);
        }
        // 以下属性需要完成包围盒测量后再设置
        const { 'data-horizontal-align': horizontal, 'data-vertical-align': vertical, } = attributes;
        Object.assign(entity.style, alignToFlex(horizontal, vertical));
    }
    const { id, x, y } = attributes;
    if (id)
        textAttrs.id = id;
    if (x !== undefined)
        textAttrs.x = String(x);
    if (y !== undefined)
        textAttrs.y = String(y);
    if (width !== undefined)
        textAttrs.width = String(width);
    if (height !== undefined)
        textAttrs.height = String(height);
    (0, svg_1.setAttributes)(text, textAttrs);
}
function alignToFlex(horizontal, vertical) {
    const style = {
        width: '100%',
        height: '100%',
        display: 'flex',
        flexWrap: 'wrap',
        wordBreak: 'break-word',
        whiteSpace: 'pre-wrap',
    };
    switch (horizontal) {
        case 'LEFT':
            style.textAlign = 'left';
            style.justifyContent = 'flex-start';
            break;
        case 'CENTER':
            style.textAlign = 'center';
            style.justifyContent = 'center';
            break;
        case 'RIGHT':
            style.textAlign = 'right';
            style.justifyContent = 'flex-end';
            break;
    }
    switch (vertical) {
        case 'TOP':
            style.alignContent = 'flex-start';
            style.alignItems = 'flex-start';
            break;
        case 'MIDDLE':
            style.alignContent = 'center';
            style.alignItems = 'center';
            break;
        case 'BOTTOM':
            style.alignContent = 'flex-end';
            style.alignItems = 'flex-end';
            break;
    }
    return style;
}
function getTextStyle(attributes) {
    const { x, y, width, height, ['data-horizontal-align']: horizontalAlign, // omit
    ['data-vertical-align']: verticalAlign, // omit
    ['font-size']: fontSize, ['letter-spacing']: letterSpacing, ['line-height']: lineHeight, fill, ['stroke-width']: strokeWidth, ['text-anchor']: textAnchor, // omit
    ['dominant-baseline']: dominantBaseline, // omit
    ['font-family']: fontFamily, ...restAttrs } = attributes;
    const style = {
        overflow: 'visible',
        // userSelect: 'none',
    };
    if (fill)
        style.color = fill;
    Object.entries(restAttrs).forEach(([key, value]) => {
        style[(0, camelCase_1.default)(key)] = value;
    });
    if (fontSize)
        style.fontSize = `${fontSize}px`;
    if (lineHeight)
        style.lineHeight =
            typeof lineHeight === 'string' && lineHeight.endsWith('px')
                ? lineHeight
                : +lineHeight;
    if (letterSpacing)
        style.letterSpacing = `${letterSpacing}px`;
    if (strokeWidth)
        style.strokeWidth = `${strokeWidth}px`;
    style.fontFamily = fontFamily
        ? (0, font_1.encodeFontFamily)(fontFamily)
        : fontFamily || '';
    return style;
}
function measureTextSpan(span) {
    const parentNode = span.parentNode;
    span.style.visibility = 'hidden';
    document.body.appendChild(span);
    const rect = span.getBoundingClientRect();
    if (parentNode)
        parentNode.appendChild(span);
    else
        document.body.removeChild(span);
    span.style.visibility = 'visible';
    return rect;
}
function getTextContent(text) {
    return getTextEntity(text)?.innerText || '';
}
function setTextContent(text, content) {
    const entity = getTextEntity(text);
    if (entity) {
        entity.innerText = content;
    }
}
function getTextElementProps(text) {
    const entity = getTextEntity(text);
    if (!entity)
        return {};
    const { color, fontSize, fontFamily, justifyContent, alignContent, fontWeight, } = entity.style;
    const [horizontal, vertical] = flexToAlign(justifyContent, alignContent);
    const attrs = {
        'data-horizontal-align': horizontal,
        'data-vertical-align': vertical,
    };
    if (fontFamily)
        attrs['font-family'] = (0, font_1.decodeFontFamily)(fontFamily);
    if (fontWeight)
        attrs['font-weight'] = fontWeight;
    if (fontSize)
        attrs['font-size'] = String(parseInt(fontSize));
    if (color)
        attrs['fill'] = color;
    return { attributes: attrs, textContent: getTextContent(text) };
}
function flexToAlign(justifyContent, alignContent) {
    let horizontal = 'LEFT';
    let vertical = 'TOP';
    switch (justifyContent) {
        case 'flex-start':
            horizontal = 'LEFT';
            break;
        case 'center':
            horizontal = 'CENTER';
            break;
        case 'flex-end':
            horizontal = 'RIGHT';
            break;
    }
    switch (alignContent) {
        case 'flex-start':
            vertical = 'TOP';
            break;
        case 'center':
            vertical = 'MIDDLE';
            break;
        case 'flex-end':
            vertical = 'BOTTOM';
            break;
    }
    return [horizontal, vertical];
}
