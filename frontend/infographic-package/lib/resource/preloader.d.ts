import type { ResourceConfig, ResourceScene } from './types';
type Resource = SVGElement;
/**
 * 预加载单个资源
 */
export declare function preloadResource(scene: ResourceScene, config: string | ResourceConfig): Promise<Resource | null>;
/**
 * 批量预加载资源（并行）
 */
export declare function preloadResources(resources: Array<{
    scene: ResourceScene;
    config: string | ResourceConfig;
}>): Promise<Map<string, Resource | null>>;
/**
 * 从预加载缓存获取资源
 */
export declare function getPreloadedResource(config: string | ResourceConfig): Resource | null;
/**
 * 检查资源是否已预加载
 */
export declare function isResourcePreloaded(config: string | ResourceConfig): boolean;
/**
 * 清除预加载缓存
 */
export declare function clearPreloadCache(): void;
/**
 * 获取预加载统计信息
 */
export declare function getPreloadStats(): {
    total: number;
    loaded: number;
    loading: number;
    error: number;
    pending: number;
};
export {};
