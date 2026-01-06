"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getIndexesFromElement = getIndexesFromElement;
const utils_1 = require("../../utils");
function getIndexesFromElement(element) {
    return (getElementEntity(element)?.dataset.indexes?.split(',').map(Number) || []);
}
function getElementEntity(element) {
    if ((0, utils_1.isIconElement)(element))
        return (0, utils_1.getIconEntity)(element);
    return element;
}
