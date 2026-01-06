import { hierarchyMindmapTemplates } from './hierarchy-mindmap';
import { hierarchyTreeTemplates } from './hierarchy-tree';
import { registerTemplate } from './registry';
import { sequenceStairsTemplates } from './sequence-stairs';
import type { TemplateOptions } from './types';
import { wordCloudTemplate } from './word-cloud';

const BUILT_IN_TEMPLATES: Record<string, TemplateOptions> = {
  'compare-hierarchy-left-right-circle-node-pill-badge': {
    design: {
      structure: {
        type: 'compare-hierarchy-left-right',
        decoration: 'split-line',
        surround: false,
        groupGap: 0,
      },
      title: 'default',
      items: [{ type: 'circle-node', width: 260 }, 'pill-badge'],
    },
    themeConfig: {},
  },
  'compare-hierarchy-left-right-circle-node-plain-text': {
    design: {
      title: 'default',
      structure: {
        type: 'compare-hierarchy-left-right',
        decoration: 'dot-line',
        flipLeaf: true,
        groupGap: 10,
      },
      items: [{ type: 'circle-node', width: 200 }, { type: 'plain-text' }],
    },
  },
  'list-pyramid-rounded-rect-node': {
    design: {
      title: 'default',
      structure: {
        type: 'list-pyramid',
        gap: 16,
      },
      items: [{ type: 'rounded-rect-node', width: 240 }],
    },
  },
  'list-pyramid-badge-card': {
    design: {
      title: 'default',
      structure: { type: 'list-pyramid', gap: 16 },
      items: [{ type: 'badge-card', width: 240, height: 100, iconSize: 28, badgeSize: 40 }],
    },
  },
  'list-pyramid-compact-card': {
    design: {
      title: 'default',
      structure: { type: 'list-pyramid', gap: 12 },
      items: [{ type: 'compact-card', width: 240, height: 70, iconSize: 24 }],
    },
  },
  'list-column-done-list': {
    design: {
      title: 'default',
      structure: { type: 'list-column', gap: 12 },
      items: [{ type: 'done-list', width: 280 }],
    },
  },
  'list-column-vertical-icon-arrow': {
    design: {
      title: 'default',
      structure: { type: 'list-column', gap: 0, zigzag: true },
      items: [{ type: 'vertical-icon-arrow', width: 200 }],
    },
  },
  'list-grid-badge-card': {
    design: {
      title: 'default',
      structure: { type: 'list-grid', gap: 20 },
      items: [{ type: 'badge-card', width: 220, height: 100, iconSize: 28, badgeSize: 40 }],
    },
  },
  'list-grid-candy-card-lite': {
    design: {
      title: 'default',
      structure: { type: 'list-grid', gap: 20 },
      items: [{ type: 'candy-card-lite', width: 200 }],
    },
  },
  'chart-column-simple': {
    design: {
      title: 'default',
      structure: { type: 'chart-column', gap: 16 },
      items: [{ type: 'simple', width: 120, showIcon: false, usePaletteColor: true }],
    },
  },
  'list-grid-circular-progress': {
    design: {
      title: 'default',
      structure: { type: 'list-grid', gap: 24 },
      items: [{ type: 'circular-progress', width: 160 }],
    },
  },
  'list-grid-compact-card': {
    design: {
      title: 'default',
      structure: { type: 'list-grid', gap: 16 },
      items: [{ type: 'compact-card', width: 220, height: 70, iconSize: 24 }],
    },
  },
  'list-grid-done-list': {
    design: {
      title: 'default',
      structure: { type: 'list-grid', gap: 16 },
      items: [{ type: 'done-list', width: 240 }],
    },
  },
  'list-grid-horizontal-icon-arrow': {
    design: {
      title: 'default',
      structure: { type: 'list-grid', gap: 4, zigzag: true },
      items: [{ type: 'horizontal-icon-arrow', width: 200 }],
    },
  },
  'list-grid-progress-card': {
    design: {
      title: 'default',
      structure: { type: 'list-grid', gap: 20 },
      items: [{ type: 'progress-card', width: 220 }],
    },
  },
  'list-grid-ribbon-card': {
    design: {
      title: 'default',
      structure: { type: 'list-grid', gap: 20 },
      items: [{ type: 'ribbon-card', width: 220 }],
    },
  },
  'list-grid-simple': {
    design: {
      title: 'default',
      structure: { type: 'list-grid', gap: 24 },
      items: [{ type: 'simple', width: 200, iconSize: 36 }],
    },
  },
  'list-row-circular-progress': {
    design: {
      title: 'default',
      structure: { type: 'list-row', gap: 32 },
      items: [{ type: 'circular-progress', width: 140 }],
    },
  },
  'list-row-horizontal-icon-arrow': {
    design: {
      title: 'default',
      structure: { type: 'list-row', gap: 4, zigzag: true },
      items: [{ type: 'horizontal-icon-arrow', width: 180 }],
    },
  },
  'relation-circle-circular-progress': {
    design: {
      title: 'default',
      structure: { type: 'relation-circle', gap: 20 },
      items: [{ type: 'circular-progress', width: 140 }],
    },
  },
  'relation-circle-icon-badge': {
    design: {
      title: 'default',
      structure: { type: 'relation-circle', gap: 20 },
      items: [{ type: 'icon-badge', width: 120 }],
    },
  },
  'sequence-steps-badge-card': {
    design: {
      title: 'default',
      structure: { type: 'sequence-steps', gap: 16 },
      items: [{ type: 'badge-card', width: 220, height: 100, iconSize: 28, badgeSize: 40 }],
    },
  },
  'sequence-steps-simple': {
    design: {
      title: 'default',
      structure: { type: 'sequence-steps', gap: 16 },
      items: [{ type: 'simple', width: 200, iconSize: 36 }],
    },
  },
  'sequence-timeline-done-list': {
    design: {
      title: 'default',
      structure: { type: 'sequence-timeline', gap: 24 },
      items: [{ type: 'done-list', width: 260 }],
    },
  },
  'sequence-timeline-plain-text': {
    design: {
      title: 'default',
      structure: { type: 'sequence-timeline', gap: 24 },
      items: [{ type: 'plain-text', width: 240 }],
    },
  },
  'sequence-timeline-rounded-rect-node': {
    design: {
      title: 'default',
      structure: { type: 'sequence-timeline', gap: 24 },
      items: [{ type: 'rounded-rect-node', width: 220 }],
    },
  },
  'sequence-ascending-steps': {
    design: {
      title: 'default',
      structure: { type: 'sequence-ascending-steps', vGap: -40, hGap: -10 },
      items: [{ type: 'l-corner-card', width: 240 }],
    },
  },
  'sequence-timeline-simple': {
    design: {
      title: 'default',
      structure: { type: 'sequence-timeline', gap: 28 },
      items: [{ type: 'simple', width: 220, iconSize: 36, positionV: 'middle' }],
    },
  },
  'sequence-cylinders-3d-simple': {
    design: {
      title: 'default',
      structure: { type: 'sequence-cylinders-3d', gapY: 24 },
      items: [{ type: 'simple', width: 160, showIcon: false, usePaletteColor: true }],
    },
  },
  'list-column-simple-vertical-arrow': {
    design: {
      title: 'default',
      structure: { type: 'list-column', gap: 4, zigzag: true },
      items: [{ type: 'simple-vertical-arrow', width: 200 }],
    },
  },
  'list-row-simple-horizontal-arrow': {
    design: {
      title: 'default',
      structure: { type: 'list-row', gap: 4, zigzag: true },
      items: [{ type: 'simple-horizontal-arrow', width: 180 }],
    },
  },
  'compare-swot': {
    design: {
      title: 'default',
      structure: {
        type: 'compare-hierarchy-row',
        itemGap: 16,
        itemPadding: 32,
        showColumnBackground: true,
        columnBackgroundAlpha: 0.1,
      },
      items: [
        { type: 'letter-card', showBottomShade: false, width: 200 },
        {
          type: 'plain-text',
          width: 240,
          formatter: (text: string) => `● ${text}`,
          usePaletteColor: true,
        },
      ],
    },
  },
  'compare-hierarchy-row-letter-card-compact-card': {
    design: {
      title: 'default',
      structure: { type: 'compare-hierarchy-row', itemGap: 16 },
      items: [
        { type: 'letter-card', width: 180 },
        { type: 'compact-card', width: 220, height: 70, iconSize: 24 },
      ],
    },
  },
  'compare-hierarchy-row-letter-card-rounded-rect-node': {
    design: {
      title: 'default',
      structure: { type: 'compare-hierarchy-row', itemGap: 16 },
      items: [
        { type: 'letter-card', width: 180 },
        { type: 'rounded-rect-node', width: 200 },
      ],
    },
  },
  'sequence-snake-steps-compact-card': {
    design: {
      title: 'default',
      structure: { type: 'sequence-snake-steps', gap: 16 },
      items: [{ type: 'compact-card', width: 220, height: 70, iconSize: 24 }],
    },
  },
  'sequence-snake-steps-pill-badge': {
    design: {
      title: 'default',
      structure: { type: 'sequence-snake-steps', gap: 16 },
      items: [{ type: 'pill-badge', width: 200 }],
    },
  },
  'sequence-snake-steps-simple': {
    design: {
      title: 'default',
      structure: { type: 'sequence-snake-steps', gap: 20 },
      items: [{ type: 'simple', width: 200, iconSize: 36 }],
    },
  },
  'sequence-color-snake-steps-horizontal-icon-line': {
    design: {
      title: 'default',
      structure: { type: 'sequence-color-snake-steps', gap: 16 },
      items: [{ type: 'horizontal-icon-line', width: 220 }],
    },
  },
  'sequence-pyramid-simple': {
    design: {
      title: 'default',
      structure: { type: 'sequence-pyramid', gap: 16 },
      items: [{ type: 'simple', width: 180, showIcon: false, usePaletteColor: true }],
    },
    themeConfig: {
      colorPrimary: '#1677ff',
    },
  },
  'list-row-horizontal-icon-line': {
    design: {
      title: 'default',
      structure: { type: 'list-row', gap: 4, zigzag: true },
      items: [{ type: 'horizontal-icon-line', width: 200 }],
    },
  },
  'list-sector-simple': {
    design: {
      title: 'default',
      structure: { type: 'list-sector', gap: 20 },
      items: [{ type: 'simple', width: 180, iconSize: 32 }],
    },
  },
  'list-sector-plain-text': {
    design: {
      title: 'default',
      structure: { type: 'list-sector', gap: 20 },
      items: [{ type: 'plain-text', width: 160 }],
    },
  },
  'list-sector-half-plain-text': {
    design: {
      title: 'default',
      structure: { type: 'list-sector', startAngle: -180, endAngle: 0, gap: 20 },
      items: [{ type: 'plain-text', width: 160 }],
    },
  },
  'quadrant-quarter-simple-card': {
    design: {
      title: 'default',
      structure: { type: 'quadrant', gap: 24 },
      items: [{ type: 'quarter-simple-card', width: 200 }],
    },
  },
  'quadrant-quarter-circular': {
    design: {
      title: 'default',
      structure: { type: 'quadrant', gap: 24 },
      items: [{ type: 'quarter-circular', width: 180 }],
    },
  },
  'sequence-roadmap-vertical-plain-text': {
    design: {
      title: 'default',
      structure: { type: 'sequence-roadmap-vertical', gap: 20 },
      items: [{ type: 'plain-text', width: 220 }],
    },
  },
  'sequence-roadmap-vertical-simple': {
    design: {
      title: 'default',
      structure: { type: 'sequence-roadmap-vertical', gap: 20 },
      items: [{ type: 'simple', width: 200, showIcon: false }],
    },
  },
  'sequence-roadmap-vertical-badge-card': {
    design: {
      title: 'default',
      structure: { type: 'sequence-roadmap-vertical', gap: 20 },
      items: [{ type: 'badge-card', width: 220, height: 100, iconSize: 28, badgeSize: 40 }],
    },
  },
  'sequence-roadmap-vertical-pill-badge': {
    design: {
      title: 'default',
      structure: { type: 'sequence-roadmap-vertical', gap: 20 },
      items: [{ type: 'pill-badge', width: 200 }],
    },
  },
  'sequence-roadmap-vertical-quarter-circular': {
    design: {
      title: 'default',
      structure: { type: 'sequence-roadmap-vertical', gap: 20 },
      items: [{ type: 'quarter-circular', width: 180 }],
    },
  },
  'sequence-roadmap-vertical-quarter-simple-card': {
    design: {
      title: 'default',
      structure: { type: 'sequence-roadmap-vertical', flipped: true, gap: 20 },
      items: [{ type: 'quarter-simple-card', width: 200 }],
    },
  },
  'sequence-horizontal-zigzag-simple-illus': {
    design: {
      title: 'default',
      structure: { type: 'sequence-horizontal-zigzag', gap: 24 },
      items: [{ type: 'simple-illus', width: 220 }],
    },
  },
  'sequence-horizontal-zigzag-horizontal-icon-line': {
    design: {
      title: 'default',
      structure: { type: 'sequence-horizontal-zigzag', gap: 20 },
      items: [{ type: 'horizontal-icon-line', width: 220 }],
    },
  },
  'sequence-horizontal-zigzag-plain-text': {
    design: {
      title: 'default',
      structure: { type: 'sequence-horizontal-zigzag', gap: 20 },
      items: [{ type: 'plain-text', width: 200 }],
    },
  },
  'sequence-horizontal-zigzag-simple-horizontal-arrow': {
    design: {
      title: 'default',
      structure: { type: 'sequence-horizontal-zigzag', gap: 16 },
      items: [{ type: 'simple-horizontal-arrow', width: 200 }],
    },
  },
  'sequence-horizontal-zigzag-simple': {
    design: {
      title: 'default',
      structure: { type: 'sequence-horizontal-zigzag', gap: 24 },
      items: [{ type: 'simple', width: 200, iconSize: 36 }],
    },
  },
  'list-row-simple-illus': {
    design: {
      title: 'default',
      structure: { type: 'list-row', gap: 32 },
      items: [{ type: 'simple-illus', width: 220 }],
    },
  },
  'quadrant-simple-illus': {
    design: {
      title: 'default',
      structure: { type: 'quadrant', gap: 24 },
      items: [{ type: 'simple-illus', width: 220 }],
    },
  },
  'sequence-color-snake-steps-simple-illus': {
    design: {
      title: 'default',
      structure: { type: 'sequence-color-snake-steps', gap: 20 },
      items: [{ type: 'simple-illus', width: 220 }],
    },
  },
  'sequence-snake-steps-simple-illus': {
    design: {
      title: 'default',
      structure: { type: 'sequence-snake-steps', gap: 20 },
      items: [{ type: 'simple-illus', width: 220 }],
    },
  },
  'sequence-steps-simple-illus': {
    design: {
      title: 'default',
      structure: { type: 'sequence-steps', gap: 20 },
      items: [{ type: 'simple-illus', width: 220 }],
    },
  },
  'sequence-timeline-simple-illus': {
    design: {
      title: 'default',
      structure: { type: 'sequence-timeline', gap: 28 },
      items: [{ type: 'simple-illus', width: 240, usePaletteColor: true }],
    },
  },
  'sequence-zigzag-steps-underline-text': {
    design: {
      title: 'default',
      structure: { type: 'sequence-zigzag-steps', gap: 20 },
      items: [{ type: 'underline-text', width: 200 }],
    },
  },
  'sequence-horizontal-zigzag-underline-text': {
    design: {
      title: 'default',
      structure: { type: 'sequence-horizontal-zigzag', gap: 20 },
      items: [{ type: 'underline-text', width: 200 }],
    },
  },
  'sequence-roadmap-vertical-underline-text': {
    design: {
      title: 'default',
      structure: { type: 'sequence-roadmap-vertical', gap: 20 },
      items: [{ type: 'underline-text', width: 200 }],
    },
  },
  'sequence-snake-steps-underline-text': {
    design: {
      title: 'default',
      structure: { type: 'sequence-snake-steps', gap: 20 },
      items: [{ type: 'underline-text', width: 200 }],
    },
  },
  'sequence-circle-arrows-indexed-card': {
    design: {
      title: 'default',
      structure: { type: 'sequence-circle-arrows', gap: 20 },
      items: [{ type: 'indexed-card', width: 200 }],
    },
  },
  'sequence-zigzag-pucks-3d-simple': {
    design: {
      title: 'default',
      structure: { type: 'sequence-zigzag-pucks-3d', gap: 20 },
      items: [{ type: 'simple', width: 180, showIcon: false, usePaletteColor: true }],
    },
  },
  'sequence-zigzag-pucks-3d-underline-text': {
    design: {
      title: 'default',
      structure: { type: 'sequence-zigzag-pucks-3d', gap: 20 },
      items: [{ type: 'underline-text', width: 200 }],
    },
  },
  'sequence-zigzag-pucks-3d-indexed-card': {
    design: {
      title: 'default',
      structure: { type: 'sequence-zigzag-pucks-3d', gap: 20 },
      items: [{ type: 'indexed-card', width: 200 }],
    },
  },
  'sequence-ascending-stairs-3d-simple': {
    design: {
      title: 'default',
      structure: { type: 'sequence-ascending-stairs-3d', gap: 20 },
      items: [{ type: 'simple', width: 180, showIcon: false, usePaletteColor: true }],
    },
  },
  'sequence-ascending-stairs-3d-underline-text': {
    design: {
      title: 'default',
      structure: { type: 'sequence-ascending-stairs-3d', gap: 20 },
      items: [{ type: 'underline-text', width: 200 }],
    },
  },
  'sequence-circular-underline-text': {
    design: {
      title: 'default',
      structure: { type: 'sequence-circular', gap: 20 },
      items: [{ type: 'underline-text', width: 180 }],
    },
  },
  'sequence-circular-simple': {
    design: {
      title: 'default',
      structure: { type: 'sequence-circular', gap: 20 },
      items: [{ type: 'simple', width: 160, showIcon: false, usePaletteColor: true }],
    },
  },
  'sequence-filter-mesh-underline-text': {
    design: {
      title: 'default',
      structure: { type: 'sequence-filter-mesh', gap: 16 },
      items: [{ type: 'underline-text', width: 180 }],
    },
  },
  'sequence-filter-mesh-simple': {
    design: {
      title: 'default',
      structure: { type: 'sequence-filter-mesh', gap: 16 },
      items: [{ type: 'simple', width: 160, showIcon: false, usePaletteColor: true }],
    },
  },
  'sequence-mountain-underline-text': {
    design: {
      title: 'default',
      structure: { type: 'sequence-mountain', gap: 20 },
      items: [{ type: 'underline-text', width: 180 }],
    },
  },
  'compare-binary-horizontal-simple-fold': {
    design: {
      title: 'default',
      structure: {
        type: 'compare-binary-horizontal',
        dividerType: 'pros-cons-fold',
        gap: 20,
      },
      items: [{ type: 'simple', width: 220, iconType: 'circle', iconSize: 44 }],
    },
  },
  'compare-binary-horizontal-underline-text-fold': {
    design: {
      title: 'default',
      structure: {
        type: 'compare-binary-horizontal',
        dividerType: 'pros-cons-fold',
        gap: 20,
      },
      items: [{ type: 'underline-text', width: 200 }],
    },
  },
  'compare-binary-horizontal-badge-card-fold': {
    design: {
      title: 'default',
      structure: {
        type: 'compare-binary-horizontal',
        dividerType: 'pros-cons-fold',
        gap: 20,
      },
      items: [{ type: 'badge-card', width: 220, height: 100, iconSize: 28, badgeSize: 40 }],
    },
  },
  'compare-binary-horizontal-compact-card-fold': {
    design: {
      title: 'default',
      structure: {
        type: 'compare-binary-horizontal',
        dividerType: 'pros-cons-fold',
        gap: 20,
      },
      items: [{ type: 'compact-card', width: 220, height: 70, iconSize: 24 }],
    },
  },
  'compare-binary-horizontal-simple-arrow': {
    design: {
      title: 'default',
      structure: {
        type: 'compare-binary-horizontal',
        dividerType: 'pros-cons-arrow',
        gap: 20,
      },
      items: [{ type: 'simple', width: 220, iconType: 'circle', iconSize: 44 }],
    },
  },
  'compare-binary-horizontal-underline-text-arrow': {
    design: {
      title: 'default',
      structure: {
        type: 'compare-binary-horizontal',
        dividerType: 'pros-cons-arrow',
        gap: 20,
      },
      items: [{ type: 'underline-text', width: 200 }],
    },
  },
  'compare-binary-horizontal-badge-card-arrow': {
    design: {
      title: 'default',
      structure: {
        type: 'compare-binary-horizontal',
        dividerType: 'pros-cons-arrow',
        gap: 20,
      },
      items: [{ type: 'badge-card', width: 220, height: 100, iconSize: 28, badgeSize: 40 }],
    },
  },
  'compare-binary-horizontal-compact-card-arrow': {
    design: {
      title: 'default',
      structure: {
        type: 'compare-binary-horizontal',
        dividerType: 'pros-cons-arrow',
        gap: 20,
      },
      items: [{ type: 'compact-card', width: 220, height: 70, iconSize: 24 }],
    },
  },
  'compare-binary-horizontal-simple-vs': {
    design: {
      title: 'default',
      structure: {
        type: 'compare-binary-horizontal',
        dividerType: 'vs',
        gap: 20,
      },
      items: [{ type: 'simple', width: 220, iconType: 'circle', iconSize: 44 }],
    },
  },
  'compare-binary-horizontal-underline-text-vs': {
    design: {
      title: 'default',
      structure: {
        type: 'compare-binary-horizontal',
        dividerType: 'vs',
        gap: 20,
      },
      items: [{ type: 'underline-text', width: 200 }],
    },
  },
  'compare-binary-horizontal-badge-card-vs': {
    design: {
      title: 'default',
      structure: {
        type: 'compare-binary-horizontal',
        dividerType: 'vs',
        gap: 20,
      },
      items: [{ type: 'badge-card', width: 220, height: 100, iconSize: 28, badgeSize: 40 }],
    },
  },
  'compare-binary-horizontal-compact-card-vs': {
    design: {
      title: 'default',
      structure: {
        type: 'compare-binary-horizontal',
        dividerType: 'vs',
        gap: 20,
      },
      items: [{ type: 'compact-card', width: 220, height: 70, iconSize: 24 }],
    },
  },
  'chart-bar-plain-text': {
    design: {
      title: 'default',
      structure: {
        type: 'chart-bar',
        gap: 16,
      },
      items: [
        {
          type: 'plain-text',
          width: 200,
          positionH: 'flipped',
        },
      ],
    },
  },
  'chart-line-plain-text': {
    design: {
      title: 'default',
      structure: {
        type: 'chart-line',
        gap: 16,
      },
      items: [
        {
          type: 'plain-text',
          width: 200,
          lineNumber: 2,
        },
      ],
    },
  },
  'chart-pie-plain-text': {
    design: {
      title: 'default',
      structure: {
        type: 'chart-pie',
        gap: 16,
      },
      items: [
        {
          type: 'plain-text',
          width: 180,
        },
      ],
    },
  },
  'chart-pie-compact-card': {
    design: {
      title: 'default',
      structure: {
        type: 'chart-pie',
        gap: 16,
      },
      items: [
        {
          type: 'compact-card',
          width: 200,
          height: 70,
          iconSize: 24,
        },
      ],
    },
  },
  'chart-pie-pill-badge': {
    design: {
      title: 'default',
      structure: {
        type: 'chart-pie',
        gap: 16,
      },
      items: [
        {
          type: 'pill-badge',
          width: 180,
        },
      ],
    },
  },
  'chart-pie-donut-plain-text': {
    design: {
      title: 'default',
      structure: {
        type: 'chart-pie',
        innerRadius: 90,
        gap: 16,
      },
      items: [
        {
          type: 'plain-text',
          width: 180,
        },
      ],
    },
  },
  'chart-pie-donut-compact-card': {
    design: {
      title: 'default',
      structure: {
        type: 'chart-pie',
        innerRadius: 90,
        gap: 16,
      },
      items: [
        {
          type: 'compact-card',
          width: 200,
          height: 70,
          iconSize: 24,
        },
      ],
    },
  },
  'chart-pie-donut-pill-badge': {
    design: {
      title: 'default',
      structure: {
        type: 'chart-pie',
        innerRadius: 90,
        gap: 16,
      },
      items: [
        {
          type: 'pill-badge',
          width: 180,
        },
      ],
    },
  },
  ...hierarchyTreeTemplates,
  ...hierarchyMindmapTemplates,
  ...sequenceStairsTemplates,
  ...wordCloudTemplate,
};

Object.entries(BUILT_IN_TEMPLATES).forEach(([name, options]) => {
  registerTemplate(name, options);
});
