import type { Data, ItemDatum } from '../types';

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
export function diffData(oldData: Data, newData: Data): DiffResult {
  const changes: DiffChange[] = [];

  // 比较标题
  if (oldData.title !== newData.title) {
    changes.push({
      path: 'title',
      type: 'update',
      oldValue: oldData.title,
      newValue: newData.title,
    });
  }

  // 比较描述
  if (oldData.desc !== newData.desc) {
    changes.push({
      path: 'desc',
      type: 'update',
      oldValue: oldData.desc,
      newValue: newData.desc,
    });
  }

  // 比较数据项
  const itemChanges = diffItems(oldData.items || [], newData.items || []);
  changes.push(...itemChanges);

  // 比较插图
  if (JSON.stringify(oldData.illus) !== JSON.stringify(newData.illus)) {
    changes.push({
      path: 'illus',
      type: 'update',
      oldValue: oldData.illus,
      newValue: newData.illus,
    });
  }

  // 比较属性
  if (JSON.stringify(oldData.attributes) !== JSON.stringify(newData.attributes)) {
    changes.push({
      path: 'attributes',
      type: 'update',
      oldValue: oldData.attributes,
      newValue: newData.attributes,
    });
  }

  if (changes.length === 0) {
    return { type: 'none', changes: [] };
  }

  // 如果只有少量变化，可以增量更新
  const isPartial = changes.every((c) => {
    // 数据项的增删需要完整重渲染
    if (c.path.startsWith('items') && (c.type === 'add' || c.type === 'remove')) {
      return false;
    }
    return true;
  });

  return {
    type: isPartial ? 'partial' : 'full',
    changes,
  };
}

/**
 * 比较数据项数组
 */
function diffItems(
  oldItems: ItemDatum[],
  newItems: ItemDatum[],
  parentIndexes: number[] = [],
): DiffChange[] {
  const changes: DiffChange[] = [];

  const maxLen = Math.max(oldItems.length, newItems.length);

  for (let i = 0; i < maxLen; i++) {
    const indexes = [...parentIndexes, i];
    const oldItem = oldItems[i];
    const newItem = newItems[i];

    if (!oldItem && newItem) {
      // 新增
      changes.push({
        path: `items[${indexes.join('][')}]`,
        type: 'add',
        indexes,
        newValue: newItem,
      });
    } else if (oldItem && !newItem) {
      // 删除
      changes.push({
        path: `items[${indexes.join('][')}]`,
        type: 'remove',
        indexes,
        oldValue: oldItem,
      });
    } else if (oldItem && newItem) {
      // 比较单个项
      const itemChanges = diffSingleItem(oldItem, newItem, indexes);
      changes.push(...itemChanges);
    }
  }

  return changes;
}

/**
 * 比较单个数据项
 */
function diffSingleItem(
  oldItem: ItemDatum,
  newItem: ItemDatum,
  indexes: number[],
): DiffChange[] {
  const changes: DiffChange[] = [];
  const basePath = `items[${indexes.join('][')}]`;

  // 比较基本字段
  const fields: (keyof ItemDatum)[] = ['label', 'desc', 'value', 'icon', 'illus'];

  for (const field of fields) {
    if (oldItem[field] !== newItem[field]) {
      changes.push({
        path: `${basePath}.${field}`,
        type: 'update',
        indexes,
        oldValue: oldItem[field],
        newValue: newItem[field],
      });
    }
  }

  // 比较属性
  if (JSON.stringify(oldItem.attributes) !== JSON.stringify(newItem.attributes)) {
    changes.push({
      path: `${basePath}.attributes`,
      type: 'update',
      indexes,
      oldValue: oldItem.attributes,
      newValue: newItem.attributes,
    });
  }

  // 递归比较子项
  if (oldItem.children || newItem.children) {
    const childChanges = diffItems(
      oldItem.children || [],
      newItem.children || [],
      indexes,
    );
    changes.push(...childChanges);
  }

  return changes;
}

/**
 * 根据差异结果判断是否需要完整重渲染
 */
export function needsFullRerender(diff: DiffResult): boolean {
  return diff.type === 'full';
}

/**
 * 获取需要更新的元素选择器
 */
export function getUpdateSelectors(changes: DiffChange[]): string[] {
  const selectors: string[] = [];

  for (const change of changes) {
    if (change.path === 'title') {
      selectors.push('[data-element-type="title"]');
    } else if (change.path === 'desc') {
      selectors.push('[data-element-type="desc"]');
    } else if (change.path.startsWith('items[')) {
      const indexes = change.indexes;
      if (indexes) {
        const indexStr = indexes.join('-');
        // 选择该索引下的所有元素
        selectors.push(`[data-indexes="${indexStr}"]`);
        // 也选择以该索引开头的子元素
        selectors.push(`[data-indexes^="${indexStr}-"]`);
      }
    } else if (change.path === 'illus') {
      selectors.push('[data-element-type="illus"]');
    }
  }

  return [...new Set(selectors)];
}
