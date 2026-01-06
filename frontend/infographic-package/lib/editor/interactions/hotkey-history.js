"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HotkeyHistory = void 0;
const utils_1 = require("../utils");
const base_1 = require("./base");
class HotkeyHistory extends base_1.Interaction {
    constructor() {
        super(...arguments);
        this.name = 'hotkey-history';
        this.handleUndo = async (event) => {
            event.preventDefault();
            await this.commander.undo();
        };
        this.handleRedo = async (event) => {
            event.preventDefault();
            await this.commander.redo();
        };
    }
    init(options) {
        super.init(options);
        this.hotkey = new utils_1.Hotkey({
            filter: () => this.interaction.isActive(),
        });
        this.hotkey.bind('mod+z', this.handleUndo);
        this.hotkey.bind(['mod+shift+z', 'mod+y'], this.handleRedo);
    }
    destroy() {
        this.hotkey?.destroy();
    }
}
exports.HotkeyHistory = HotkeyHistory;
