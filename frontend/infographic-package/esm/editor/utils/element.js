import { getIconEntity, isIconElement } from '../../utils';
export function getIndexesFromElement(element) {
    return (getElementEntity(element)?.dataset.indexes?.split(',').map(Number) || []);
}
function getElementEntity(element) {
    if (isIconElement(element))
        return getIconEntity(element);
    return element;
}
