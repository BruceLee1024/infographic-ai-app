"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loadSearchResource = loadSearchResource;
const constants_1 = require("../../constants");
const utils_1 = require("../../utils");
const image_1 = require("./image");
const remote_1 = require("./remote");
const svg_1 = require("./svg");
const queryIcon = async (query) => {
    try {
        const params = new URLSearchParams({ text: query, topK: '1' });
        const url = `${constants_1.ICON_SERVICE_URL}?${params.toString()}`;
        const response = await (0, utils_1.fetchWithCache)(url);
        if (!response.ok)
            return null;
        const result = await response.json();
        if (!result?.status || !Array.isArray(result.data?.data))
            return null;
        return result.data.data[0] || null;
    }
    catch (error) {
        console.error(`Failed to query icon for "${query}":`, error);
        return null;
    }
};
function isDataURI(resource) {
    return resource.startsWith('data:');
}
function looksLikeSVG(resource) {
    const str = resource.trim();
    return str.startsWith('<svg') || str.startsWith('<symbol');
}
async function loadSearchResource(query, format) {
    if (!query)
        return null;
    const result = await queryIcon(query);
    if (!result)
        return null;
    if (looksLikeSVG(result))
        return (0, svg_1.loadSVGResource)(result);
    if (isDataURI(result)) {
        const mimeType = result.match(/^data:([^;]+)/)?.[1] || '';
        const isBase64 = result.includes(';base64,');
        if (mimeType === 'image/svg+xml' && !isBase64) {
            const commaIndex = result.indexOf(',');
            const svgText = commaIndex >= 0 ? result.slice(commaIndex + 1) : result;
            return (0, svg_1.loadSVGResource)(svgText);
        }
        if (mimeType === 'image/svg+xml' && format === 'svg' && isBase64) {
            return (0, image_1.loadImageBase64Resource)(result);
        }
        return (0, image_1.loadImageBase64Resource)(result);
    }
    return (0, remote_1.loadRemoteResource)(result, format);
}
