import type { Data, ItemDatum } from '../types';
/**
 * 根据 indexesKey 获取数据项
 */
export declare function getDatumByIndexes(data: Data | Data['items'], indexes: number[]): ItemDatum;
