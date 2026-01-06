import { Fragment } from '../jsx-runtime';
export function isFragment(node) {
    if (!node || typeof node !== 'object' || Array.isArray(node))
        return false;
    return node.type === Fragment;
}
