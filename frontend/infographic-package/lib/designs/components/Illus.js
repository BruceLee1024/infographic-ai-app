"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Illus = void 0;
const jsx_runtime_1 = require("@antv/infographic/jsx-runtime");
const jsx_1 = require("../../jsx");
const Illus = ({ indexes, ...props }) => {
    const defaultProps = {
        fill: 'lightgray',
    };
    const finalProps = { ...defaultProps, ...props };
    if (indexes) {
        finalProps['data-indexes'] = indexes;
        finalProps['data-element-type'] = "item-illus" /* ElementTypeEnum.ItemIllus */;
    }
    else {
        finalProps['data-element-type'] = "illus" /* ElementTypeEnum.Illus */;
    }
    return (0, jsx_runtime_1.jsx)(jsx_1.Rect, { ...finalProps });
};
exports.Illus = Illus;
