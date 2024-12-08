import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Plus, Search } from 'lucide-react';
import { fetchCars } from '../lib/api';
import CarList from '../components/cars/CarList';
import AddCarModal from '../components/cars/AddCarModal';

export default function Cars() {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const { data: cars, isLoading } = useQuery({
    queryKey: ['cars'],
    queryFn: fetchCars
  });

  const filteredCars = cars?.data?.filter((car: any) => {
    const searchTerms = searchQuery.toLowerCase().trim().split(/\s+/);
    const carString = `${car.make} ${car.model}`.toLowerCase();
    
    // Return true if all search terms are found in the car string
    return searchTerms.every(term => carString.includes(term));
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Cars</h1>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Car
        </button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        <input
          type="text"
          placeholder="Search cars..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10 pr-4 py-2 w-full border rounded-md"
        />
      </div>

      {isLoading ? (
        <div>Loading...</div>
      ) : (
        <CarList cars={filteredCars} />
      )}

      <AddCarModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
      />
    </div>
  );
}