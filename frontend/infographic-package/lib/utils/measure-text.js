"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.measureText = measureText;
const measury_1 = require("measury");
const AlibabaPuHuiTi_Regular_1 = __importDefault(require("measury/fonts/AlibabaPuHuiTi-Regular"));
const renderer_1 = require("../renderer");
(0, measury_1.registerFont)(AlibabaPuHuiTi_Regular_1.default);
function measureText(text = '', attrs) {
    if (attrs.width && attrs.height) {
        return { width: attrs.width, height: attrs.height };
    }
    let width = 0;
    let height = 0;
    const { fontFamily = renderer_1.DEFAULT_FONT, fontSize = 14, fontWeight = 'normal', lineHeight = 1.4, } = attrs;
    const metrics = (0, measury_1.measureText)(text.toString(), {
        fontFamily,
        fontSize: +fontSize,
        fontWeight,
        lineHeight,
    });
    // 额外添加 1% 宽高
    width || (width = Math.ceil(metrics.width * 1.01));
    height || (height = Math.ceil(metrics.height * 1.01));
    return { width, height };
}
