"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.exportToSVGString = exportToSVGString;
exports.exportToSVG = exportToSVG;
const utils_1 = require("../utils");
const font_1 = require("./font");
async function exportToSVGString(svg, options = {}) {
    const node = await exportToSVG(svg, options);
    const str = new XMLSerializer().serializeToString(node);
    return 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(str);
}
async function exportToSVG(svg, options = {}) {
    const { embedResources = true } = options;
    const clonedSVG = svg.cloneNode(true);
    const { width, height } = (0, utils_1.getViewBox)(svg);
    (0, utils_1.setAttributes)(clonedSVG, { width, height });
    await embedIcons(clonedSVG);
    await (0, font_1.embedFonts)(clonedSVG, embedResources);
    cleanSVG(clonedSVG);
    return clonedSVG;
}
async function embedIcons(svg) {
    const icons = svg.querySelectorAll('use');
    const defs = getDefs(svg);
    icons.forEach((icon) => {
        const href = icon.getAttribute('href');
        if (!href)
            return;
        const existsSymbol = svg.querySelector(href);
        if (!existsSymbol) {
            const symbolElement = document.querySelector(href);
            if (symbolElement)
                defs.appendChild(symbolElement.cloneNode(true));
        }
    });
}
const iconRole = 'icon-defs';
function getDefs(svg) {
    const defs = (0, utils_1.getElementByRole)(svg, iconRole);
    if (defs)
        return defs;
    const _defs = (0, utils_1.createElement)('defs');
    (0, utils_1.setElementRole)(_defs, iconRole);
    svg.prepend(_defs);
    return _defs;
}
function cleanSVG(svg) {
    removeBtnGroup(svg);
    removeTransientContainer(svg);
    removeUselessAttrs(svg);
    clearDataset(svg);
}
function removeBtnGroup(svg) {
    const btnGroup = (0, utils_1.getElementByRole)(svg, "btns-group" /* ElementTypeEnum.BtnsGroup */);
    btnGroup?.remove();
    const btnIconDefs = (0, utils_1.getElementByRole)(svg, 'btn-icon-defs');
    btnIconDefs?.remove();
}
function removeTransientContainer(svg) {
    const transientContainer = svg.querySelector('[data-element-type=transient-container]');
    transientContainer?.remove();
}
function removeUselessAttrs(svg) {
    const groups = svg.querySelectorAll('g');
    groups.forEach((group) => {
        group.removeAttribute('x');
        group.removeAttribute('y');
        group.removeAttribute('width');
        group.removeAttribute('height');
    });
}
function clearDataset(svg) {
    (0, utils_1.traverse)(svg, (node) => {
        for (const key in node.dataset) {
            delete node.dataset[key];
        }
    });
}
