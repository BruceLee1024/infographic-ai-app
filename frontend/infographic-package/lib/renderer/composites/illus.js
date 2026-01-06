"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.renderIllus = renderIllus;
const resource_1 = require("../../resource");
const utils_1 = require("../../utils");
function renderIllus(svg, node, value) {
    if (!value)
        return null;
    const config = (0, resource_1.parseResourceConfig)(value);
    if (!config)
        return null;
    const id = (0, resource_1.getResourceId)(config);
    const clipPathId = createClipPath(svg, node, id);
    (0, resource_1.loadResource)(svg, 'illus', config);
    const { data, color } = config;
    return createIllusElement(id, {
        ...parseIllusBounds(node),
        'clip-path': `url(#${clipPathId})`,
        ...(color ? { color } : {}),
    }, data);
}
function createClipPath(svg, node, id) {
    const clipPathId = `clip-${id}-${(0, utils_1.uuid)()}`;
    if (svg.querySelector(`#${clipPathId}`)) {
        return clipPathId;
    }
    const defs = (0, utils_1.getOrCreateDefs)(svg);
    const clipPath = (0, utils_1.createElement)('clipPath', {
        id: clipPathId,
    });
    const clonedNode = node.cloneNode();
    (0, utils_1.removeAttributes)(clonedNode, [
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
    const bounds = (0, utils_1.createElement)('rect', {
        id: `${id}-volume`,
        'data-element-type': "illus-volume" /* ElementTypeEnum.IllusVolume */,
        x,
        y,
        width,
        height,
        fill: 'transparent',
    });
    const g = (0, utils_1.createElement)('g', {
        'data-element-type': "illus-group" /* ElementTypeEnum.IllusGroup */,
        'clip-path': clipPath,
        id: `${id}-group`,
    });
    g.appendChild(bounds);
    const use = (0, utils_1.createElement)('use', {
        id,
        fill: 'lightgray',
        ...restAttrs,
        href: (0, resource_1.getResourceHref)(value),
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
            ...(0, utils_1.getAttributes)(node, ['x', 'y', 'width', 'height']),
        };
    }
    const [x, y, width, height] = dataIllusBounds.split(' ');
    return { x, y, width, height };
}
