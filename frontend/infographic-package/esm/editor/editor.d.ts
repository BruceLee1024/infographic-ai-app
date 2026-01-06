import type { ParsedInfographicOptions } from '../options';
import type { IEventEmitter } from '../types';
import { InteractionManager } from './managers';
import type { ICommandManager, IEditor, IPluginManager, IStateManager } from './types';
export declare class Editor implements IEditor {
    private emitter;
    private document;
    private options;
    state: IStateManager;
    commander: ICommandManager;
    plugin: IPluginManager;
    interaction: InteractionManager;
    constructor(emitter: IEventEmitter, document: SVGSVGElement, options: ParsedInfographicOptions);
    getDocument(): SVGSVGElement;
    destroy(): void;
}
