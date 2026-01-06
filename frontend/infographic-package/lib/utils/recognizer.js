"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isRoughVolume = exports.isRoughElement = exports.isBtnRemove = exports.isBtnAdd = exports.isBtnsGroup = exports.isEditArea = exports.isItemIllus = exports.isItemValue = exports.isItemDesc = exports.isItemLabel = exports.isItemIconGroup = exports.isItemIcon = exports.isGroup = exports.isText = exports.isIllus = exports.isShapesGroup = exports.isShape = exports.isDesc = exports.isTitle = exports.isSVG = void 0;
exports.isForeignObjectElement = isForeignObjectElement;
exports.isTextEntity = isTextEntity;
exports.isEditableText = isEditableText;
exports.isEditingText = isEditingText;
exports.isGeometryElement = isGeometryElement;
exports.isIconElement = isIconElement;
exports.isInfographicComponent = isInfographicComponent;
exports.isSelectableElement = isSelectableElement;
const constants_1 = require("../constants");
const element_1 = require("./element");
const text_1 = require("./text");
const is = (element, role) => {
    return element?.dataset?.elementType === role;
};
const isSVG = (element) => element instanceof SVGElement && element.tagName === 'svg';
exports.isSVG = isSVG;
const isTitle = (element) => is(element, 'title');
exports.isTitle = isTitle;
const isDesc = (element) => is(element, 'desc');
exports.isDesc = isDesc;
const isShape = (element) => is(element, 'shape');
exports.isShape = isShape;
const isShapesGroup = (element) => is(element, 'shapes-group');
exports.isShapesGroup = isShapesGroup;
const isIllus = (element) => is(element, 'illus');
exports.isIllus = isIllus;
const isText = (element) => element instanceof SVGElement && element.tagName === 'text';
exports.isText = isText;
const isGroup = (element) => element instanceof SVGElement && element.tagName === 'g';
exports.isGroup = isGroup;
const isItemIcon = (element) => is(element, 'item-icon');
exports.isItemIcon = isItemIcon;
const isItemIconGroup = (element) => is(element, 'item-icon-group');
exports.isItemIconGroup = isItemIconGroup;
const isItemLabel = (element) => is(element, 'item-label');
exports.isItemLabel = isItemLabel;
const isItemDesc = (element) => is(element, 'item-desc');
exports.isItemDesc = isItemDesc;
const isItemValue = (element) => is(element, 'item-value');
exports.isItemValue = isItemValue;
const isItemIllus = (element) => is(element, 'item-illus');
exports.isItemIllus = isItemIllus;
const isEditArea = (element) => is(element, 'edit-area');
exports.isEditArea = isEditArea;
const isBtnsGroup = (element) => is(element, 'btns-group');
exports.isBtnsGroup = isBtnsGroup;
const isBtnAdd = (element) => is(element, 'btn-add');
exports.isBtnAdd = isBtnAdd;
const isBtnRemove = (element) => is(element, 'btn-remove');
exports.isBtnRemove = isBtnRemove;
const isRoughElement = (element) => is(element, 'rough-element');
exports.isRoughElement = isRoughElement;
const isRoughVolume = (element) => is(element, 'rough-volume');
exports.isRoughVolume = isRoughVolume;
function isForeignObjectElement(element) {
    return element.tagName === 'foreignObject';
}
function isTextEntity(element) {
    return element.tagName === 'SPAN';
}
function isEditableText(node) {
    const role = (0, element_1.getElementRole)(node);
    return [
        "title" /* ElementTypeEnum.Title */,
        "desc" /* ElementTypeEnum.Desc */,
        "item-label" /* ElementTypeEnum.ItemLabel */,
        "item-desc" /* ElementTypeEnum.ItemDesc */,
    ].includes(role);
}
function isEditingText(element) {
    if (!element)
        return false;
    if (!isEditableText(element))
        return false;
    const span = (0, text_1.getTextEntity)(element);
    if (!span)
        return false;
    return span.hasAttribute('contenteditable');
}
function isGeometryElement(element) {
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
function isIconElement(element) {
    return (0, exports.isItemIcon)(element) || (0, exports.isItemIconGroup)(element);
}
/**
 * 对于编辑器插件、交互挂载的DOM元素，识别其是否为信息图组件的一部分
 * 在元素中操作时不会触发编辑器的取消激活行为
 */
function isInfographicComponent(element) {
    let current = element;
    while (current) {
        if ((0, element_1.getElementByRole)(current, constants_1.COMPONENT_ROLE)) {
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
function isSelectableElement(element) {
    const role = (0, element_1.getElementRole)(element);
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
