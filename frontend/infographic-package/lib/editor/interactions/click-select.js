"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClickSelect = void 0;
const utils_1 = require("../../utils");
const utils_2 = require("../utils");
const base_1 = require("./base");
class ClickSelect extends base_1.Interaction {
    constructor() {
        super(...arguments);
        this.name = 'click-select';
        this.shiftKey = false;
        this.onShiftKeyDown = (event) => {
            if (event.key === 'Shift') {
                this.shiftKey = true;
            }
        };
        this.onShiftKeyUp = (event) => {
            if (event.key === 'Shift') {
                this.shiftKey = false;
            }
        };
        this.onEscKeyDown = (event) => {
            if (event.key === 'Escape') {
                this.interaction.clearSelection();
            }
        };
    }
    init(options) {
        super.init(options);
        const { editor, interaction } = this;
        this.clickHandler = new utils_2.ClickHandler(editor.getDocument(), { delay: 0 });
        const handleSelect = (event) => {
            if (!interaction.isActive())
                return;
            interaction.executeExclusiveInteraction(this, async () => {
                const target = (0, utils_2.getEventTarget)(event.target);
                if ((0, utils_1.isEditingText)(target))
                    return;
                if (this.shiftKey) {
                    // 多选
                    if (target) {
                        if (interaction.isSelected(target)) {
                            interaction.select([target], 'remove');
                        }
                        else {
                            interaction.select([target], 'add');
                        }
                    }
                }
                else {
                    // 单选
                    if (target)
                        interaction.select([target], 'replace');
                    else
                        interaction.clearSelection();
                }
            });
        };
        this.clickHandler.onClick(handleSelect);
        document.addEventListener('keydown', this.onShiftKeyDown);
        document.addEventListener('keyup', this.onShiftKeyUp);
        document.addEventListener('keydown', this.onEscKeyDown);
    }
    destroy() {
        this.clickHandler?.destroy();
        document.removeEventListener('keydown', this.onShiftKeyDown);
        document.removeEventListener('keyup', this.onShiftKeyUp);
        document.removeEventListener('keydown', this.onEscKeyDown);
    }
}
exports.ClickSelect = ClickSelect;
