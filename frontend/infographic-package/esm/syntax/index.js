import { mapWithSchema } from './mapper';
import { parseSyntaxToAst } from './parser';
import { DataSchema, DesignSchema, RootSchema, TemplateSchema, ThemeSchema, } from './schema';
function resolveTemplate(node, errors) {
    if (!node)
        return undefined;
    const mapped = mapWithSchema(node, TemplateSchema, 'template', errors);
    if (!mapped)
        return undefined;
    if (typeof mapped === 'string')
        return mapped;
    if (typeof mapped === 'object' && typeof mapped.type === 'string') {
        return mapped.type;
    }
    return undefined;
}
export function parseSyntax(input) {
    const { ast, errors } = parseSyntaxToAst(input);
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
        const design = mapWithSchema(designNode, DesignSchema, 'design', errors);
        if (design)
            options.design = design;
    }
    const dataNode = mergedEntries.data;
    if (dataNode) {
        const data = mapWithSchema(dataNode, DataSchema, 'data', errors);
        if (data)
            options.data = data;
    }
    const themeNode = mergedEntries.theme;
    if (themeNode) {
        const theme = mapWithSchema(themeNode, ThemeSchema, 'theme', errors);
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
        const width = mapWithSchema(widthNode, RootSchema.fields.width, 'width', errors);
        if (width !== undefined)
            options.width = width;
    }
    const heightNode = mergedEntries.height;
    if (heightNode) {
        const height = mapWithSchema(heightNode, RootSchema.fields.height, 'height', errors);
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
