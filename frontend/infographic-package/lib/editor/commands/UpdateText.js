"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateTextCommand = void 0;
const utils_1 = require("../../utils");
const utils_2 = require("../utils");
class UpdateTextCommand {
    constructor(element, newText, originalText) {
        this.element = element;
        this.originalText = originalText ?? (0, utils_1.getTextContent)(element);
        this.modifiedText = newText;
    }
    async apply(state) {
        if (this.originalText === this.modifiedText)
            return;
        (0, utils_1.setTextContent)(this.element, this.modifiedText);
        updateItemText(state, this.element, this.modifiedText);
    }
    async undo(state) {
        if (this.originalText === this.modifiedText)
            return;
        (0, utils_1.setTextContent)(this.element, this.originalText);
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
exports.UpdateTextCommand = UpdateTextCommand;
function updateItemText(state, element, text) {
    const role = (0, utils_1.getElementRole)(element);
    if (role.startsWith('item-')) {
        const key = role.replace('item-', '');
        const indexes = (0, utils_2.getIndexesFromElement)(element);
        state.updateItemDatum(indexes, { [key]: text });
    }
    else {
        state.updateData(role, text);
    }
}
