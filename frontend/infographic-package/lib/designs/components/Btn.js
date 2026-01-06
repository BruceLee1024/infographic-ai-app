"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BtnRemove = exports.BtnAdd = void 0;
const jsx_runtime_1 = require("@antv/infographic/jsx-runtime");
const jsx_1 = require("../../jsx");
const BtnAdd = (props) => {
    const { indexes, ...restProps } = props;
    const defaultProps = {
        fill: '#B9EBCA',
        fillOpacity: 0.3,
        width: 20,
        height: 20,
        'data-indexes': indexes,
        'data-element-type': "btn-add" /* ElementTypeEnum.BtnAdd */,
    };
    return (0, jsx_runtime_1.jsx)(jsx_1.Rect, { ...defaultProps, ...restProps });
};
exports.BtnAdd = BtnAdd;
const BtnRemove = (props) => {
    const { indexes, ...restProps } = props;
    const defaultProps = {
        fill: '#F9C0C0',
        fillOpacity: 0.3,
        width: 20,
        height: 20,
        'data-indexes': indexes,
        'data-element-type': "btn-remove" /* ElementTypeEnum.BtnRemove */,
    };
    return (0, jsx_runtime_1.jsx)(jsx_1.Rect, { ...defaultProps, ...restProps });
};
exports.BtnRemove = BtnRemove;
