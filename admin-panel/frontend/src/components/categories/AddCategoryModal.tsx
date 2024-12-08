import { useForm } from 'react-hook-form';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import { X } from 'lucide-react';
import { addCategory } from '../../lib/api';

interface AddCategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AddCategoryModal({ isOpen, onClose }: AddCategoryModalProps) {
  const queryClient = useQueryClient();
  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  const addCategoryMutation = useMutation({
    mutationFn: addCategory,
    onSuccess: () => {
      queryClient.invalidateQueries(['categories']);
      toast.success('Category added successfully');
      reset();
      onClose();
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to add category');
    },
  });

  const onSubmit = (data: any) => {
    // Convert basePrice to number
    const categoryData = {
      ...data,
      basePrice: parseFloat(data.basePrice)
    };
    addCategoryMutation.mutate(categoryData);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Add New Category</h2>
          <button onClick={onClose}>
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Category Name</label>
            <input
              {...register('name', { required: 'Category name is required' })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
              placeholder="e.g., Luxury, SUV, Economy"
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-600">{errors.name.message as string}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Description</label>
            <textarea
              {...register('description')}
              rows={3}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
              placeholder="Brief description of the category"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Base Price</label>
            <div className="mt-1 relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="text-gray-500 sm:text-sm">$</span>
              </div>
              <input
                type="number"
                step="0.01"
                {...register('basePrice', { 
                  required: 'Base price is required',
                  min: { value: 0, message: 'Price must be positive' }
                })}
                className="pl-7 block w-full rounded-md border-gray-300 shadow-sm"
                placeholder="0.00"
              />
            </div>
            {errors.basePrice && (
              <p className="mt-1 text-sm text-red-600">{errors.basePrice.message as string}</p>
            )}
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
              Add Category
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 