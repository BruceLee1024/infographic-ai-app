import { parseSVG } from '../../utils';
function isSVGResource(resource) {
    return resource.startsWith('<svg') || resource.startsWith('<symbol');
}
export function loadSVGResource(data) {
    if (!data || !isSVGResource(data))
        return null;
    const str = data.startsWith('<svg')
        ? data.replace(/<svg/, '<symbol').replace(/svg>/, 'symbol>')
        : data;
    return parseSVG(str);
}
