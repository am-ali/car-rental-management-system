import { useState } from 'react';
import { Car, Calendar, ChevronDown, ChevronUp, ListFilter } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

interface CarUsageDistributionProps {
  data: Array<{
    car: {
      _id: string;
      make: string;
      model: string;
      year: number;
      licensePlate: string;
      category: {
        name?: string;
      };
    };
    totalBookings: number;
    totalDays: number;
  }>;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#a4de6c', '#d0ed57'];

export default function CarUsageDistribution({ data }: CarUsageDistributionProps) {
  const [showList, setShowList] = useState(false);
  
  if (!data) return null;

  // Sort cars by total bookings in descending order
  const sortedData = [...data].sort((a, b) => b.totalBookings - a.totalBookings);
  const top10Cars = sortedData.slice(0, 10);
  
  // Prepare data for pie chart
  const chartData = top10Cars.map(item => ({
    name: `${item.car.make} ${item.car.model}`,
    value: item.totalBookings,
    details: item
  }));

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload.details;
      return (
        <div className="bg-white p-4 rounded-lg shadow-lg border">
          <p className="font-medium">{`${data.car.make} ${data.car.model} ${data.car.year}`}</p>
          <p className="text-gray-600">{data.car.licensePlate}</p>
          <p className="text-blue-600">{`${data.totalBookings} bookings`}</p>
          <p className="text-gray-500">{`${data.totalDays} days`}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <button
          onClick={() => setShowList(!showList)}
          className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
        >
          <ListFilter className="w-4 h-4 mr-2" />
          {showList ? 'Show Chart' : 'Show List'}
        </button>
      </div>

      {showList ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {top10Cars.map((item) => (
            <div key={item.car._id} className="bg-gray-50 p-4 rounded-lg">
              <div className="flex justify-between items-start">
                <div>
                  <div className="flex items-center">
                    <Car className="w-5 h-5 text-gray-600 mr-2" />
                    <span className="font-medium">
                      {`${item.car.make} ${item.car.model} ${item.car.year}`}
                    </span>
                  </div>
                  <div className="text-sm text-gray-500 mt-1">
                    {item.car.licensePlate}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium">
                    {item.totalBookings} bookings
                  </div>
                  <div className="flex items-center text-sm text-gray-500">
                    <Calendar className="w-4 h-4 mr-1" />
                    {item.totalDays} days
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                labelLine={false}   
                outerRadius={150}
                fill="#8884d8"
                dataKey="value"
                //label={({ name, value }) => `${name} (${value})`}
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      )}

      {sortedData.length > 10 && (
        <div className="text-center text-sm text-gray-500">
          Showing top 10 cars out of {sortedData.length} total cars
        </div>
      )}
    </div>
  );
} 