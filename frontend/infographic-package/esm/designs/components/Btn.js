import { jsx as _jsx } from "@antv/infographic/jsx-runtime";
import { Rect } from '../../jsx';
export const BtnAdd = (props) => {
    const { indexes, ...restProps } = props;
    const defaultProps = {
        fill: '#B9EBCA',
        fillOpacity: 0.3,
        width: 20,
        height: 20,
        'data-indexes': indexes,
        'data-element-type': "btn-add" /* ElementTypeEnum.BtnAdd */,
    };
    return _jsx(Rect, { ...defaultProps, ...restProps });
};
export const BtnRemove = (props) => {
    const { indexes, ...restProps } = props;
    const defaultProps = {
        fill: '#F9C0C0',
        fillOpacity: 0.3,
        width: 20,
        height: 20,
        'data-indexes': indexes,
        'data-element-type': "btn-remove" /* ElementTypeEnum.BtnRemove */,
    };
    return _jsx(Rect, { ...defaultProps, ...restProps });
};
