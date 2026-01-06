"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDatumByIndexes = getDatumByIndexes;
const get_1 = __importDefault(require("lodash-es/get"));
/**
 * 根据 indexesKey 获取数据项
 */
function getDatumByIndexes(data, indexes) {
    if (indexes.length === 0)
        return {};
    const base = Array.isArray(data) ? data[indexes[0]] : data.items[indexes[0]];
    if (indexes.length === 1)
        return base;
    const path = indexes
        .slice(1)
        .map((i) => `children[${i}]`)
        .join('.');
    return (0, get_1.default)(base, path);
}
