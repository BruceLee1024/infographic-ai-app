import { COMPONENT_ROLE } from '../constants';
import { getElementByRole, getElementRole } from './element';
import { getTextEntity } from './text';
const is = (element, role) => {
    return element?.dataset?.elementType === role;
};
export const isSVG = (element) => element instanceof SVGElement && element.tagName === 'svg';
export const isTitle = (element) => is(element, 'title');
export const isDesc = (element) => is(element, 'desc');
export const isShape = (element) => is(element, 'shape');
export const isShapesGroup = (element) => is(element, 'shapes-group');
export const isIllus = (element) => is(element, 'illus');
export const isText = (element) => element instanceof SVGElement && element.tagName === 'text';
export const isGroup = (element) => element instanceof SVGElement && element.tagName === 'g';
export const isItemIcon = (element) => is(element, 'item-icon');
export const isItemIconGroup = (element) => is(element, 'item-icon-group');
export const isItemLabel = (element) => is(element, 'item-label');
export const isItemDesc = (element) => is(element, 'item-desc');
export const isItemValue = (element) => is(element, 'item-value');
export const isItemIllus = (element) => is(element, 'item-illus');
export const isEditArea = (element) => is(element, 'edit-area');
export const isBtnsGroup = (element) => is(element, 'btns-group');
export const isBtnAdd = (element) => is(element, 'btn-add');
export const isBtnRemove = (element) => is(element, 'btn-remove');
export const isRoughElement = (element) => is(element, 'rough-element');
export const isRoughVolume = (element) => is(element, 'rough-volume');
export function isForeignObjectElement(element) {
    return element.tagName === 'foreignObject';
}
export function isTextEntity(element) {
    return element.tagName === 'SPAN';
}
export function isEditableText(node) {
    const role = getElementRole(node);
    return [
        "title" /* ElementTypeEnum.Title */,
        "desc" /* ElementTypeEnum.Desc */,
        "item-label" /* ElementTypeEnum.ItemLabel */,
        "item-desc" /* ElementTypeEnum.ItemDesc */,
    ].includes(role);
}
export function isEditingText(element) {
    if (!element)
        return false;
    if (!isEditableText(element))
        return false;
    const span = getTextEntity(element);
    if (!span)
        return false;
    return span.hasAttribute('contenteditable');
}
export function isGeometryElement(element) {
    const tagName = element.tagName.toLowerCase();
    return [
        'rect',
        'circle',
        'ellipse',
        'line',
        'polygon',
        'polyline',
        'path',
    ].includes(tagName);
}
export function isIconElement(element) {
    return isItemIcon(element) || isItemIconGroup(element);
}
/**
 * 对于编辑器插件、交互挂载的DOM元素，识别其是否为信息图组件的一部分
 * 在元素中操作时不会触发编辑器的取消激活行为
 */
export function isInfographicComponent(element) {
    let current = element;
    while (current) {
        if (getElementByRole(current, COMPONENT_ROLE)) {
            return true;
        }
        current = current.parentElement;
    }
    return false;
}
/**
 * 判断元素是否可被选中
 * 可选中的元素包括：标题、描述、数据项的标签、描述、值、图标、插图等
 */
export function isSelectableElement(element) {
    const role = getElementRole(element);
    const selectableRoles = [
        "title" /* ElementTypeEnum.Title */,
        "desc" /* ElementTypeEnum.Desc */,
        "illus" /* ElementTypeEnum.Illus */,
        "item-label" /* ElementTypeEnum.ItemLabel */,
        "item-desc" /* ElementTypeEnum.ItemDesc */,
        "item-value" /* ElementTypeEnum.ItemValue */,
        "item-icon" /* ElementTypeEnum.ItemIcon */,
        "item-illus" /* ElementTypeEnum.ItemIllus */,
        'shape', // shape 不在枚举中，直接用字符串
    ];
    return selectableRoles.includes(role);
}
