"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BatchCommand = void 0;
class BatchCommand {
    constructor(commands) {
        this.commands = commands;
    }
    async apply(state) {
        for (const command of this.commands) {
            await command.apply(state);
        }
    }
    async undo(state) {
        for (let i = this.commands.length - 1; i >= 0; i--) {
            await this.commands[i].undo(state);
        }
    }
    serialize() {
        return {
            type: 'batch',
            commands: this.commands.map((cmd) => cmd.serialize()),
        };
    }
}
exports.BatchCommand = BatchCommand;
