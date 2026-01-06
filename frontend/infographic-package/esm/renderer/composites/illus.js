import { getResourceHref, getResourceId, loadResource, parseResourceConfig, } from '../../resource';
import { createElement, getAttributes, getOrCreateDefs, removeAttributes, uuid, } from '../../utils';
export function renderIllus(svg, node, value) {
    if (!value)
        return null;
    const config = parseResourceConfig(value);
    if (!config)
        return null;
    const id = getResourceId(config);
    const clipPathId = createClipPath(svg, node, id);
    loadResource(svg, 'illus', config);
    const { data, color } = config;
    return createIllusElement(id, {
        ...parseIllusBounds(node),
        'clip-path': `url(#${clipPathId})`,
        ...(color ? { color } : {}),
    }, data);
}
function createClipPath(svg, node, id) {
    const clipPathId = `clip-${id}-${uuid()}`;
    if (svg.querySelector(`#${clipPathId}`)) {
        return clipPathId;
    }
    const defs = getOrCreateDefs(svg);
    const clipPath = createElement('clipPath', {
        id: clipPathId,
    });
    const clonedNode = node.cloneNode();
    removeAttributes(clonedNode, [
        'id',
        'data-illus-bounds',
        'data-element-type',
    ]);
    clipPath.appendChild(clonedNode);
    defs.appendChild(clipPath);
    return clipPathId;
}
function createIllusElement(id, attrs, value) {
    const { 'clip-path': clipPath, ...restAttrs } = attrs;
    const { x = '0', y = '0', width = '0', height = '0' } = restAttrs;
    const bounds = createElement('rect', {
        id: `${id}-volume`,
        'data-element-type': "illus-volume" /* ElementTypeEnum.IllusVolume */,
        x,
        y,
        width,
        height,
        fill: 'transparent',
    });
    const g = createElement('g', {
        'data-element-type': "illus-group" /* ElementTypeEnum.IllusGroup */,
        'clip-path': clipPath,
        id: `${id}-group`,
    });
    g.appendChild(bounds);
    const use = createElement('use', {
        id,
        fill: 'lightgray',
        ...restAttrs,
        href: getResourceHref(value),
        'data-element-type': "illus" /* ElementTypeEnum.Illus */,
    });
    g.appendChild(use);
    return g;
}
function parseIllusBounds(node) {
    const dataIllusBounds = node.getAttribute('data-illus-bounds');
    if (!dataIllusBounds) {
        return {
            x: '0',
            y: '0',
            width: '0',
            height: '0',
            ...getAttributes(node, ['x', 'y', 'width', 'height']),
        };
    }
    const [x, y, width, height] = dataIllusBounds.split(' ');
    return { x, y, width, height };
}
