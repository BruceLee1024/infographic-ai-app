import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "@antv/infographic/jsx-runtime";
import { Defs, Polygon } from '../../jsx';
export const SimpleArrow = ({ width = 25, height = 25, colorPrimary = '#6699FF', rotation = 0, ...rest }) => {
    const strokeId = `gradient-arrow-stroke-${colorPrimary.replace('#', '')}`;
    const fillId = `gradient-arrow-fill-${colorPrimary.replace('#', '')}`;
    const shaftWidth = Math.round(width * 0.515);
    const shaftTop = Math.round(height * 0.275);
    const shaftBottom = Math.round(height * 0.875);
    const points = [
        { x: 0, y: shaftTop },
        { x: shaftWidth, y: shaftTop },
        { x: shaftWidth, y: height * 0.075 },
        { x: width, y: height * 0.575 },
        { x: shaftWidth, y: height * 1.075 },
        { x: shaftWidth, y: shaftBottom },
        { x: 0, y: shaftBottom },
    ];
    const centerX = width / 2;
    const centerY = height / 2;
    const transform = `rotate(${rotation} ${centerX} ${centerY})`;
    return (_jsxs(_Fragment, { children: [_jsx(Polygon, { ...rest, width: width, height: height, points: points, fill: `url(#${fillId})`, stroke: `url(#${strokeId})`, transform: transform, "data-element-type": "shape" }), _jsxs(Defs, { children: [_jsxs("linearGradient", { id: fillId, x1: "100%", y1: "0%", x2: "0%", y2: "0%", children: [_jsx("stop", { offset: "0%", "stop-color": colorPrimary, "stop-opacity": "0.36" }), _jsx("stop", { offset: "100%", "stop-color": colorPrimary, "stop-opacity": "0" })] }), _jsxs("linearGradient", { id: strokeId, x1: "100%", y1: "0%", x2: "0%", y2: "0%", children: [_jsx("stop", { offset: "0%", "stop-color": colorPrimary }), _jsx("stop", { offset: "58%", "stop-color": colorPrimary, "stop-opacity": "0" })] })] })] }));
};
