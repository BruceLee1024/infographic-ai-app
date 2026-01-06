import { getAttributes, getIconAttrs, getIconEntity, getTextElementProps, isEditableText, isIconElement, setAttributes, updateIconElement, updateTextElement, } from '../../utils';
export class UpdateElementCommand {
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
function updateElement(element, props) {
    if (isEditableText(element)) {
        updateTextElement(element, props);
    }
    else if (isIconElement(element)) {
        updateIconElement(element, undefined, props.attributes);
    }
    else if (props.attributes) {
        setAttributes(element, props.attributes);
    }
}
function getOriginalProps(element, modified) {
    const modifiedAttrKeys = Object.keys(modified.attributes || {});
    const originalAttributes = getAttributes(element, modifiedAttrKeys, false);
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
    if (isEditableText(element)) {
        const { attributes } = getTextElementProps(element);
        assignModifiedAttributes(attributes);
    }
    else if (isIconElement(element)) {
        const entity = getIconEntity(element);
        if (!entity)
            return;
        assignModifiedAttributes(getIconAttrs(element));
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
