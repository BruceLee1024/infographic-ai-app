import { loadResource } from '../../resource';
import { createIconElement, getAttributes } from '../../utils';
import { parseDynamicAttributes } from '../utils';
export function renderIcon(svg, node, value, attrs = {}) {
    if (!value)
        return null;
    const parsedAttrs = parseDynamicAttributes(node, attrs);
    return createIcon(svg, node, value, parsedAttrs);
}
export function renderItemIcon(svg, node, value, options) {
    if (!value)
        return null;
    const { themeConfig } = options;
    const attrs = {
        ...themeConfig.item?.icon,
    };
    const parsedAttrs = parseDynamicAttributes(node, attrs);
    return createIcon(svg, node, value, parsedAttrs);
}
function createIcon(svg, node, value, attrs) {
    // load async
    loadResource(svg, 'icon', value);
    return createIconElement(value, {
        ...getAttributes(node, [
            'id',
            'x',
            'y',
            'width',
            'height',
            'fill',
            'stroke',
            'data-element-type',
            'data-indexes',
        ]),
        ...attrs,
    });
}
