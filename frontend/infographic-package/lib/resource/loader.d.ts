import type { ResourceConfig, ResourceScene } from './types';
/**
 * load resource into svg defs
 * @returns resource ref id
 */
export declare function loadResource(svg: SVGSVGElement | null, scene: ResourceScene, config: string | ResourceConfig): Promise<string | null>;
