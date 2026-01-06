"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFontURLs = getFontURLs;
exports.getWoff2BaseURL = getWoff2BaseURL;
exports.loadFont = loadFont;
exports.loadFonts = loadFonts;
const utils_1 = require("../../utils");
const registry_1 = require("./registry");
function getFontURLs(font) {
    const config = (0, registry_1.getFont)(font);
    if (!config)
        return [];
    const { baseUrl, fontWeight } = config;
    return Object.values(fontWeight)
        .filter(Boolean)
        .map((url) => (0, utils_1.join)(baseUrl, url));
}
function getWoff2BaseURL(font, fontWeightName) {
    const config = (0, registry_1.getFont)(font);
    if (!config)
        return null;
    const name = (0, utils_1.normalizeFontWeightName)(fontWeightName);
    const path = config.fontWeight[name];
    if (!path)
        return null;
    return (0, utils_1.join)(config.baseUrl, path.replace(/\/result.css$/, ''));
}
const FONT_LOAD_MAP = new WeakMap();
function loadFont(svg, font) {
    const doc = svg.ownerDocument;
    const target = doc?.head || document.head;
    if (!target)
        return;
    if (!FONT_LOAD_MAP.has(target))
        FONT_LOAD_MAP.set(target, new Map());
    const map = FONT_LOAD_MAP.get(target);
    const links = [];
    const urls = getFontURLs(font);
    urls.forEach((url) => {
        const id = `${font}-${url}`;
        if (map.has(id))
            return;
        const link = doc.createElement('link');
        link.id = id;
        link.rel = 'stylesheet';
        link.href = url;
        links.push(link);
        map.set(id, link);
    });
    if (!links.length)
        return;
    if (target.tagName === 'HEAD') {
        links.forEach((link) => target.appendChild(link));
    }
}
function loadFonts(svg) {
    const fonts = (0, registry_1.getFonts)();
    fonts.forEach((font) => loadFont(svg, font.fontFamily));
}
