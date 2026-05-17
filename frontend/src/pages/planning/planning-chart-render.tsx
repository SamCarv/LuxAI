import { Bar, BarChart, Cell, Pie, PieChart, XAxis, YAxis } from "recharts";
import { ChartTooltip, ChartTooltipContent } from "../../components/ui/chart";
import { type ActiveView } from "./types";

interface PlanningChartRenderProps {
  activeView: ActiveView;
  isComparing: boolean;
  profitChartData: any[];
  pieChartData: any[];
  comparisonChartData: any[];
}

export const PlanningChartRender = ({
  activeView,
  isComparing,
  profitChartData,
  pieChartData,
  comparisonChartData
}: PlanningChartRenderProps) => {
  
  if (activeView === 'profit') {
    return (
      <BarChart data={profitChartData}>
        <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false}/>
        <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `R$${value}`}/>
        <ChartTooltip content={<ChartTooltipContent />} />
        {isComparing ? (
          <Bar dataKey="lucro" fill="var(--color-primary)" radius={[4, 4, 0, 0]} />
        ) : (
          <Bar dataKey="valor" radius={[4, 4, 0, 0]}>
            {profitChartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.fill} />
            ))}
          </Bar>
        )}
      </BarChart>
    );
  }

  if (!isComparing) {
    return (
      <PieChart>
        <ChartTooltip content={<ChartTooltipContent hideLabel />} />
        <Pie 
          data={pieChartData} 
          dataKey="value" 
          nameKey="name" 
          innerRadius={60}
          strokeWidth={5}
        />
      </PieChart>
    );
  }

  return (
    <BarChart data={comparisonChartData} layout="vertical" margin={{ left: 20 }}>
      <XAxis type="number" hide />
      <YAxis dataKey="name" type="category" stroke="#888888" fontSize={12} tickLine={false} />
      <ChartTooltip content={<ChartTooltipContent />} />
      <Bar dataKey="anterior" fill="#94a3b8" radius={5} barSize={12} name="Período Anterior" />
      <Bar dataKey="atual" fill="#3b82f6" radius={5} barSize={12} name="Período Atual" />
    </BarChart>
  );
};