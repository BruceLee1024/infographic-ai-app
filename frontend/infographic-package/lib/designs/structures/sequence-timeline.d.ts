import type { ComponentType } from '../../jsx';
import type { BaseStructureProps } from './types';
export interface SequenceTimelineProps extends BaseStructureProps {
    gap?: number;
    lineOffset?: number;
}
export declare const SequenceTimeline: ComponentType<SequenceTimelineProps>;
