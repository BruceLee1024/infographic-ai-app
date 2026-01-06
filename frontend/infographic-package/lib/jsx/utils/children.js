"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRenderableChildrenOf = getRenderableChildrenOf;
const element_1 = require("./element");
function getRenderableChildrenOf(element) {
    if (element === null ||
        element === undefined ||
        typeof element === 'boolean') {
        return [];
    }
    if (Array.isArray(element))
        return (0, element_1.nodeToRenderableNodes)(element);
    if (typeof element === 'object') {
        return (0, element_1.nodeToRenderableNodes)(element.props?.children);
    }
    return [element];
}
