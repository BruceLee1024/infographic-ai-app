import { getElementRole, getTextContent, setTextContent } from '../../utils';
import { getIndexesFromElement } from '../utils';
export class UpdateTextCommand {
    constructor(element, newText, originalText) {
        this.element = element;
        this.originalText = originalText ?? getTextContent(element);
        this.modifiedText = newText;
    }
    async apply(state) {
        if (this.originalText === this.modifiedText)
            return;
        setTextContent(this.element, this.modifiedText);
        updateItemText(state, this.element, this.modifiedText);
    }
    async undo(state) {
        if (this.originalText === this.modifiedText)
            return;
        setTextContent(this.element, this.originalText);
        updateItemText(state, this.element, this.originalText);
    }
    serialize() {
        return {
            type: 'update-text',
            elementId: this.element.id,
            original: this.originalText,
            modified: this.modifiedText,
        };
    }
}
function updateItemText(state, element, text) {
    const role = getElementRole(element);
    if (role.startsWith('item-')) {
        const key = role.replace('item-', '');
        const indexes = getIndexesFromElement(element);
        state.updateItemDatum(indexes, { [key]: text });
    }
    else {
        state.updateData(role, text);
    }
}
