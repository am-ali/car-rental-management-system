import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp } from 'lucide-react';

interface BookingTrendsProps {
  data: {
    totalBookings: number;
    monthlyTrends: {
      [key: string]: number;
    };
  };
}

export default function BookingTrends({ data }: BookingTrendsProps) {
  if (!data) return null;

  // Transform the monthly trends data for the chart
  const chartData = Object.entries(data.monthlyTrends)
    .map(([month, count]) => ({
      month: formatMonth(month),
      bookings: count,
    }))
    .sort((a, b) => {
      const [yearA, monthA] = a.month.split(' ');
      const [yearB, monthB] = b.month.split(' ');
      return new Date(Number(yearA), Number(monthA) - 1).getTime() - 
             new Date(Number(yearB), Number(monthB) - 1).getTime();
    });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center text-blue-600">
          <TrendingUp className="w-5 h-5 mr-2" />
          <span className="font-medium">Total Bookings: {data.totalBookings}</span>
        </div>
      </div>

      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="month"
              angle={-45}
              textAnchor="end"
              height={70}
              interval={0}
              tick={{ fontSize: 12 }}
            />
            <YAxis />
            <Tooltip
              formatter={(value: number) => [`${value} bookings`, 'Bookings']}
              labelFormatter={(label: string) => `Month: ${label}`}
            />
            <Bar 
              dataKey="bookings" 
              fill="#3B82F6"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

// Helper function to format month string
function formatMonth(monthStr: string): string {
  const [year, month] = monthStr.split('-');
  const date = new Date(Number(year), Number(month) - 1);
  return date.toLocaleString('default', { month: 'short', year: 'numeric' });
} 