"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const registry_1 = require("./registry");
// 暗色主题
(0, registry_1.registerTheme)('dark', {
    colorBg: '#1F1F1F',
    base: {
        text: {
            fill: '#fff',
        },
    },
});
// 手绘风格
(0, registry_1.registerTheme)('hand-drawn', {
    base: {
        text: {
            'font-family': '851tegakizatsu',
        },
    },
    stylize: {
        type: 'rough',
    },
});
// 科技蓝主题
(0, registry_1.registerTheme)('tech-blue', {
    colorPrimary: '#2563eb',
    colorBg: '#f8fafc',
    palette: ['#2563eb', '#3b82f6', '#60a5fa', '#93c5fd', '#bfdbfe'],
    base: {
        text: {
            fill: '#1e293b',
        },
    },
    title: {
        fill: '#0f172a',
        'font-weight': 'bold',
    },
    desc: {
        fill: '#64748b',
    },
});
// 渐变紫主题
(0, registry_1.registerTheme)('gradient-purple', {
    colorPrimary: '#8b5cf6',
    colorBg: '#faf5ff',
    palette: ['#8b5cf6', '#a78bfa', '#c4b5fd', '#7c3aed', '#6d28d9'],
    base: {
        text: {
            fill: '#1e1b4b',
        },
    },
    title: {
        fill: '#4c1d95',
        'font-weight': 'bold',
    },
    desc: {
        fill: '#6b7280',
    },
});
// 清新绿主题
(0, registry_1.registerTheme)('fresh-green', {
    colorPrimary: '#10b981',
    colorBg: '#f0fdf4',
    palette: ['#10b981', '#34d399', '#6ee7b7', '#059669', '#047857'],
    base: {
        text: {
            fill: '#064e3b',
        },
    },
    title: {
        fill: '#064e3b',
        'font-weight': 'bold',
    },
    desc: {
        fill: '#6b7280',
    },
});
// 暖橙主题
(0, registry_1.registerTheme)('warm-orange', {
    colorPrimary: '#f97316',
    colorBg: '#fffbeb',
    palette: ['#f97316', '#fb923c', '#fdba74', '#ea580c', '#c2410c'],
    base: {
        text: {
            fill: '#431407',
        },
    },
    title: {
        fill: '#7c2d12',
        'font-weight': 'bold',
    },
    desc: {
        fill: '#78716c',
    },
});
// 商务灰主题
(0, registry_1.registerTheme)('business-gray', {
    colorPrimary: '#475569',
    colorBg: '#f8fafc',
    palette: ['#475569', '#64748b', '#94a3b8', '#334155', '#1e293b'],
    base: {
        text: {
            fill: '#1e293b',
        },
    },
    title: {
        fill: '#0f172a',
        'font-weight': 'bold',
    },
    desc: {
        fill: '#64748b',
    },
});
// 玫瑰粉主题
(0, registry_1.registerTheme)('rose-pink', {
    colorPrimary: '#f43f5e',
    colorBg: '#fff1f2',
    palette: ['#f43f5e', '#fb7185', '#fda4af', '#e11d48', '#be123c'],
    base: {
        text: {
            fill: '#4c0519',
        },
    },
    title: {
        fill: '#881337',
        'font-weight': 'bold',
    },
    desc: {
        fill: '#6b7280',
    },
});
// 深色科技主题
(0, registry_1.registerTheme)('dark-tech', {
    colorPrimary: '#06b6d4',
    colorBg: '#0f172a',
    palette: ['#06b6d4', '#22d3ee', '#67e8f9', '#0891b2', '#0e7490'],
    base: {
        text: {
            fill: '#e2e8f0',
        },
    },
    title: {
        fill: '#f1f5f9',
        'font-weight': 'bold',
    },
    desc: {
        fill: '#94a3b8',
    },
});
// 深色紫罗兰主题
(0, registry_1.registerTheme)('dark-violet', {
    colorPrimary: '#a78bfa',
    colorBg: '#1e1b4b',
    palette: ['#a78bfa', '#c4b5fd', '#ddd6fe', '#8b5cf6', '#7c3aed'],
    base: {
        text: {
            fill: '#e0e7ff',
        },
    },
    title: {
        fill: '#f5f3ff',
        'font-weight': 'bold',
    },
    desc: {
        fill: '#a5b4fc',
    },
});
// 彩虹渐变主题
(0, registry_1.registerTheme)('rainbow', {
    colorPrimary: '#ec4899',
    colorBg: '#fefce8',
    palette: ['#ef4444', '#f97316', '#eab308', '#22c55e', '#3b82f6', '#8b5cf6'],
    base: {
        text: {
            fill: '#1f2937',
        },
    },
    title: {
        fill: '#111827',
        'font-weight': 'bold',
    },
    desc: {
        fill: '#6b7280',
    },
});
// 海洋蓝主题
(0, registry_1.registerTheme)('ocean', {
    colorPrimary: '#0ea5e9',
    colorBg: '#f0f9ff',
    palette: ['#0ea5e9', '#38bdf8', '#7dd3fc', '#0284c7', '#0369a1'],
    base: {
        text: {
            fill: '#0c4a6e',
        },
    },
    title: {
        fill: '#082f49',
        'font-weight': 'bold',
    },
    desc: {
        fill: '#64748b',
    },
});
// 森林绿主题
(0, registry_1.registerTheme)('forest', {
    colorPrimary: '#16a34a',
    colorBg: '#f0fdf4',
    palette: ['#16a34a', '#22c55e', '#4ade80', '#15803d', '#166534'],
    base: {
        text: {
            fill: '#14532d',
        },
    },
    title: {
        fill: '#052e16',
        'font-weight': 'bold',
    },
    desc: {
        fill: '#6b7280',
    },
});
// 日落橙主题
(0, registry_1.registerTheme)('sunset', {
    colorPrimary: '#ea580c',
    colorBg: '#fff7ed',
    palette: ['#ea580c', '#f97316', '#fb923c', '#c2410c', '#9a3412'],
    base: {
        text: {
            fill: '#431407',
        },
    },
    title: {
        fill: '#7c2d12',
        'font-weight': 'bold',
    },
    desc: {
        fill: '#78716c',
    },
});
