"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.renderBackground = renderBackground;
const utils_1 = require("../../utils");
function renderBackground(svg, background) {
    const container = svg.parentElement;
    if (container)
        container.style.backgroundColor = background || 'none';
    const element = (0, utils_1.getElementByRole)(svg, "background" /* ElementTypeEnum.Background */);
    if (!background) {
        return element?.remove();
    }
    svg.style.backgroundColor = background;
    if (element) {
        element.setAttribute('fill', background);
    }
    else if (svg.viewBox?.baseVal) {
        const { x, y, width, height } = svg.viewBox.baseVal;
        const rect = (0, utils_1.createElement)('rect', {
            x,
            y,
            width,
            height,
            fill: background,
            'data-element-type': "background" /* ElementTypeEnum.Background */,
        });
        svg.prepend(rect);
    }
}
