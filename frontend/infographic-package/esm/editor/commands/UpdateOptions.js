export class UpdateOptionsCommand {
    constructor(options, original) {
        this.options = options;
        this.original = original;
    }
    async apply(state) {
        const prev = state.getOptions();
        if (!this.original) {
            this.original = prev;
        }
        state.updateOptions({ ...prev, ...this.options });
    }
    async undo(state) {
        if (this.original) {
            state.updateOptions(this.original);
        }
    }
    serialize() {
        return {
            type: 'update-options',
            options: this.options,
            original: this.original,
        };
    }
}
