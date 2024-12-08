import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface DashboardChartProps {
  data: {
    [key: string]: number;
  };
}

export default function DashboardChart({ data }: DashboardChartProps) {
  if (!data) return null;

  const chartData = Object.entries(data)
    .map(([month, value]) => ({
      month: formatMonth(month),
      revenue: value
    }))
    .slice(-6); // Show last 6 months

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis 
          dataKey="month"
          angle={-45}
          textAnchor="end"
          height={60}
          interval={0}
          tick={{ fontSize: 12 }}
        />
        <YAxis />
        <Tooltip
          formatter={(value: number) => [`$${value.toLocaleString()}`, 'Revenue']}
          labelFormatter={(label: string) => `Month: ${label}`}
        />
        <Bar 
          dataKey="revenue" 
          fill="#3B82F6"
          radius={[4, 4, 0, 0]}
        />
      </BarChart>
    </ResponsiveContainer>
  );
}

function formatMonth(monthStr: string): string {
  const [year, month] = monthStr.split('-');
  const date = new Date(Number(year), Number(month) - 1);
  return date.toLocaleString('default', { month: 'short', year: 'numeric' });
} 