import { type IconName } from "./dynamic-icon";

export type TimePeriod = 'today' | 'week' | 'month' | 'year' | 'custom';
export type ActiveView = 'expense' | 'income' | 'profit';

export interface CategoryItem {
  id: string | number;
  name: string;
  color: string;
  icon: IconName | string;
}

export interface PeriodItem {
  name: string;
  value: number;
  color?: string;
}

export interface MockPeriodData {
  expense: {
    current: PeriodItem[];
    previous: PeriodItem[];
    totalCurrent: number;
    totalPrevious: number;
  };
  income: {
    current: PeriodItem[];
    previous: PeriodItem[];
    totalCurrent: number;
    totalPrevious: number;
  };
}