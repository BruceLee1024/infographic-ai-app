"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseOptions = parseOptions;
const lodash_es_1 = require("lodash-es");
const designs_1 = require("../designs");
const renderer_1 = require("../renderer");
const themes_1 = require("../themes");
const utils_1 = require("../utils");
function parseOptions(options) {
    const { container = '#container', padding = 0, template, design, theme, themeConfig, ...restOptions } = options;
    const parsedContainer = typeof container === 'string'
        ? document.querySelector(container) || document.createElement('div')
        : container;
    const templateOptions = template
        ? (0, designs_1.getTemplate)(template)
        : undefined;
    const mergedThemeConfig = (0, lodash_es_1.merge)({}, templateOptions?.themeConfig, themeConfig);
    const resolvedThemeConfig = theme || themeConfig || templateOptions?.themeConfig
        ? parseTheme(theme, mergedThemeConfig)
        : undefined;
    const parsed = {
        container: parsedContainer,
        padding: (0, utils_1.parsePadding)(padding),
    };
    if (templateOptions) {
        const { design: templateDesign, ...restTemplateOptions } = templateOptions;
        Object.assign(parsed, restTemplateOptions);
    }
    Object.assign(parsed, restOptions);
    if (template)
        parsed.template = template;
    if (templateOptions?.design || design) {
        const parsedDesign = parseDesign({ ...templateOptions?.design, ...design }, resolvedThemeConfig
            ? { ...options, themeConfig: resolvedThemeConfig }
            : options);
        if ((0, utils_1.isNonNullableParsedDesignsOptions)(parsedDesign)) {
            parsed.design = parsedDesign;
        }
    }
    if (theme)
        parsed.theme = theme;
    if (resolvedThemeConfig) {
        parsed.themeConfig = resolvedThemeConfig;
    }
    return parsed;
}
function normalizeWithType(obj) {
    if (typeof obj === 'string')
        return { type: obj };
    if (!('type' in obj))
        throw new Error('Type is required');
    return obj;
}
function parseDesign(config, options) {
    const { structure, title, item, items } = config || {};
    const defaultItem = parseDesignItem(item || items?.[0], options);
    return {
        structure: parseDesignStructure(structure),
        title: parseDesignTitle(title, options),
        item: defaultItem,
        items: !items
            ? [defaultItem]
            : items.map((item) => parseDesignItem(item, options)),
    };
}
function parseDesignStructure(config) {
    if (!config)
        return null;
    const { type, ...userProps } = normalizeWithType(config);
    const structure = (0, designs_1.getStructure)(type);
    if (!structure)
        return null;
    const { component } = structure;
    return {
        ...structure,
        component: (props) => component({ ...props, ...userProps }),
    };
}
function parseDesignTitle(config, options) {
    if (!config)
        return { component: null };
    const { type, ...userProps } = normalizeWithType(config);
    const { themeConfig } = options;
    const background = themeConfig?.colorBg || '#fff';
    const themeColors = generateColors(background, background);
    // use default title for now
    return {
        component: (props) => (0, designs_1.Title)({ ...props, themeColors, ...userProps }),
    };
}
function parseDesignItem(config, options) {
    if (!config)
        return null;
    const { type, ...userProps } = normalizeWithType(config);
    const item = (0, designs_1.getItem)(type);
    if (!item)
        return null;
    const { component, options: itemOptions } = item;
    return {
        ...item,
        component: (props) => {
            const { indexes } = props;
            const { data, themeConfig } = options;
            const background = themeConfig?.colorBg || '#fff';
            const { themeColors = generateColors((0, renderer_1.getPaletteColor)(themeConfig?.palette, indexes, data?.items?.length) ||
                themeConfig?.colorPrimary ||
                '#FF356A', background), ...restProps } = props;
            return component({
                themeColors,
                ...restProps,
                ...userProps,
            });
        },
        options: itemOptions,
    };
}
function parseTheme(theme, themeConfig = {}) {
    const base = theme ? (0, themes_1.getTheme)(theme) || {} : {};
    const parsedThemeConfig = (0, lodash_es_1.merge)({}, base, themeConfig);
    parsedThemeConfig.palette = themeConfig.palette || base.palette;
    parsedThemeConfig.stylize = themeConfig.stylize ?? base.stylize;
    if (!parsedThemeConfig.colorPrimary) {
        parsedThemeConfig.colorPrimary = '#FF356A';
    }
    if (!parsedThemeConfig.palette) {
        parsedThemeConfig.palette = [parsedThemeConfig.colorPrimary];
    }
    return parsedThemeConfig;
}
function generateColors(colorPrimary, background = '#fff') {
    return (0, themes_1.generateThemeColors)({
        colorPrimary,
        isDarkMode: (0, utils_1.isDarkColor)(background),
        colorBg: background,
    });
}
