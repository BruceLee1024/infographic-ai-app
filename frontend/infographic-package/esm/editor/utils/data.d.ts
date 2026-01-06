import type { Data, ItemDatum } from '../../types';
/**
 * 获取数据项的子数据
 */
export declare function getChildrenDataByIndexes(data: Data, indexes: number[]): ItemDatum[];
/**
 * Build lodash-style path for an item based on indexes.
 * Example: [1,2] -> data.items[1].children[2]
 */
export declare function buildItemPath(indexes: number[], prefix?: string): string;
