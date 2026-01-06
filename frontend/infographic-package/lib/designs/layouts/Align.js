"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AlignLayout = void 0;
const jsx_runtime_1 = require("@antv/infographic/jsx-runtime");
const jsx_1 = require("../../jsx");
exports.AlignLayout = (0, jsx_1.createLayout)((children, { horizontal, vertical, ...props }) => {
    if (!children || children.length === 0) {
        return (0, jsx_runtime_1.jsx)(jsx_1.Group, { ...props });
    }
    const childBounds = children.map((child) => (0, jsx_1.getElementBounds)(child));
    const childrenBounds = (0, jsx_1.getElementsBounds)(children);
    // 容器尺寸和位置
    const containerX = props.x ?? childrenBounds.x;
    const containerY = props.y ?? childrenBounds.y;
    const containerWidth = props.width ?? childrenBounds.width;
    const containerHeight = props.height ?? childrenBounds.height;
    // 对齐子元素（使用相对于容器的坐标）
    const positionedChildren = children.map((child, index) => {
        const bounds = childBounds[index];
        const childProps = { ...child.props };
        // 水平对齐（相对于容器左边界）
        if (horizontal !== undefined) {
            switch (horizontal) {
                case 'left':
                    childProps.x = 0; // 相对容器
                    break;
                case 'center':
                    childProps.x = (containerWidth - bounds.width) / 2;
                    break;
                case 'right':
                    childProps.x = containerWidth - bounds.width;
                    break;
            }
        }
        else if (childProps.x === undefined) {
            // 保持相对位置
            childProps.x = bounds.x - containerX;
        }
        // 垂直对齐（相对于容器顶边界）
        if (vertical !== undefined) {
            switch (vertical) {
                case 'top':
                    childProps.y = 0;
                    break;
                case 'middle':
                    childProps.y = (containerHeight - bounds.height) / 2;
                    break;
                case 'bottom':
                    childProps.y = containerHeight - bounds.height;
                    break;
            }
        }
        else if (childProps.y === undefined) {
            // 保持相对位置
            childProps.y = bounds.y - containerY;
        }
        return (0, jsx_1.cloneElement)(child, childProps);
    });
    const containerProps = {
        ...props,
        x: containerX,
        y: containerY,
        width: containerWidth,
        height: containerHeight,
    };
    return (0, jsx_runtime_1.jsx)(jsx_1.Group, { ...containerProps, children: positionedChildren });
});
