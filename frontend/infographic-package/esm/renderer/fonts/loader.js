import { join, normalizeFontWeightName } from '../../utils';
import { getFont, getFonts } from './registry';
export function getFontURLs(font) {
    const config = getFont(font);
    if (!config)
        return [];
    const { baseUrl, fontWeight } = config;
    return Object.values(fontWeight)
        .filter(Boolean)
        .map((url) => join(baseUrl, url));
}
export function getWoff2BaseURL(font, fontWeightName) {
    const config = getFont(font);
    if (!config)
        return null;
    const name = normalizeFontWeightName(fontWeightName);
    const path = config.fontWeight[name];
    if (!path)
        return null;
    return join(config.baseUrl, path.replace(/\/result.css$/, ''));
}
const FONT_LOAD_MAP = new WeakMap();
export function loadFont(svg, font) {
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
export function loadFonts(svg) {
    const fonts = getFonts();
    fonts.forEach((font) => loadFont(svg, font.fontFamily));
}
