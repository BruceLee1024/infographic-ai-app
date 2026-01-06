"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Renderer = void 0;
const utils_1 = require("../utils");
const composites_1 = require("./composites");
const fonts_1 = require("./fonts");
const upsert = (original, modified) => {
    if (original === modified)
        return;
    if (!modified)
        original.remove();
    else
        original.replaceWith(modified);
};
class Renderer {
    constructor(options, template) {
        this.options = options;
        this.template = template;
        this.rendered = false;
    }
    getOptions() {
        return this.options;
    }
    getSVG() {
        return this.template;
    }
    render() {
        const svg = this.getSVG();
        if (this.rendered)
            return svg;
        renderTemplate(svg, this.options);
        svg.style.visibility = 'hidden';
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                mutation.addedNodes.forEach((node) => {
                    if (node === svg || node.contains(svg)) {
                        // post render
                        setView(this.template, this.options);
                        (0, fonts_1.loadFonts)(this.template);
                        // disconnect observer
                        observer.disconnect();
                        svg.style.visibility = '';
                    }
                });
            });
        });
        observer.observe(document, {
            childList: true,
            subtree: true,
        });
        this.rendered = true;
        return svg;
    }
}
exports.Renderer = Renderer;
function renderTemplate(svg, options) {
    fill(svg, options);
    setSVG(svg, options);
    const { themeConfig } = options;
    (0, composites_1.renderBackground)(svg, themeConfig?.colorBg);
}
function fill(svg, options) {
    const { themeConfig, data } = options;
    (0, composites_1.renderBaseElement)(svg, themeConfig.base?.global);
    const elements = svg.querySelectorAll(`[data-element-type]`);
    elements.forEach((element) => {
        const id = element.id || '';
        if ((0, utils_1.isTitle)(element)) {
            const modified = (0, composites_1.renderText)(element, data.title || '', Object.assign({}, themeConfig.base?.text, themeConfig.title));
            return upsert(element, modified);
        }
        if ((0, utils_1.isDesc)(element)) {
            const modified = (0, composites_1.renderText)(element, data.desc || '', Object.assign({}, themeConfig.base?.text, themeConfig.desc));
            return upsert(element, modified);
        }
        if ((0, utils_1.isIllus)(element)) {
            const modified = (0, composites_1.renderIllus)(svg, element, data.illus?.[id]);
            return upsert(element, modified);
        }
        if ((0, utils_1.isShapesGroup)(element)) {
            return Array.from(element.children).forEach((child) => {
                (0, composites_1.renderShape)(svg, child, options);
            });
        }
        if ((0, utils_1.isShape)(element)) {
            const modified = (0, composites_1.renderShape)(svg, element, options);
            return upsert(element, modified);
        }
        if ((0, utils_1.isBtnsGroup)(element)) {
            return (0, composites_1.renderButtonsGroup)(svg, element);
        }
        if (element.dataset.elementType?.startsWith('item-')) {
            const indexes = (0, utils_1.getItemIndexes)(element.dataset.indexes || '0');
            const itemType = element.dataset.elementType.replace('item-', '');
            if ((0, utils_1.isItemLabel)(element) || (0, utils_1.isItemDesc)(element) || (0, utils_1.isItemValue)(element)) {
                const modified = (0, composites_1.renderItemText)(itemType, element, options);
                return upsert(element, modified);
            }
            if ((0, utils_1.isItemIllus)(element)) {
                const modified = (0, composites_1.renderIllus)(svg, element, (0, utils_1.getDatumByIndexes)(data, indexes)?.illus);
                return upsert(element, modified);
            }
            if ((0, utils_1.isItemIcon)(element)) {
                const modified = (0, composites_1.renderItemIcon)(svg, element, (0, utils_1.getDatumByIndexes)(data, indexes)?.icon, options);
                return upsert(element, modified);
            }
        }
        if ((0, utils_1.isText)(element)) {
            return (0, composites_1.renderStaticText)(element, options);
        }
        if (!(0, utils_1.isGroup)(element)) {
            return (0, composites_1.renderStaticShape)(element, options);
        }
    });
    (0, composites_1.renderSVG)(svg, options);
}
function setSVG(svg, options) {
    const { width, height } = options;
    const { style = {}, attributes = {}, id, className } = options.svg || {};
    if (id)
        svg.id = id;
    if (className)
        svg.classList.add(className);
    if (width !== undefined) {
        svg.setAttribute('width', typeof width === 'number' ? `${width}px` : width);
    }
    if (height !== undefined) {
        svg.setAttribute('height', typeof height === 'number' ? `${height}px` : height);
    }
    Object.assign(svg.style, style);
    (0, utils_1.setAttributes)(svg, attributes);
}
function setView(svg, options) {
    const { padding = 0, viewBox } = options;
    if (viewBox) {
        svg.setAttribute('viewBox', viewBox);
    }
    else if (padding !== undefined) {
        (0, utils_1.setSVGPadding)(svg, (0, utils_1.parsePadding)(padding));
    }
}
