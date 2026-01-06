import { jsx as _jsx } from "@antv/infographic/jsx-runtime";
import { Rect } from '../../jsx';
export const Illus = ({ indexes, ...props }) => {
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
    return _jsx(Rect, { ...finalProps });
};
