import tinycolor from 'tinycolor2';
import { getAttributes, getOrCreateDefs, hasColor } from '../../utils';
import { getSafetyId } from '../utils';
import * as builtInPatterns from './patterns';
const PATTERNS = new Map();
export function registerPattern(name, generator) {
    if (PATTERNS.has(name))
        console.warn(`Pattern ${name} will be overwritten`);
    PATTERNS.set(name, generator);
}
for (const [name, generator] of Object.entries(builtInPatterns)) {
    registerPattern(name, generator);
}
export function applyPatternStyle(node, svg, options) {
    const config = options.themeConfig.stylize;
    if (!config || config.type !== 'pattern')
        return;
    const { pattern, ...restConfig } = config;
    const generator = PATTERNS.get(pattern);
    if (!generator) {
        return console.warn(`Pattern ${pattern} not found`);
    }
    const { fill } = getAttributes(node, ['fill', 'stroke']);
    const color = fill;
    const style = {
        backgroundColor: color
            ? tinycolor(color).setAlpha(0.5).toRgbString()
            : color,
        foregroundColor: color,
        ...restConfig,
    };
    const id = getPatternId({ ...config, ...style });
    upsertPattern(svg, id, generator(style));
    if (hasColor(fill)) {
        node.setAttribute('fill', `url(#${id})`);
        if (!node.getAttribute('stroke') && fill) {
            node.setAttribute('stroke', fill);
        }
    }
}
function upsertPattern(svg, id, pattern) {
    const defs = getOrCreateDefs(svg);
    pattern.setAttribute('id', id);
    const exist = defs.querySelector(`pattern#${id}`);
    if (exist)
        exist.replaceWith(pattern);
    else
        defs.appendChild(pattern);
}
function getPatternId(config) {
    const { pattern, foregroundColor = 'unset', backgroundColor = 'unset', scale = 'unset', } = config;
    return getSafetyId(`pattern-${pattern}-${foregroundColor}-${backgroundColor}-${scale}`);
}
