"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Triangle = void 0;
const jsx_runtime_1 = require("@antv/infographic/jsx-runtime");
const jsx_1 = require("../../jsx");
const Triangle = ({ width = 25, height = 25, colorPrimary = '#6699FF', rotation = 0, strokeWidth = 4, ...rest }) => {
    // 定义三角形的三个顶点
    const points = [
        { x: width / 2, y: 0 }, // 顶点
        { x: width, y: height }, // 右下角
        { x: 0, y: height }, // 左下角
    ];
    const centerX = width / 2;
    const centerY = height / 2;
    const transform = `rotate(${rotation} ${centerX} ${centerY})`;
    return ((0, jsx_runtime_1.jsx)(jsx_1.Polygon, { ...rest, width: width, height: height, points: points, fill: colorPrimary, stroke: colorPrimary, strokeWidth: strokeWidth, strokeLinecap: "round", strokeLinejoin: "round", transform: transform }));
};
exports.Triangle = Triangle;
