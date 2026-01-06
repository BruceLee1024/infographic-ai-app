"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RootSchema = exports.TemplateSchema = exports.DataSchema = exports.DesignSchema = exports.ThemeSchema = void 0;
const string = () => ({ kind: 'string' });
const number = () => ({ kind: 'number' });
// const boolean = (): SchemaNode => ({ kind: 'boolean' });
const enumOf = (values) => ({ kind: 'enum', values });
const color = (options = {}) => ({
    kind: 'color',
    soft: options.soft,
});
const array = (item, split = 'any') => ({
    kind: 'array',
    item,
    split,
});
const object = (fields, options = {}) => ({
    kind: 'object',
    fields,
    allowUnknown: options.allowUnknown,
    shorthandKey: options.shorthandKey,
});
const union = (...variants) => ({
    kind: 'union',
    variants,
});
const palette = () => ({ kind: 'palette' });
const nullableColorFields = {
    fill: color({ soft: true }),
    stroke: color({ soft: true }),
};
const textStyleSchema = object(nullableColorFields, { allowUnknown: true });
const shapeStyleSchema = object(nullableColorFields, { allowUnknown: true });
const itemDatumSchema = object({}, { allowUnknown: true });
itemDatumSchema.fields = {
    label: string(),
    value: union(number(), string()),
    desc: string(),
    icon: string(),
    children: array(itemDatumSchema),
};
exports.ThemeSchema = object({
    type: string(),
    name: string(), // 支持 theme.name 作为主题名称
    colorBg: color(),
    colorPrimary: color(),
    palette: palette(),
    title: textStyleSchema,
    desc: textStyleSchema,
    shape: shapeStyleSchema,
    base: object({
        global: object({}, { allowUnknown: true }),
        shape: shapeStyleSchema,
        text: textStyleSchema,
    }),
    item: object({
        icon: object({}, { allowUnknown: true }),
        label: textStyleSchema,
        desc: textStyleSchema,
        value: textStyleSchema,
        shape: shapeStyleSchema,
    }),
    stylize: object({
        type: enumOf(['rough', 'pattern']),
        roughness: number(),
        bowing: number(),
        fillWeight: number(),
        hachureGap: number(),
        pattern: string(),
        backgroundColor: color(),
        foregroundColor: color(),
        scale: number(),
    }, { shorthandKey: 'type' }),
    elements: object({}, { allowUnknown: true }),
}, { shorthandKey: 'type' });
const designNodeSchema = object({}, { allowUnknown: true, shorthandKey: 'type' });
exports.DesignSchema = object({
    structure: designNodeSchema,
    item: designNodeSchema,
    items: array(designNodeSchema),
    title: designNodeSchema,
});
exports.DataSchema = object({
    title: string(),
    desc: string(),
    items: array(itemDatumSchema),
});
exports.TemplateSchema = object({
    type: string(),
}, { shorthandKey: 'type' });
exports.RootSchema = object({
    template: exports.TemplateSchema,
    design: exports.DesignSchema,
    data: exports.DataSchema,
    theme: exports.ThemeSchema,
    width: union(number(), string()),
    height: union(number(), string()),
});
