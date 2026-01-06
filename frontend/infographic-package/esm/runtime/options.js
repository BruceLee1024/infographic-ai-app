import { BrushSelect, ClickSelect, DblClickEditText, DragElement, EditBar, HotkeyHistory, ResizeElement, SelectHighlight, ZoomWheel, } from '../editor';
const createDefaultPlugins = () => [new EditBar(), new ResizeElement()];
const createDefaultInteractions = () => [
    new DblClickEditText(),
    new BrushSelect(),
    new ClickSelect(),
    new DragElement(),
    new HotkeyHistory(),
    new ZoomWheel(),
    new SelectHighlight(),
];
export const DEFAULT_OPTIONS = {
    padding: 20,
    theme: 'light',
    themeConfig: {
        palette: 'antv',
    },
    get plugins() {
        return createDefaultPlugins();
    },
    get interactions() {
        return createDefaultInteractions();
    },
};
