import { isSelectableElement } from '../../utils';
import { Interaction } from './base';
/**
 * 全选交互
 * 支持 Ctrl/Cmd + A 全选所有可选元素
 */
export class SelectAll extends Interaction {
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
            if (isSelectableElement(element)) {
                selectableElements.push(element);
            }
        });
        if (selectableElements.length > 0) {
            this.interaction.select(selectableElements, 'replace');
        }
    }
}
