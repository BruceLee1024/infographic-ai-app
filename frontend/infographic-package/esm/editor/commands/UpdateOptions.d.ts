import type { ParsedInfographicOptions } from '../../options';
import type { ICommand, IStateManager } from '../types';
export declare class UpdateOptionsCommand implements ICommand {
    private options;
    private original?;
    constructor(options: Partial<ParsedInfographicOptions>, original?: ParsedInfographicOptions | undefined);
    apply(state: IStateManager): Promise<void>;
    undo(state: IStateManager): Promise<void>;
    serialize(): {
        type: string;
        options: Partial<ParsedInfographicOptions>;
        original: ParsedInfographicOptions | undefined;
    };
}
