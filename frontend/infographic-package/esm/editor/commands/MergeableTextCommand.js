import { getElementRole, getTextContent, setTextContent } from '../../utils';
import { getIndexesFromElement } from '../utils';
/**
 * 可合并的文本更新命令
 * 连续的文本编辑会被合并为一个命令，避免撤销栈过长
 */
export class MergeableTextCommand {
    constructor(element, newText, originalText, timestamp) {
        this.element = element;
        this.originalText = originalText ?? getTextContent(element);
        this.modifiedText = newText;
        this.timestamp = timestamp ?? Date.now();
        this.elementId = element.id || '';
    }
    /**
     * 检查是否可以与另一个命令合并
     */
    canMergeWith(other) {
        if (!(other instanceof MergeableTextCommand))
            return false;
        // 必须是同一个元素
        if (this.elementId !== other.elementId)
            return false;
        // 必须在时间窗口内
        const timeDiff = Math.abs(this.timestamp - other.timestamp);
        if (timeDiff > MergeableTextCommand.MERGE_WINDOW)
            return false;
        return true;
    }
    /**
     * 合并另一个命令到当前命令
     * 保留最早的 originalText 和最新的 modifiedText
     */
    mergeWith(other) {
        const isOtherNewer = other.timestamp > this.timestamp;
        return new MergeableTextCommand(this.element, isOtherNewer ? other.modifiedText : this.modifiedText, isOtherNewer ? this.originalText : other.originalText, isOtherNewer ? other.timestamp : this.timestamp);
    }
    async apply(state) {
        if (this.originalText === this.modifiedText)
            return;
        setTextContent(this.element, this.modifiedText);
        updateItemText(state, this.element, this.modifiedText);
    }
    async undo(state) {
        if (this.originalText === this.modifiedText)
            return;
        setTextContent(this.element, this.originalText);
        updateItemText(state, this.element, this.originalText);
    }
    serialize() {
        return {
            type: 'mergeable-text',
            elementId: this.elementId,
            original: this.originalText,
            modified: this.modifiedText,
            timestamp: this.timestamp,
        };
    }
    getTimestamp() {
        return this.timestamp;
    }
    getElementId() {
        return this.elementId;
    }
}
// 合并时间窗口（毫秒）
MergeableTextCommand.MERGE_WINDOW = 1000;
function updateItemText(state, element, text) {
    const role = getElementRole(element);
    if (role.startsWith('item-')) {
        const key = role.replace('item-', '');
        const indexes = getIndexesFromElement(element);
        state.updateItemDatum(indexes, { [key]: text });
    }
    else {
        state.updateData(role, text);
    }
}
