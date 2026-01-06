import type { IInteraction, InteractionInitOptions } from '../types';
import { Interaction } from './base';
export declare class ZoomWheel extends Interaction implements IInteraction {
    name: string;
    private wheelListener;
    init(options: InteractionInitOptions): void;
    destroy(): void;
}
