import { getDatumByIndexes, getItemIndexes, isBtnsGroup, isDesc, isGroup, isIllus, isItemDesc, isItemIcon, isItemIllus, isItemLabel, isItemValue, isShape, isShapesGroup, isText, isTitle, parsePadding, setAttributes, setSVGPadding, } from '../utils';
import { renderBackground, renderBaseElement, renderButtonsGroup, renderIllus, renderItemIcon, renderItemText, renderShape, renderStaticShape, renderStaticText, renderSVG, renderText, } from './composites';
import { loadFonts } from './fonts';
const upsert = (original, modified) => {
    if (original === modified)
        return;
    if (!modified)
        original.remove();
    else
        original.replaceWith(modified);
};
export class Renderer {
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
                        loadFonts(this.template);
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
function renderTemplate(svg, options) {
    fill(svg, options);
    setSVG(svg, options);
    const { themeConfig } = options;
    renderBackground(svg, themeConfig?.colorBg);
}
function fill(svg, options) {
    const { themeConfig, data } = options;
    renderBaseElement(svg, themeConfig.base?.global);
    const elements = svg.querySelectorAll(`[data-element-type]`);
    elements.forEach((element) => {
        const id = element.id || '';
        if (isTitle(element)) {
            const modified = renderText(element, data.title || '', Object.assign({}, themeConfig.base?.text, themeConfig.title));
            return upsert(element, modified);
        }
        if (isDesc(element)) {
            const modified = renderText(element, data.desc || '', Object.assign({}, themeConfig.base?.text, themeConfig.desc));
            return upsert(element, modified);
        }
        if (isIllus(element)) {
            const modified = renderIllus(svg, element, data.illus?.[id]);
            return upsert(element, modified);
        }
        if (isShapesGroup(element)) {
            return Array.from(element.children).forEach((child) => {
                renderShape(svg, child, options);
            });
        }
        if (isShape(element)) {
            const modified = renderShape(svg, element, options);
            return upsert(element, modified);
        }
        if (isBtnsGroup(element)) {
            return renderButtonsGroup(svg, element);
        }
        if (element.dataset.elementType?.startsWith('item-')) {
            const indexes = getItemIndexes(element.dataset.indexes || '0');
            const itemType = element.dataset.elementType.replace('item-', '');
            if (isItemLabel(element) || isItemDesc(element) || isItemValue(element)) {
                const modified = renderItemText(itemType, element, options);
                return upsert(element, modified);
            }
            if (isItemIllus(element)) {
                const modified = renderIllus(svg, element, getDatumByIndexes(data, indexes)?.illus);
                return upsert(element, modified);
            }
            if (isItemIcon(element)) {
                const modified = renderItemIcon(svg, element, getDatumByIndexes(data, indexes)?.icon, options);
                return upsert(element, modified);
            }
        }
        if (isText(element)) {
            return renderStaticText(element, options);
        }
        if (!isGroup(element)) {
            return renderStaticShape(element, options);
        }
    });
    renderSVG(svg, options);
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
    setAttributes(svg, attributes);
}
function setView(svg, options) {
    const { padding = 0, viewBox } = options;
    if (viewBox) {
        svg.setAttribute('viewBox', viewBox);
    }
    else if (padding !== undefined) {
        setSVGPadding(svg, parsePadding(padding));
    }
}
