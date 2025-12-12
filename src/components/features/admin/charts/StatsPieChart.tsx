"use client";


import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";


interface ChartDataPoint {
  name: string;
  value: number;
  color: string;
  [ key: string ]: any;
}


interface StatsPieChartProps {
  data: ChartDataPoint[];
}


export function StatsPieChart({ data }: StatsPieChartProps) {
  if (!data || data.length === 0) {
    return (
      <div className="text-center text-sm text-muted-foreground">
        No data available for chart.
      </div>
    );
  }

  return (
    <ResponsiveContainer
      width="100%"
      height={ 250 }
    >
      <PieChart>
        <Tooltip
          contentStyle={ {
            background: "hsl(var(--background))",
            borderColor: "hsl(var(--border))",
            borderRadius: "var(--radius)",
          } }
        />

        <Legend
          verticalAlign="bottom"
          height={ 36 }
          iconType="circle"
        />

        <Pie
          data={ data }
          dataKey="value"
          nameKey="name"
          cx="50%"
          cy="50%"
          outerRadius={ 80 }
          innerRadius={ 60 }
          paddingAngle={ 3 }
          labelLine={ false }
        >
          {
            data.map((entry, index) => (
              <Cell
                key={ `cell-${index}` }
                fill={ entry.color }
              />
            ))
          }
        </Pie>
      </PieChart>
    </ResponsiveContainer>
  );
}
