import { useMemo } from "react";
import { mockPeriodData } from "./constants";
import { type ActiveView } from "./types";

export const usePlanningCharts = (activeView: ActiveView, isComparing: boolean) => {
  
  const pieChartData = useMemo(() => {
    if (activeView === 'profit') return [];
    
    return mockPeriodData[activeView].current.map(item => {
      const safeColor = 'color' in item ? item.color : undefined;
      return {
        name: item.name,
        value: item.value,
        fill: safeColor || (activeView === 'income' ? '#22c55e' : '#3b82f6')
      };
    });
  }, [activeView]);

  const comparisonChartData = useMemo(() => {
    if (activeView === 'profit') return [];
    
    const currentSource = mockPeriodData[activeView].current;
    const previousSource = mockPeriodData[activeView].previous;

    return currentSource.map((item, index) => ({
      name: item.name,
      atual: item.value,
      anterior: previousSource[index]?.value || 0
    }));
  }, [activeView]);

  const profitChartData = useMemo(() => {
    if (isComparing) {
      return [
        { name: "Período Anterior", lucro: mockPeriodData.income.totalPrevious - mockPeriodData.expense.totalPrevious },
        { name: "Período Atual", lucro: mockPeriodData.income.totalCurrent - mockPeriodData.expense.totalCurrent },
      ];
    }
    return [
      { name: "Ganhos", valor: mockPeriodData.income.totalCurrent, fill: "#22c55e" },
      { name: "Gastos", valor: mockPeriodData.expense.totalCurrent, fill: "#ef4444" },
    ];
  }, [isComparing]);

  return { pieChartData, comparisonChartData, profitChartData };
};