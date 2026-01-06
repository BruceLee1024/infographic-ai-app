"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cloneElement = void 0;
const cloneElement = (element, props) => {
    const { type, props: originalProps, ...rest } = element;
    return { type, props: { ...originalProps, ...props }, ...rest };
};
exports.cloneElement = cloneElement;
