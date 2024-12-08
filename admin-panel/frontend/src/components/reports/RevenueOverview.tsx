import { DollarSign, TrendingUp, Calendar } from 'lucide-react';

interface RevenueOverviewProps {
  data: {
    totalRevenue: number;
    payments: Array<{
      _id: string;
      amount: number;
      paymentMethod: string;
      status: string;
      createdAt: string;
      booking: {
        car: string;
        startDate: string;
        endDate: string;
        status: string;
        totalAmount: number;
      };
      paymentDetails: {
        last4: string;
        brand: string;
        email: string;
      };
    }>;
  };
}

export default function RevenueOverview({ data }: RevenueOverviewProps) {
  if (!data) return null;

  const averageRevenue = data.payments.length > 0 
    ? data.totalRevenue / data.payments.length 
    : 0;

  const recentPayments = data.payments
    .slice(0, 5)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-blue-50 p-4 rounded-lg">
          <div className="flex items-center text-blue-600 mb-2">
            <DollarSign className="w-5 h-5 mr-2" />
            <span className="text-sm font-medium">Total Revenue</span>
          </div>
          <div className="text-2xl font-bold text-blue-700">
            ${data.totalRevenue.toFixed(2)}
          </div>
        </div>
        <div className="bg-green-50 p-4 rounded-lg">
          <div className="flex items-center text-green-600 mb-2">
            <TrendingUp className="w-5 h-5 mr-2" />
            <span className="text-sm font-medium">Average Booking Value</span>
          </div>
          <div className="text-2xl font-bold text-green-700">
            ${averageRevenue.toFixed(2)}
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-sm font-medium text-gray-600 mb-3">Recent Payments</h3>
        <div className="space-y-2">
          {recentPayments.map((payment) => (
            <div key={payment._id} className="flex justify-between items-center p-3 bg-gray-50 rounded-md">
              <div>
                <div className="font-medium">${payment.amount.toFixed(2)}</div>
                <div className="text-sm text-gray-500">
                  {payment.paymentDetails.brand} **** {payment.paymentDetails.last4}
                </div>
              </div>
              <div className="flex items-center text-gray-500">
                <Calendar className="w-4 h-4 mr-2" />
                <span className="text-sm">
                  {new Date(payment.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 