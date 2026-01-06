import type { Padding, ParsedPadding } from '../types';
export declare function parsePadding(padding: Padding | undefined): ParsedPadding;
export declare function setSVGPadding(svg: SVGSVGElement, padding: ParsedPadding): void;
