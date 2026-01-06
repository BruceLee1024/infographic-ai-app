import { getSimpleHash } from '../../utils';
import { parseResourceConfig } from './parser';
export function getResourceId(config) {
    const cfg = typeof config === 'string' ? parseResourceConfig(config) : config;
    if (!cfg)
        return null;
    return 'rsc-' + getSimpleHash(JSON.stringify(cfg));
}
export function getResourceHref(config) {
    const id = getResourceId(config);
    if (!id)
        return null;
    return `#${id}`;
}
