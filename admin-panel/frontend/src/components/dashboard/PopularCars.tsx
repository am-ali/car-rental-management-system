import { useState } from 'react';
import { Car, Calendar, ChevronLeft, ChevronRight } from 'lucide-react';

interface PopularCarsProps {
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

export default function PopularCars({ data }: PopularCarsProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const carsPerPage = 3;
  
  if (!data) return null;

  const sortedCars = [...data].sort((a, b) => b.totalBookings - a.totalBookings);
  const maxBookings = sortedCars[0]?.totalBookings || 1;
  
  // Calculate pagination
  const totalPages = Math.ceil(sortedCars.length / carsPerPage);
  const startIndex = (currentPage - 1) * carsPerPage;
  const displayCars = sortedCars.slice(startIndex, startIndex + carsPerPage);

  const handlePrevPage = () => {
    setCurrentPage(prev => Math.max(prev - 1, 1));
  };

  const handleNextPage = () => {
    setCurrentPage(prev => Math.min(prev + 1, totalPages));
  };

  return (
    <div className="space-y-4">
      {displayCars.map((item) => (
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
          <div className="mt-2 h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-blue-600 rounded-full"
              style={{
                width: `${Math.min((item.totalBookings / maxBookings) * 100, 100)}%`
              }}
            />
          </div>
        </div>
      ))}

      {totalPages > 1 && (
        <div className="flex items-center justify-between pt-4 border-t">
          <button
            onClick={handlePrevPage}
            disabled={currentPage === 1}
            className="flex items-center px-3 py-1 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="w-4 h-4 mr-1" />
            Previous
          </button>
          <span className="text-sm text-gray-600">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={handleNextPage}
            disabled={currentPage === totalPages}
            className="flex items-center px-3 py-1 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
            <ChevronRight className="w-4 h-4 ml-1" />
          </button>
        </div>
      )}
    </div>
  );
} 