import { useQuery } from '@tanstack/react-query';
import { Car, Users, DollarSign, UserCircle } from 'lucide-react';
import { getRevenueReport, getUsageReport, getTrendsReport, fetchStaff } from '../lib/api';
import DashboardChart from '../components/dashboard/DashboardChart';
import StatsCard from '../components/dashboard/StatsCard';
import PopularCars from '../components/dashboard/PopularCars';

export default function Dashboard() {
  const endDate = new Date().toISOString().split('T')[0];
  const startDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

  const { data: revenueData } = useQuery({
    queryKey: ['revenue', startDate, endDate],
    queryFn: () => getRevenueReport(startDate, endDate)
  });

  const { data: usageData } = useQuery({
    queryKey: ['usage'],
    queryFn: getUsageReport
  });

  const { data: trendsData } = useQuery({
    queryKey: ['trends'],
    queryFn: getTrendsReport
  });

  const { data: staffData, isLoading } = useQuery({
    queryKey: ['staff'],
    queryFn: fetchStaff
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  const activeStaffCount = staffData?.data?.filter(staff => staff.status === 'active').length || 0;

  const stats = [
    { 
      name: 'Total Cars', 
      value: usageData?.data?.length.toString() || '0',
      icon: Car,
      link: '/cars'
    },
    { 
      name: 'Total Bookings', 
      value: trendsData?.data?.totalBookings.toString() || '0',
      icon: Users,
    },
    { 
      name: 'Revenue', 
      value: `$${revenueData?.data?.totalRevenue.toLocaleString() || '0'}`,
      icon: DollarSign 
    },
    { 
      name: 'Active Staff', 
      value: activeStaffCount.toString(),
      icon: UserCircle,
      link: '/staff'
    }
  ];

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold">Dashboard</h1>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <StatsCard key={stat.name} stat={stat} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-lg font-semibold mb-4">Monthly Bookings</h2>
          <div className="h-80">
            <DashboardChart data={trendsData?.data?.monthlyTrends} />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-lg font-semibold mb-4">Popular Cars</h2>
          <PopularCars data={usageData?.data} />
        </div>
      </div>
    </div>
  );
}