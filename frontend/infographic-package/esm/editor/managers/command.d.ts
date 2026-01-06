import type { CommandManagerInitOptions, ICommand, ICommandManager } from '../types';
export declare class CommandManager implements ICommandManager {
    private emitter;
    private state;
    private undoStack;
    private redoStack;
    private mergeEnabled;
    init(options: CommandManagerInitOptions): void;
    /**
     * 启用/禁用命令合并
     */
    setMergeEnabled(enabled: boolean): void;
    execute(command: ICommand): Promise<void>;
    /**
     * 尝试将新命令与栈顶命令合并
     */
    private tryMergeCommand;
    executeBatch(commands: ICommand[]): Promise<void>;
    undo(): Promise<void>;
    redo(): Promise<void>;
    serialize(): any[];
    clear(): void;
    canUndo(): boolean;
    canRedo(): boolean;
    getHistorySize(): number;
    destroy(): void;
    private emitHistoryChange;
}
