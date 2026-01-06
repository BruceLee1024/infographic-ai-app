import { isFragment } from './is-fragment';
import { isJSXElement } from './is-jsx-element';
export function nodeToElements(node) {
    return nodeToRenderableNodes(node).filter(isJSXElement);
}
export function nodeToRenderableNodes(node, result = []) {
    if (!node || typeof node === 'boolean') {
        return result;
    }
    if (Array.isArray(node)) {
        node.forEach((child) => nodeToRenderableNodes(child, result));
    }
    else {
        if (isFragment(node)) {
            const children = node.props?.children;
            (Array.isArray(children) ? children : [children])
                .filter(Boolean)
                .forEach((child) => {
                nodeToRenderableNodes(child, result);
            });
        }
        else if (typeof node === 'object')
            result.push(node);
        else
            result.push(node);
    }
    return result;
}
