import type { ComponentType } from '../../jsx';
import type { BaseStructureProps } from './types';
export interface ChartPieProps extends BaseStructureProps {
    radius?: number;
    innerRadius?: number;
    padding?: number;
    showPercentage?: boolean;
}
export declare const ChartPie: ComponentType<ChartPieProps>;
