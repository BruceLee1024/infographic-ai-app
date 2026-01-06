"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Path = Path;
function Path(props) {
    const { x, y } = props;
    const finalProps = {
        ...props,
    };
    if (x !== undefined || y !== undefined) {
        finalProps.transform = `translate(${x ?? 0}, ${y ?? 0})`;
    }
    const node = {
        type: 'path',
        props: finalProps,
    };
    return node;
}
