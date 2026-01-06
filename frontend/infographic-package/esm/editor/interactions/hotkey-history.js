import { Hotkey } from '../utils';
import { Interaction } from './base';
export class HotkeyHistory extends Interaction {
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
        this.hotkey = new Hotkey({
            filter: () => this.interaction.isActive(),
        });
        this.hotkey.bind('mod+z', this.handleUndo);
        this.hotkey.bind(['mod+shift+z', 'mod+y'], this.handleRedo);
    }
    destroy() {
        this.hotkey?.destroy();
    }
}
