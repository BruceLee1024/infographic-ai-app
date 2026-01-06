"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HotkeyManager = void 0;
const base_1 = require("./base");
/**
 * 快捷键管理器
 * 提供可配置的快捷键系统
 */
class HotkeyManager extends base_1.Interaction {
    constructor() {
        super(...arguments);
        this.name = 'hotkey-manager';
        this.hotkeys = new Map();
        this.actions = new Map();
        this.enabled = true;
        this.onKeyDown = async (event) => {
            if (!this.enabled || !this.interaction.isActive())
                return;
            // 如果正在编辑文本，不处理快捷键
            const activeElement = document.activeElement;
            if (activeElement &&
                (activeElement.tagName === 'INPUT' ||
                    activeElement.tagName === 'TEXTAREA' ||
                    activeElement.isContentEditable)) {
                return;
            }
            const hotkeyKey = this.buildHotkeyKey({
                key: event.key,
                ctrl: event.ctrlKey || event.metaKey,
                shift: event.shiftKey,
                alt: event.altKey,
            });
            const config = this.hotkeys.get(hotkeyKey);
            if (!config)
                return;
            const action = this.actions.get(config.action);
            if (!action)
                return;
            event.preventDefault();
            await action.handler();
        };
    }
    init(options) {
        super.init(options);
        // 注册默认快捷键
        HotkeyManager.DEFAULT_HOTKEYS.forEach((config) => {
            this.registerHotkey(config);
        });
        // 注册默认动作
        this.registerDefaultActions();
        document.addEventListener('keydown', this.onKeyDown);
    }
    destroy() {
        document.removeEventListener('keydown', this.onKeyDown);
        this.hotkeys.clear();
        this.actions.clear();
    }
    /**
     * 启用/禁用快捷键
     */
    setEnabled(enabled) {
        this.enabled = enabled;
    }
    /**
     * 注册快捷键
     */
    registerHotkey(config) {
        const key = this.buildHotkeyKey(config);
        this.hotkeys.set(key, config);
    }
    /**
     * 注销快捷键
     */
    unregisterHotkey(config) {
        const key = this.buildHotkeyKey(config);
        this.hotkeys.delete(key);
    }
    /**
     * 注册动作处理器
     */
    registerAction(action) {
        this.actions.set(action.name, action);
    }
    /**
     * 注销动作处理器
     */
    unregisterAction(name) {
        this.actions.delete(name);
    }
    /**
     * 获取所有已注册的快捷键
     */
    getHotkeys() {
        return Array.from(this.hotkeys.values());
    }
    /**
     * 获取快捷键帮助信息
     */
    getHotkeyHelp() {
        const help = [];
        this.hotkeys.forEach((config) => {
            const shortcut = this.formatHotkey(config);
            const action = this.actions.get(config.action);
            const description = config.description || action?.description || config.action;
            help.push({ shortcut, description });
        });
        return help;
    }
    buildHotkeyKey(config) {
        const parts = [];
        if (config.ctrl || config.meta)
            parts.push('ctrl');
        if (config.shift)
            parts.push('shift');
        if (config.alt)
            parts.push('alt');
        parts.push(config.key.toLowerCase());
        return parts.join('+');
    }
    formatHotkey(config) {
        const parts = [];
        const isMac = typeof navigator !== 'undefined' &&
            navigator.platform.toLowerCase().includes('mac');
        if (config.ctrl || config.meta)
            parts.push(isMac ? '⌘' : 'Ctrl');
        if (config.shift)
            parts.push(isMac ? '⇧' : 'Shift');
        if (config.alt)
            parts.push(isMac ? '⌥' : 'Alt');
        // 格式化特殊键
        let keyDisplay = config.key;
        switch (config.key) {
            case 'ArrowUp':
                keyDisplay = '↑';
                break;
            case 'ArrowDown':
                keyDisplay = '↓';
                break;
            case 'ArrowLeft':
                keyDisplay = '←';
                break;
            case 'ArrowRight':
                keyDisplay = '→';
                break;
            case 'Delete':
                keyDisplay = 'Del';
                break;
            case 'Backspace':
                keyDisplay = '⌫';
                break;
            default:
                keyDisplay = config.key.toUpperCase();
        }
        parts.push(keyDisplay);
        return parts.join(isMac ? '' : '+');
    }
    registerDefaultActions() {
        // 删除选中元素
        this.registerAction({
            name: 'delete',
            description: '删除选中元素',
            handler: () => {
                const selection = this.interaction.getSelection();
                if (selection.length === 0)
                    return;
                // 发出删除事件，由外部处理
                this.emitter.emit('hotkey:delete', { selection });
            },
        });
        // 移动元素
        const moveStep = 1;
        const fastMoveStep = 10;
        const createMoveHandler = (dx, dy) => () => {
            const selection = this.interaction.getSelection();
            if (selection.length === 0)
                return;
            this.emitter.emit('hotkey:move', { selection, dx, dy });
        };
        this.registerAction({
            name: 'move-up',
            description: '向上移动',
            handler: createMoveHandler(0, -moveStep),
        });
        this.registerAction({
            name: 'move-down',
            description: '向下移动',
            handler: createMoveHandler(0, moveStep),
        });
        this.registerAction({
            name: 'move-left',
            description: '向左移动',
            handler: createMoveHandler(-moveStep, 0),
        });
        this.registerAction({
            name: 'move-right',
            description: '向右移动',
            handler: createMoveHandler(moveStep, 0),
        });
        this.registerAction({
            name: 'move-up-fast',
            description: '快速向上移动',
            handler: createMoveHandler(0, -fastMoveStep),
        });
        this.registerAction({
            name: 'move-down-fast',
            description: '快速向下移动',
            handler: createMoveHandler(0, fastMoveStep),
        });
        this.registerAction({
            name: 'move-left-fast',
            description: '快速向左移动',
            handler: createMoveHandler(-fastMoveStep, 0),
        });
        this.registerAction({
            name: 'move-right-fast',
            description: '快速向右移动',
            handler: createMoveHandler(fastMoveStep, 0),
        });
        // 复制/粘贴/剪切（占位，需要外部实现）
        this.registerAction({
            name: 'copy',
            description: '复制',
            handler: () => {
                const selection = this.interaction.getSelection();
                if (selection.length === 0)
                    return;
                this.emitter.emit('hotkey:copy', { selection });
            },
        });
        this.registerAction({
            name: 'paste',
            description: '粘贴',
            handler: () => {
                this.emitter.emit('hotkey:paste', {});
            },
        });
        this.registerAction({
            name: 'cut',
            description: '剪切',
            handler: () => {
                const selection = this.interaction.getSelection();
                if (selection.length === 0)
                    return;
                this.emitter.emit('hotkey:cut', { selection });
            },
        });
        this.registerAction({
            name: 'duplicate',
            description: '复制元素',
            handler: () => {
                const selection = this.interaction.getSelection();
                if (selection.length === 0)
                    return;
                this.emitter.emit('hotkey:duplicate', { selection });
            },
        });
    }
}
exports.HotkeyManager = HotkeyManager;
// 默认快捷键配置
HotkeyManager.DEFAULT_HOTKEYS = [
    { key: 'Delete', action: 'delete', description: '删除选中元素' },
    { key: 'Backspace', action: 'delete', description: '删除选中元素' },
    { key: 'c', ctrl: true, action: 'copy', description: '复制' },
    { key: 'v', ctrl: true, action: 'paste', description: '粘贴' },
    { key: 'x', ctrl: true, action: 'cut', description: '剪切' },
    { key: 'd', ctrl: true, action: 'duplicate', description: '复制元素' },
    { key: 'ArrowUp', action: 'move-up', description: '向上移动' },
    { key: 'ArrowDown', action: 'move-down', description: '向下移动' },
    { key: 'ArrowLeft', action: 'move-left', description: '向左移动' },
    { key: 'ArrowRight', action: 'move-right', description: '向右移动' },
    {
        key: 'ArrowUp',
        shift: true,
        action: 'move-up-fast',
        description: '快速向上移动',
    },
    {
        key: 'ArrowDown',
        shift: true,
        action: 'move-down-fast',
        description: '快速向下移动',
    },
    {
        key: 'ArrowLeft',
        shift: true,
        action: 'move-left-fast',
        description: '快速向左移动',
    },
    {
        key: 'ArrowRight',
        shift: true,
        action: 'move-right-fast',
        description: '快速向右移动',
    },
];
