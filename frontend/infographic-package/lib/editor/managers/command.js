"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommandManager = void 0;
const commands_1 = require("../commands");
class CommandManager {
    constructor() {
        this.undoStack = [];
        this.redoStack = [];
        // 命令合并配置
        this.mergeEnabled = true;
    }
    init(options) {
        Object.assign(this, options);
    }
    /**
     * 启用/禁用命令合并
     */
    setMergeEnabled(enabled) {
        this.mergeEnabled = enabled;
    }
    async execute(command) {
        await command.apply(this.state);
        // 尝试合并命令
        if (this.mergeEnabled && this.tryMergeCommand(command)) {
            this.emitHistoryChange('execute');
            return;
        }
        this.undoStack.push(command);
        this.redoStack = [];
        this.emitHistoryChange('execute');
    }
    /**
     * 尝试将新命令与栈顶命令合并
     */
    tryMergeCommand(command) {
        if (this.undoStack.length === 0)
            return false;
        const lastCommand = this.undoStack[this.undoStack.length - 1];
        // 检查是否为可合并的文本命令
        if (command instanceof commands_1.MergeableTextCommand &&
            lastCommand instanceof commands_1.MergeableTextCommand) {
            if (command.canMergeWith(lastCommand)) {
                // 合并命令
                const merged = lastCommand.mergeWith(command);
                this.undoStack[this.undoStack.length - 1] = merged;
                this.redoStack = [];
                return true;
            }
        }
        return false;
    }
    async executeBatch(commands) {
        if (commands.length === 0)
            return;
        const batchCommand = new commands_1.BatchCommand(commands);
        await this.execute(batchCommand);
    }
    async undo() {
        const command = this.undoStack.pop();
        if (command) {
            await command.undo(this.state);
            this.redoStack.push(command);
            this.emitHistoryChange('undo');
        }
    }
    async redo() {
        const command = this.redoStack.pop();
        if (command) {
            await command.apply(this.state);
            this.undoStack.push(command);
            this.emitHistoryChange('redo');
        }
    }
    serialize() {
        return this.undoStack.map((cmd) => cmd.serialize());
    }
    clear() {
        this.undoStack = [];
        this.redoStack = [];
    }
    canUndo() {
        return this.undoStack.length > 0;
    }
    canRedo() {
        return this.redoStack.length > 0;
    }
    getHistorySize() {
        return this.undoStack.length;
    }
    destroy() {
        this.clear();
    }
    emitHistoryChange(action) {
        this.emitter?.emit('history:change', {
            type: 'history:change',
            action,
        });
    }
}
exports.CommandManager = CommandManager;
