interface FontFaceAttributes {
    'font-family': string;
    src: string;
    'font-style': string;
    'font-display': string;
    'font-weight': string;
    'unicode-range': string;
}
export declare function embedFonts(svg: SVGSVGElement, embedResources?: boolean): Promise<void>;
/**
 * 解析给定 font-family 对应的 CSS @font-face
 */
export declare function parseFontFamily(fontFamily: string): Promise<Partial<FontFaceAttributes>[]>;
/**
 * 从 document.fonts 中获取给定 family 且已加载的 FontFace
 */
export declare function getActualLoadedFontFace(fontFamily: string): FontFace[];
export {};
