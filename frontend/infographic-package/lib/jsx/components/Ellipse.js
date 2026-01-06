"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Ellipse = Ellipse;
function Ellipse(props) {
    const { x = 0, y = 0, width = 0, height = 0 } = props;
    props.cx ?? (props.cx = x + width / 2);
    props.cy ?? (props.cy = y + height / 2);
    props.rx ?? (props.rx = width / 2);
    props.ry ?? (props.ry = height / 2);
    const node = {
        type: 'ellipse',
        props,
    };
    return node;
}
