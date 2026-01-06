"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPaletteColor = void 0;
const registry_1 = require("./registry");
const getPaletteColor = (args = [], indexes, total) => {
    const palette = typeof args === 'string' ? (0, registry_1.getPalette)(args) || [] : args;
    const index = indexes[0] ?? 0;
    if (typeof palette === 'function') {
        const ratio = total ? index / total : 0;
        return palette(ratio, index, total ?? 0);
    }
    if (Array.isArray(palette)) {
        if (palette.length === 0)
            return;
        return palette[index % palette.length];
    }
};
exports.getPaletteColor = getPaletteColor;
