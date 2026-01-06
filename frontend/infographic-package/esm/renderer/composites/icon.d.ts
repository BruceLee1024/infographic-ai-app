import { ParsedInfographicOptions } from '../../options';
import { ResourceConfig } from '../../resource';
import type { DynamicAttributes } from '../../themes';
import type { IconAttributes, IconElement } from '../../types';
export declare function renderIcon(svg: SVGSVGElement, node: SVGElement, value: string | ResourceConfig | undefined, attrs?: DynamicAttributes<IconAttributes>): IconElement | null;
export declare function renderItemIcon(svg: SVGSVGElement, node: SVGElement, value: string | ResourceConfig | undefined, options: ParsedInfographicOptions): SVGGElement | null;
