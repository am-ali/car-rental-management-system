import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getRevenueReport, getUsageReport, getTrendsReport } from '../lib/api';
import RevenueOverview from '../components/reports/RevenueOverview';
import CarUsageDistribution from '../components/reports/CarUsageDistribution';
import BookingTrends from '../components/reports/BookingTrends';
import DateRangePicker from '../components/reports/DateRangePicker';

export default function Reports() {
  const [dateRange, setDateRange] = useState({
    startDate: new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0], // First day of current month
    endDate: new Date().toISOString().split('T')[0] // Today
  });

  const { data: revenueData, isLoading: isLoadingRevenue } = useQuery({
    queryKey: ['revenue', dateRange],
    queryFn: () => getRevenueReport(dateRange.startDate, dateRange.endDate)
  });

  const { data: usageData, isLoading: isLoadingUsage } = useQuery({
    queryKey: ['usage'],
    queryFn: getUsageReport
  });

  const { data: trendsData, isLoading: isLoadingTrends } = useQuery({
    queryKey: ['trends'],
    queryFn: getTrendsReport
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Reports & Analytics</h1>
        <DateRangePicker
          startDate={dateRange.startDate}
          endDate={dateRange.endDate}
          onChange={setDateRange}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Overview */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-lg font-semibold mb-4">Revenue Overview</h2>
          {isLoadingRevenue ? (
            <div>Loading...</div>
          ) : (
            <RevenueOverview data={revenueData?.data} />
          )}
        </div>

        {/* Car Usage Distribution */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-lg font-semibold mb-4">Car Usage Distribution</h2>
          {isLoadingUsage ? (
            <div>Loading...</div>
          ) : (
            <CarUsageDistribution data={usageData?.data} />
          )}
        </div>

        {/* Booking Trends */}
        <div className="bg-white p-6 rounded-lg shadow-sm lg:col-span-2">
          <h2 className="text-lg font-semibold mb-4">Booking Trends</h2>
          {isLoadingTrends ? (
            <div>Loading...</div>
          ) : (
            <BookingTrends data={trendsData?.data} />
          )}
        </div>
      </div>
    </div>
  );
}
