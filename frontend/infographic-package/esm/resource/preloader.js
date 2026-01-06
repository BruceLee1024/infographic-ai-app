import { getResourceId, parseResourceConfig } from './utils';
import { loadImageBase64Resource, loadRemoteResource, loadSearchResource, loadSVGResource, } from './loaders';
import { getCustomResourceLoader } from './registry';
// 预加载缓存
const PRELOAD_CACHE = new Map();
// 并发控制
const MAX_CONCURRENT_LOADS = 6;
let currentLoading = 0;
const loadQueue = [];
function processQueue() {
    while (loadQueue.length > 0 && currentLoading < MAX_CONCURRENT_LOADS) {
        const next = loadQueue.shift();
        if (next) {
            currentLoading++;
            next();
        }
    }
}
function enqueue(fn) {
    return new Promise((resolve, reject) => {
        const execute = async () => {
            try {
                const result = await fn();
                resolve(result);
            }
            catch (error) {
                reject(error);
            }
            finally {
                currentLoading--;
                processQueue();
            }
        };
        if (currentLoading < MAX_CONCURRENT_LOADS) {
            currentLoading++;
            execute();
        }
        else {
            loadQueue.push(execute);
        }
    });
}
async function loadResourceInternal(scene, config) {
    const cfg = parseResourceConfig(config);
    if (!cfg)
        return null;
    cfg.scene || (cfg.scene = scene);
    const { source, data, format, encoding } = cfg;
    if (source === 'inline') {
        const isDataURI = data.startsWith('data:');
        if (format === 'svg' && encoding === 'raw') {
            return loadSVGResource(data);
        }
        if (format === 'svg' && isDataURI) {
            return await loadImageBase64Resource(data);
        }
        if (isDataURI || format === 'image') {
            return await loadImageBase64Resource(data);
        }
        return loadSVGResource(data);
    }
    else if (source === 'remote') {
        return await loadRemoteResource(data, format);
    }
    else if (source === 'search') {
        return await loadSearchResource(data, format);
    }
    else {
        const customLoader = getCustomResourceLoader();
        if (customLoader)
            return await customLoader(cfg);
    }
    return null;
}
/**
 * 预加载单个资源
 */
export function preloadResource(scene, config) {
    const cfg = parseResourceConfig(config);
    if (!cfg)
        return Promise.resolve(null);
    const id = getResourceId(cfg);
    if (!id)
        return Promise.resolve(null);
    // 已经加载完成
    const cached = PRELOAD_CACHE.get(id);
    if (cached) {
        if (cached.status === 'loaded') {
            return Promise.resolve(cached.resource);
        }
        if (cached.status === 'loading' && cached.promise) {
            return cached.promise;
        }
        if (cached.status === 'error') {
            return Promise.resolve(null);
        }
    }
    // 创建新的加载任务
    const entry = {
        status: 'loading',
        resource: null,
        promise: null,
    };
    entry.promise = enqueue(async () => {
        try {
            const resource = await loadResourceInternal(scene, cfg);
            entry.status = 'loaded';
            entry.resource = resource;
            return resource;
        }
        catch (error) {
            entry.status = 'error';
            entry.error = error;
            return null;
        }
    });
    PRELOAD_CACHE.set(id, entry);
    return entry.promise;
}
/**
 * 批量预加载资源（并行）
 */
export async function preloadResources(resources) {
    const results = new Map();
    const promises = resources.map(async ({ scene, config }) => {
        const cfg = parseResourceConfig(config);
        if (!cfg)
            return;
        const id = getResourceId(cfg);
        if (!id)
            return;
        const resource = await preloadResource(scene, config);
        results.set(id, resource);
    });
    await Promise.all(promises);
    return results;
}
/**
 * 从预加载缓存获取资源
 */
export function getPreloadedResource(config) {
    const cfg = parseResourceConfig(config);
    if (!cfg)
        return null;
    const id = getResourceId(cfg);
    if (!id)
        return null;
    const cached = PRELOAD_CACHE.get(id);
    if (cached?.status === 'loaded') {
        return cached.resource;
    }
    return null;
}
/**
 * 检查资源是否已预加载
 */
export function isResourcePreloaded(config) {
    const cfg = parseResourceConfig(config);
    if (!cfg)
        return false;
    const id = getResourceId(cfg);
    if (!id)
        return false;
    const cached = PRELOAD_CACHE.get(id);
    return cached?.status === 'loaded';
}
/**
 * 清除预加载缓存
 */
export function clearPreloadCache() {
    PRELOAD_CACHE.clear();
}
/**
 * 获取预加载统计信息
 */
export function getPreloadStats() {
    let loaded = 0;
    let loading = 0;
    let error = 0;
    let pending = 0;
    PRELOAD_CACHE.forEach((entry) => {
        switch (entry.status) {
            case 'loaded':
                loaded++;
                break;
            case 'loading':
                loading++;
                break;
            case 'error':
                error++;
                break;
            case 'pending':
                pending++;
                break;
        }
    });
    return {
        total: PRELOAD_CACHE.size,
        loaded,
        loading,
        error,
        pending,
    };
}
