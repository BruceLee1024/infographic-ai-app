"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ZoomWheel = void 0;
const lodash_es_1 = require("lodash-es");
const utils_1 = require("../../utils");
const commands_1 = require("../commands");
const base_1 = require("./base");
const MIN_VIEWBOX_SIZE = 1;
const MIN_PADDING = -5000;
const MAX_PADDING = 5000;
class ZoomWheel extends base_1.Interaction {
    constructor() {
        super(...arguments);
        this.name = 'zoom-wheel';
        this.wheelListener = (event) => {
            if (!this.interaction.isActive())
                return;
            if (!event.ctrlKey && !event.metaKey)
                return;
            event.preventDefault();
            const factor = event.deltaY > 0 ? 1.1 : 0.9;
            const current = this.state.getOptions();
            const currentPadding = current.padding ?? 0;
            const parsed = (0, utils_1.parsePadding)(currentPadding);
            const svg = this.editor.getDocument();
            const bbox = svg.getBBox();
            const scaled = parsed.map((value) => {
                const base = value === 0 ? 1 : value;
                return (0, lodash_es_1.clamp)(base * factor, MIN_PADDING, MAX_PADDING);
            });
            const [top, right, bottom, left] = scaled;
            const newWidth = bbox.width + left + right;
            const newHeight = bbox.height + top + bottom;
            if (newWidth <= MIN_VIEWBOX_SIZE || newHeight <= MIN_VIEWBOX_SIZE)
                return;
            const command = new commands_1.UpdateOptionsCommand({
                padding: scaled,
            });
            void this.commander.execute(command);
        };
    }
    init(options) {
        super.init(options);
        document.addEventListener('wheel', this.wheelListener, { passive: false });
    }
    destroy() {
        document.removeEventListener('wheel', this.wheelListener);
    }
}
exports.ZoomWheel = ZoomWheel;
