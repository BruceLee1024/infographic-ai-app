"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateElementCommand = void 0;
const utils_1 = require("../../utils");
class UpdateElementCommand {
    constructor(element, modified, original) {
        this.element = element;
        this.modified = modified;
        const computedOriginal = getOriginalProps(element, modified);
        this.original = mergeOriginalProps(computedOriginal, original);
    }
    async apply(state) {
        updateElement(this.element, this.modified);
        state.updateElement(this.element, this.modified);
    }
    async undo(state) {
        if (this.original) {
            updateElement(this.element, this.original);
            state.updateElement(this.element, this.original);
        }
    }
    serialize() {
        return {
            type: 'update-element',
            elementId: this.element.id,
            modified: this.modified,
            original: this.original,
        };
    }
}
exports.UpdateElementCommand = UpdateElementCommand;
function updateElement(element, props) {
    if ((0, utils_1.isEditableText)(element)) {
        (0, utils_1.updateTextElement)(element, props);
    }
    else if ((0, utils_1.isIconElement)(element)) {
        (0, utils_1.updateIconElement)(element, undefined, props.attributes);
    }
    else if (props.attributes) {
        (0, utils_1.setAttributes)(element, props.attributes);
    }
}
function getOriginalProps(element, modified) {
    const modifiedAttrKeys = Object.keys(modified.attributes || {});
    const originalAttributes = (0, utils_1.getAttributes)(element, modifiedAttrKeys, false);
    const assignModifiedAttributes = (attrs) => {
        if (!attrs)
            return;
        modifiedAttrKeys.forEach((key) => {
            if (key in attrs)
                originalAttributes[key] = attrs[key];
        });
    };
    const original = {
        ...modified,
        attributes: originalAttributes,
    };
    if ((0, utils_1.isEditableText)(element)) {
        const { attributes } = (0, utils_1.getTextElementProps)(element);
        assignModifiedAttributes(attributes);
    }
    else if ((0, utils_1.isIconElement)(element)) {
        const entity = (0, utils_1.getIconEntity)(element);
        if (!entity)
            return;
        assignModifiedAttributes((0, utils_1.getIconAttrs)(element));
    }
    // TODO illus
    return original;
}
function mergeOriginalProps(computed, provided) {
    if (!computed)
        return provided;
    if (!provided)
        return computed;
    const mergedAttributes = {
        ...(computed.attributes || {}),
        ...(provided.attributes || {}),
    };
    return {
        ...computed,
        ...provided,
        attributes: Object.keys(mergedAttributes).length
            ? mergedAttributes
            : undefined,
    };
}
