import type { IInteraction, InteractionInitOptions } from '../types';
import { Interaction } from './base';
export interface HotkeyConfig {
    key: string;
    ctrl?: boolean;
    shift?: boolean;
    alt?: boolean;
    meta?: boolean;
    action: string;
    description?: string;
}
export interface HotkeyAction {
    name: string;
    handler: () => void | Promise<void>;
    description?: string;
}
/**
 * 快捷键管理器
 * 提供可配置的快捷键系统
 */
export declare class HotkeyManager extends Interaction implements IInteraction {
    name: string;
    private hotkeys;
    private actions;
    private enabled;
    private static DEFAULT_HOTKEYS;
    init(options: InteractionInitOptions): void;
    destroy(): void;
    /**
     * 启用/禁用快捷键
     */
    setEnabled(enabled: boolean): void;
    /**
     * 注册快捷键
     */
    registerHotkey(config: HotkeyConfig): void;
    /**
     * 注销快捷键
     */
    unregisterHotkey(config: Omit<HotkeyConfig, 'action'>): void;
    /**
     * 注册动作处理器
     */
    registerAction(action: HotkeyAction): void;
    /**
     * 注销动作处理器
     */
    unregisterAction(name: string): void;
    /**
     * 获取所有已注册的快捷键
     */
    getHotkeys(): HotkeyConfig[];
    /**
     * 获取快捷键帮助信息
     */
    getHotkeyHelp(): Array<{
        shortcut: string;
        description: string;
    }>;
    private buildHotkeyKey;
    private formatHotkey;
    private onKeyDown;
    private registerDefaultActions;
}
