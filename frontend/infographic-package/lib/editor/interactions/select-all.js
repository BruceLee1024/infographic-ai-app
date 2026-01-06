"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SelectAll = void 0;
const utils_1 = require("../../utils");
const base_1 = require("./base");
/**
 * 全选交互
 * 支持 Ctrl/Cmd + A 全选所有可选元素
 */
class SelectAll extends base_1.Interaction {
    constructor() {
        super(...arguments);
        this.name = 'select-all';
        this.onKeyDown = (event) => {
            if (!this.interaction.isActive())
                return;
            // Ctrl/Cmd + A
            if ((event.ctrlKey || event.metaKey) && event.key === 'a') {
                event.preventDefault();
                this.selectAll();
            }
        };
    }
    init(options) {
        super.init(options);
        document.addEventListener('keydown', this.onKeyDown);
    }
    destroy() {
        document.removeEventListener('keydown', this.onKeyDown);
    }
    selectAll() {
        const doc = this.editor.getDocument();
        const elements = doc.querySelectorAll('[data-element-type]');
        const selectableElements = [];
        elements.forEach((element) => {
            if ((0, utils_1.isSelectableElement)(element)) {
                selectableElements.push(element);
            }
        });
        if (selectableElements.length > 0) {
            this.interaction.select(selectableElements, 'replace');
        }
    }
}
exports.SelectAll = SelectAll;
