/**
 * 中文翻译映射
 * 用于将英文标识符翻译为中文显示名称
 */
export declare const TEMPLATE_NAMES: Record<string, string>;
export declare const STRUCTURE_NAMES: Record<string, string>;
export declare const ITEM_NAMES: Record<string, string>;
export declare const THEME_NAMES: Record<string, string>;
/**
 * 获取模板的中文名称
 */
export declare function getTemplateDisplayName(templateId: string): string;
/**
 * 获取结构的中文名称
 */
export declare function getStructureDisplayName(structureId: string): string;
/**
 * 获取数据项的中文名称
 */
export declare function getItemDisplayName(itemId: string): string;
/**
 * 获取主题的中文名称
 */
export declare function getThemeDisplayName(themeId: string): string;
