"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDividerComponent = exports.registerDivider = void 0;
const dividerRegistry = new Map();
const registerDivider = (type, component) => {
    dividerRegistry.set(type, component);
};
exports.registerDivider = registerDivider;
const getDividerComponent = (type) => {
    if (!type)
        return null;
    return dividerRegistry.get(type) ?? null;
};
exports.getDividerComponent = getDividerComponent;
