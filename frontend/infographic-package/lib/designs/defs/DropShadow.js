"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DropShadow = void 0;
const jsx_runtime_1 = require("@antv/infographic/jsx-runtime");
const DropShadow = (props) => {
    const { color = 'black', opacity = 0.8, ...restProps } = props;
    return ((0, jsx_runtime_1.jsx)("filter", { id: "drop-shadow", x: "-25%", y: "-25%", width: "200%", height: "200%", ...restProps, children: (0, jsx_runtime_1.jsx)("feDropShadow", { dx: "4", dy: "4", stdDeviation: "4", "flood-color": color, "flood-opacity": opacity }) }));
};
exports.DropShadow = DropShadow;
