"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loadResource = loadResource;
const utils_1 = require("../utils");
const loaders_1 = require("./loaders");
const registry_1 = require("./registry");
const utils_2 = require("./utils");
async function getResource(scene, config) {
    const cfg = (0, utils_2.parseResourceConfig)(config);
    if (!cfg)
        return null;
    cfg.scene || (cfg.scene = scene);
    const { source, data, format, encoding } = cfg;
    if (source === 'inline') {
        const isDataURI = data.startsWith('data:');
        if (format === 'svg' && encoding === 'raw') {
            return (0, loaders_1.loadSVGResource)(data);
        }
        if (format === 'svg' && isDataURI) {
            return await (0, loaders_1.loadImageBase64Resource)(data);
        }
        if (isDataURI || format === 'image') {
            return await (0, loaders_1.loadImageBase64Resource)(data);
        }
        return (0, loaders_1.loadSVGResource)(data);
    }
    else if (source === 'remote') {
        return await (0, loaders_1.loadRemoteResource)(data, format);
    }
    else if (source === 'search') {
        return await (0, loaders_1.loadSearchResource)(data, format);
    }
    else {
        const customLoader = (0, registry_1.getCustomResourceLoader)();
        if (customLoader)
            return await customLoader(cfg);
    }
    return null;
}
const RESOURCE_MAP = new Map();
const RESOURCE_LOAD_MAP = new WeakMap();
/**
 * load resource into svg defs
 * @returns resource ref id
 */
async function loadResource(svg, scene, config) {
    if (!svg)
        return null;
    const cfg = (0, utils_2.parseResourceConfig)(config);
    if (!cfg)
        return null;
    const id = (0, utils_2.getResourceId)(cfg);
    const resource = RESOURCE_MAP.has(id)
        ? RESOURCE_MAP.get(id) || null
        : await getResource(scene, cfg);
    if (!resource)
        return null;
    if (!RESOURCE_LOAD_MAP.has(svg))
        RESOURCE_LOAD_MAP.set(svg, new Map());
    const map = RESOURCE_LOAD_MAP.get(svg);
    if (map.has(id))
        return id;
    const defs = (0, utils_1.getOrCreateDefs)(svg);
    resource.id = id;
    defs.appendChild(resource);
    map.set(id, resource);
    return id;
}
