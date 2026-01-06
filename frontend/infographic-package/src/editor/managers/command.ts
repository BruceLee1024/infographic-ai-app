import type { IEventEmitter } from '../../types';
import { BatchCommand, MergeableTextCommand } from '../commands';
import type {
  CommandManagerInitOptions,
  ICommand,
  ICommandManager,
  IStateManager,
} from '../types';

export class CommandManager implements ICommandManager {
  private emitter!: IEventEmitter;
  private state!: IStateManager;
  private undoStack: ICommand[] = [];
  private redoStack: ICommand[] = [];

  // 命令合并配置
  private mergeEnabled: boolean = true;

  init(options: CommandManagerInitOptions) {
    Object.assign(this, options);
  }

  /**
   * 启用/禁用命令合并
   */
  setMergeEnabled(enabled: boolean) {
    this.mergeEnabled = enabled;
  }

  async execute(command: ICommand) {
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
  private tryMergeCommand(command: ICommand): boolean {
    if (this.undoStack.length === 0) return false;

    const lastCommand = this.undoStack[this.undoStack.length - 1];

    // 检查是否为可合并的文本命令
    if (
      command instanceof MergeableTextCommand &&
      lastCommand instanceof MergeableTextCommand
    ) {
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

  async executeBatch(commands: ICommand[]) {
    if (commands.length === 0) return;

    const batchCommand = new BatchCommand(commands);
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

  serialize(): any[] {
    return this.undoStack.map((cmd) => cmd.serialize());
  }

  clear() {
    this.undoStack = [];
    this.redoStack = [];
  }

  canUndo(): boolean {
    return this.undoStack.length > 0;
  }

  canRedo(): boolean {
    return this.redoStack.length > 0;
  }

  getHistorySize(): number {
    return this.undoStack.length;
  }

  destroy() {
    this.clear();
  }

  private emitHistoryChange(action: 'execute' | 'undo' | 'redo') {
    this.emitter?.emit('history:change', {
      type: 'history:change',
      action,
    });
  }
}
