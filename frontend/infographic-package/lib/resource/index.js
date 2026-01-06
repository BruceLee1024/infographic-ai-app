"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseResourceConfig = exports.getResourceId = exports.getResourceHref = exports.registerResourceLoader = exports.preloadResources = exports.preloadResource = exports.isResourcePreloaded = exports.getPreloadStats = exports.getPreloadedResource = exports.clearPreloadCache = exports.loadResource = void 0;
var loader_1 = require("./loader");
Object.defineProperty(exports, "loadResource", { enumerable: true, get: function () { return loader_1.loadResource; } });
__exportStar(require("./loaders"), exports);
var preloader_1 = require("./preloader");
Object.defineProperty(exports, "clearPreloadCache", { enumerable: true, get: function () { return preloader_1.clearPreloadCache; } });
Object.defineProperty(exports, "getPreloadedResource", { enumerable: true, get: function () { return preloader_1.getPreloadedResource; } });
Object.defineProperty(exports, "getPreloadStats", { enumerable: true, get: function () { return preloader_1.getPreloadStats; } });
Object.defineProperty(exports, "isResourcePreloaded", { enumerable: true, get: function () { return preloader_1.isResourcePreloaded; } });
Object.defineProperty(exports, "preloadResource", { enumerable: true, get: function () { return preloader_1.preloadResource; } });
Object.defineProperty(exports, "preloadResources", { enumerable: true, get: function () { return preloader_1.preloadResources; } });
var registry_1 = require("./registry");
Object.defineProperty(exports, "registerResourceLoader", { enumerable: true, get: function () { return registry_1.registerResourceLoader; } });
var utils_1 = require("./utils");
Object.defineProperty(exports, "getResourceHref", { enumerable: true, get: function () { return utils_1.getResourceHref; } });
Object.defineProperty(exports, "getResourceId", { enumerable: true, get: function () { return utils_1.getResourceId; } });
Object.defineProperty(exports, "parseResourceConfig", { enumerable: true, get: function () { return utils_1.parseResourceConfig; } });
