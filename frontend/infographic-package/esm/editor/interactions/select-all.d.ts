import type { IInteraction, InteractionInitOptions } from '../types';
import { Interaction } from './base';
/**
 * 全选交互
 * 支持 Ctrl/Cmd + A 全选所有可选元素
 */
export declare class SelectAll extends Interaction implements IInteraction {
    name: string;
    init(options: InteractionInitOptions): void;
    destroy(): void;
    private onKeyDown;
    private selectAll;
}
