import { jsx as _jsx } from "@antv/infographic/jsx-runtime";
export const DropShadow = (props) => {
    const { color = 'black', opacity = 0.8, ...restProps } = props;
    return (_jsx("filter", { id: "drop-shadow", x: "-25%", y: "-25%", width: "200%", height: "200%", ...restProps, children: _jsx("feDropShadow", { dx: "4", dy: "4", stdDeviation: "4", "flood-color": color, "flood-opacity": opacity }) }));
};
