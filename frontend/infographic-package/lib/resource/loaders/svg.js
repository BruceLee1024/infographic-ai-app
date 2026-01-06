"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loadSVGResource = loadSVGResource;
const utils_1 = require("../../utils");
function isSVGResource(resource) {
    return resource.startsWith('<svg') || resource.startsWith('<symbol');
}
function loadSVGResource(data) {
    if (!data || !isSVGResource(data))
        return null;
    const str = data.startsWith('<svg')
        ? data.replace(/<svg/, '<symbol').replace(/svg>/, 'symbol>')
        : data;
    return (0, utils_1.parseSVG)(str);
}
