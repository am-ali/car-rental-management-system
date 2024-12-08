import { X, Edit, Trash2 } from 'lucide-react';
import { useState } from 'react';
import EditCarModal from './EditCarModal';

interface CarDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  car: any;
  onDelete: (carId: string) => void;
}

export default function CarDetailsModal({ isOpen, onClose, car, onDelete }: CarDetailsModalProps) {
  const [showEditModal, setShowEditModal] = useState(false);

  if (!isOpen || !car) return null;

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this car?')) {
      onDelete(car._id);
      onClose();
    }
  };

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50" />
      <div className="fixed inset-0 flex items-center justify-center z-50 p-4 overflow-y-auto">
        <div className="bg-white rounded-lg max-w-3xl w-full p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">Car Details</h2>
            <button onClick={onClose}>
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="grid grid-cols-2 gap-6">
            {/* Image Section */}
            <div className="col-span-2 md:col-span-1">
              <img
                src={car.images?.[0] || '/placeholder-car.jpg'}
                alt={`${car.make} ${car.model}`}
                className="w-full h-64 object-cover rounded-lg"
              />
            </div>

            {/* Details Section */}
            <div className="col-span-2 md:col-span-1 space-y-4">
              <div>
                <h3 className="text-xl font-semibold">
                  {car.make} {car.model} ({car.year})
                </h3>
                <p className="text-gray-600">License Plate: {car.licensePlate}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Category</p>
                  <p className="font-medium">{car.category?.name}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Daily Rate</p>
                  <p className="font-medium">${car.dailyRate}/day</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Status</p>
                  <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    car.status === 'available' 
                      ? 'bg-green-100 text-green-800'
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {car.status}
                  </span>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Transmission</p>
                  <p className="font-medium capitalize">{car.transmission}</p>
                </div>
              </div>

              <div>
                <p className="text-sm text-gray-500">Branch</p>
                <p className="font-medium">{car.branch?.name}</p>
                <p className="text-sm text-gray-600">{car.branch?.address}, {car.branch?.city}</p>
              </div>

              {car.features?.length > 0 && (
                <div>
                  <p className="text-sm text-gray-500">Features</p>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {car.features.map((feature: string) => (
                      <span key={feature} className="px-2 py-1 bg-gray-100 rounded-full text-sm">
                        {feature}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  onClick={() => setShowEditModal(true)}
                  className="flex items-center px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  <Edit className="w-4 h-4 mr-2" />
                  Edit
                </button>
                <button
                  onClick={handleDelete}
                  className="flex items-center px-3 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showEditModal && (
        <EditCarModal
          isOpen={showEditModal}
          onClose={() => setShowEditModal(false)}
          car={car}
        />
      )}
    </>
  );
} 