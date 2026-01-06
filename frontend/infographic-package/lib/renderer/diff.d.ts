import type { Data } from '../types';
export interface DiffResult {
    type: 'none' | 'partial' | 'full';
    changes: DiffChange[];
}
export interface DiffChange {
    path: string;
    type: 'add' | 'remove' | 'update';
    indexes?: number[];
    oldValue?: any;
    newValue?: any;
}
/**
 * 比较两个数据对象，返回差异
 */
export declare function diffData(oldData: Data, newData: Data): DiffResult;
/**
 * 根据差异结果判断是否需要完整重渲染
 */
export declare function needsFullRerender(diff: DiffResult): boolean;
/**
 * 获取需要更新的元素选择器
 */
export declare function getUpdateSelectors(changes: DiffChange[]): string[];
