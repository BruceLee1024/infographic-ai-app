"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseSyntax = parseSyntax;
const mapper_1 = require("./mapper");
const parser_1 = require("./parser");
const schema_1 = require("./schema");
function resolveTemplate(node, errors) {
    if (!node)
        return undefined;
    const mapped = (0, mapper_1.mapWithSchema)(node, schema_1.TemplateSchema, 'template', errors);
    if (!mapped)
        return undefined;
    if (typeof mapped === 'string')
        return mapped;
    if (typeof mapped === 'object' && typeof mapped.type === 'string') {
        return mapped.type;
    }
    return undefined;
}
function parseSyntax(input) {
    const { ast, errors } = (0, parser_1.parseSyntaxToAst)(input);
    const warnings = [];
    const options = {};
    const mergedEntries = { ...ast.entries };
    const infographicNode = ast.entries.infographic;
    let templateFromInfographic;
    if (infographicNode && infographicNode.kind === 'object') {
        if (infographicNode.value)
            templateFromInfographic = infographicNode.value;
        Object.entries(infographicNode.entries).forEach(([key, value]) => {
            if (!(key in mergedEntries))
                mergedEntries[key] = value;
        });
    }
    const allowedRootKeys = new Set([
        'infographic',
        'template',
        'design',
        'data',
        'theme',
        'width',
        'height',
    ]);
    Object.keys(mergedEntries).forEach((key) => {
        if (!allowedRootKeys.has(key)) {
            errors.push({
                path: key,
                line: mergedEntries[key].line,
                code: 'unknown_key',
                message: 'Unknown top-level key.',
                raw: key,
            });
        }
    });
    const templateNode = mergedEntries.template;
    const templateValue = resolveTemplate(templateNode, errors);
    if (templateValue)
        options.template = templateValue;
    if (!options.template && templateFromInfographic) {
        options.template = templateFromInfographic;
    }
    const designNode = mergedEntries.design;
    if (designNode) {
        const design = (0, mapper_1.mapWithSchema)(designNode, schema_1.DesignSchema, 'design', errors);
        if (design)
            options.design = design;
    }
    const dataNode = mergedEntries.data;
    if (dataNode) {
        const data = (0, mapper_1.mapWithSchema)(dataNode, schema_1.DataSchema, 'data', errors);
        if (data)
            options.data = data;
    }
    const themeNode = mergedEntries.theme;
    if (themeNode) {
        const theme = (0, mapper_1.mapWithSchema)(themeNode, schema_1.ThemeSchema, 'theme', errors);
        if (theme && typeof theme === 'object') {
            const { type, name, ...rest } = theme;
            // 支持 type 或 name 作为主题名称
            const themeName = type || name;
            if (typeof themeName === 'string' && themeName)
                options.theme = themeName;
            if (Object.keys(rest).length > 0) {
                options.themeConfig = rest;
            }
        }
    }
    const widthNode = mergedEntries.width;
    if (widthNode) {
        const width = (0, mapper_1.mapWithSchema)(widthNode, schema_1.RootSchema.fields.width, 'width', errors);
        if (width !== undefined)
            options.width = width;
    }
    const heightNode = mergedEntries.height;
    if (heightNode) {
        const height = (0, mapper_1.mapWithSchema)(heightNode, schema_1.RootSchema.fields.height, 'height', errors);
        if (height !== undefined)
            options.height = height;
    }
    return {
        options,
        errors,
        warnings,
        ast,
    };
}
