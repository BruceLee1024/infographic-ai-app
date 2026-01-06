"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loadRemoteResource = loadRemoteResource;
const utils_1 = require("../../utils");
const image_1 = require("./image");
const svg_1 = require("./svg");
function isRemoteResource(resource) {
    try {
        return Boolean(new URL(resource));
    }
    catch {
        return false;
    }
}
function shouldParseAsSVG(contentType, format) {
    const normalized = contentType.toLowerCase();
    if (normalized.includes('image/svg'))
        return true;
    if (!contentType && format === 'svg')
        return true;
    return false;
}
async function loadRemoteResource(resource, format) {
    if (!resource || !isRemoteResource(resource))
        return null;
    const response = await (0, utils_1.fetchWithCache)(resource);
    if (!response.ok)
        throw new Error('Failed to load resource');
    const contentType = response.headers.get('Content-Type') || '';
    if (shouldParseAsSVG(contentType, format)) {
        const svgText = await response.text();
        return (0, svg_1.loadSVGResource)(svgText);
    }
    const blob = await response.blob();
    const base64 = await blobToBase64(blob);
    return (0, image_1.loadImageBase64Resource)(base64);
}
function blobToBase64(blob) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => {
            resolve(reader.result);
        };
        reader.onerror = reject;
        reader.readAsDataURL(blob);
    });
}
