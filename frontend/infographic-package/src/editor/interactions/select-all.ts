import type { Element } from '../../types';
import { isSelectableElement } from '../../utils';
import type { IInteraction, InteractionInitOptions } from '../types';
import { Interaction } from './base';

/**
 * 全选交互
 * 支持 Ctrl/Cmd + A 全选所有可选元素
 */
export class SelectAll extends Interaction implements IInteraction {
  name = 'select-all';

  init(options: InteractionInitOptions) {
    super.init(options);
    document.addEventListener('keydown', this.onKeyDown);
  }

  destroy() {
    document.removeEventListener('keydown', this.onKeyDown);
  }

  private onKeyDown = (event: KeyboardEvent) => {
    if (!this.interaction.isActive()) return;

    // Ctrl/Cmd + A
    if ((event.ctrlKey || event.metaKey) && event.key === 'a') {
      event.preventDefault();
      this.selectAll();
    }
  };

  private selectAll() {
    const doc = this.editor.getDocument();
    const elements = doc.querySelectorAll<SVGElement>('[data-element-type]');

    const selectableElements: Element[] = [];
    elements.forEach((element) => {
      if (isSelectableElement(element)) {
        selectableElements.push(element as Element);
      }
    });

    if (selectableElements.length > 0) {
      this.interaction.select(selectableElements, 'replace');
    }
  }
}
