import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import { X, Image as ImageIcon } from 'lucide-react';
import { updateCar, fetchCategories, fetchBranches } from '../../lib/api';

interface Car {
  _id?: string;
  make?: string;
  model?: string;
  year?: number;
  licensePlate?: string;
  status?: string;
  dailyRate?: number;
  images?: string[];
  category?: string;
  branch?: string;
  transmission?: string;
}

interface EditCarModalProps {
  isOpen: boolean;
  onClose: () => void;
  car: Car | null;
}

export default function EditCarModal({ isOpen, onClose, car }: EditCarModalProps) {
  const [imagePreview, setImagePreview] = useState<string[]>(car?.images || []);
  const queryClient = useQueryClient();
  const { register, handleSubmit, reset } = useForm({
    defaultValues: car || {},
    mode: 'onSubmit',
    reValidateMode: 'onChange',
  });

  const { data: categoriesData } = useQuery({
    queryKey: ['categories'],
    queryFn: fetchCategories
  });

  const { data: branchesData } = useQuery({
    queryKey: ['branches'],
    queryFn: fetchBranches
  });

  const updateCarMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => updateCar(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries(['cars']);
      toast.success('Car updated successfully');
      onClose();
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to update car');
    },
  });

  const onSubmit = async (data: any) => {
    if (!car?._id) return;

    try {
      const formData = Object.fromEntries(
        Object.entries({
          ...data,
          images: imagePreview
        }).filter(([_, value]) => value !== undefined && value !== '')
      );

      await updateCarMutation.mutateAsync({ id: car._id, data: formData });
    } catch (error) {
      console.error('Form submission error:', error);
    }
  };

  if (!isOpen || !car) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Edit Car</h2>
          <button onClick={onClose}>
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Make</label>
              <input
                {...register('make')}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Model</label>
              <input
                {...register('model')}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Year</label>
              <input
                type="number"
                {...register('year')}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">License Plate</label>
              <input
                {...register('licensePlate')}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Category</label>
              <select
                {...register('category')}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
              >
                {categoriesData?.data?.map((category: any) => (
                  <option key={category._id} value={category._id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Branch</label>
              <select
                {...register('branch')}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
              >
                {branchesData?.data?.map((branch: any) => (
                  <option key={branch._id} value={branch._id}>
                    {branch.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Daily Rate</label>
              <input
                type="number"
                {...register('dailyRate')}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Status</label>
              <select
                {...register('status')}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
              >
                <option value="available">Available</option>
                <option value="rented">Rented</option>
                <option value="maintenance">Maintenance</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Transmission</label>
              <select
                {...register('transmission')}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
              >
                <option value="automatic">Automatic</option>
                <option value="manual">Manual</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end space-x-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border rounded-md hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 