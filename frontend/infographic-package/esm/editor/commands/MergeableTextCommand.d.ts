import type { TextElement } from '../../types';
import type { ICommand, IStateManager } from '../types';
/**
 * 可合并的文本更新命令
 * 连续的文本编辑会被合并为一个命令，避免撤销栈过长
 */
export declare class MergeableTextCommand implements ICommand {
    private element;
    private originalText;
    private modifiedText;
    private timestamp;
    private elementId;
    static MERGE_WINDOW: number;
    constructor(element: TextElement, newText: string, originalText?: string, timestamp?: number);
    /**
     * 检查是否可以与另一个命令合并
     */
    canMergeWith(other: ICommand): boolean;
    /**
     * 合并另一个命令到当前命令
     * 保留最早的 originalText 和最新的 modifiedText
     */
    mergeWith(other: MergeableTextCommand): MergeableTextCommand;
    apply(state: IStateManager): Promise<void>;
    undo(state: IStateManager): Promise<void>;
    serialize(): {
        type: string;
        elementId: string;
        original: string;
        modified: string;
        timestamp: number;
    };
    getTimestamp(): number;
    getElementId(): string;
}
