import { useState } from 'react';
import { Edit, Trash2 } from 'lucide-react';
import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';
import { deleteCar, getCarById } from '../../lib/api';
import { toast } from 'react-hot-toast';
import EditCarModal from './EditCarModal';
import CarDetailsModal from './CarDetailsModal';

interface Car {
  _id: string;
  make: string;
  model: string;
  year: number;
  licensePlate: string;
  status: string;
  dailyRate: number;
  images: string[];
}

interface CarListProps {
  cars: Car[];
}

export default function CarList({ cars }: CarListProps) {
  const [editingCar, setEditingCar] = useState<Car | null>(null);
  const [selectedCarId, setSelectedCarId] = useState<string | null>(null);
  const queryClient = useQueryClient();

  const deleteCarMutation = useMutation({
    mutationFn: deleteCar,
    onSuccess: () => {
      queryClient.invalidateQueries(['cars']);
      toast.success('Car deleted successfully');
    },
    onError: (error: any) => {
      console.error('Delete car error:', error);
      toast.error(error.message || 'Failed to delete car');
    },
  });

  const handleDeleteCar = async (carId: string) => {
    if (window.confirm('Are you sure you want to delete this car?')) {
      try {
        await deleteCarMutation.mutateAsync(carId);
      } catch (error) {
        console.error('Error deleting car:', error);
      }
    }
  };

  const handleEditCar = (car: Car) => {
    setEditingCar(car);
  };

  const { data: selectedCar } = useQuery({
    queryKey: ['car', selectedCarId],
    queryFn: () => selectedCarId ? getCarById(selectedCarId) : null,
    enabled: !!selectedCarId
  });

  return (
    <>
      <div className="bg-white shadow-sm rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Car
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                License Plate
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Daily Rate
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {cars?.map((car) => (
              <tr key={car._id} onClick={() => setSelectedCarId(car._id)} className="cursor-pointer hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-16 w-24 mr-4">
                      <img
                        src={car.images?.[0] || '/placeholder-car.jpg'}
                        alt={`${car.make} ${car.model}`}
                        className="h-16 w-24 object-cover rounded-md"
                      />
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {car.make} {car.model}
                      </div>
                      <div className="text-sm text-gray-500">{car.year}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {car.licensePlate}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    car.status === 'available' 
                      ? 'bg-green-100 text-green-800'
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {car.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  ${car.dailyRate}/day
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button 
                    onClick={() => handleEditCar(car)}
                    className="text-blue-600 hover:text-blue-900 mr-3"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => handleDeleteCar(car._id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <EditCarModal
        isOpen={!!editingCar}
        onClose={() => setEditingCar(null)}
        car={editingCar}
      />

      {selectedCarId && (
        <CarDetailsModal
          isOpen={!!selectedCarId}
          onClose={() => setSelectedCarId(null)}
          car={selectedCar?.data}
          onDelete={handleDeleteCar}
        />
      )}
    </>
  );
}