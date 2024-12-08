import { useForm } from 'react-hook-form';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import { X } from 'lucide-react';
import { updateCategory } from '../../lib/api';

interface EditCategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  category: {
    _id: string;
    name: string;
    description: string;
    basePrice: number;
  };
}

export default function EditCategoryModal({ isOpen, onClose, category }: EditCategoryModalProps) {
  const queryClient = useQueryClient();
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      name: category.name,
      description: category.description,
      basePrice: category.basePrice
    }
  });

  const updateCategoryMutation = useMutation({
    mutationFn: (data: any) => updateCategory(category._id, {
      ...data,
      basePrice: parseFloat(data.basePrice)
    }),
    onSuccess: () => {
      queryClient.invalidateQueries(['categories']);
      toast.success('Category updated successfully');
      onClose();
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to update category');
    },
  });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Edit Category</h2>
          <button onClick={onClose}>
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit(updateCategoryMutation.mutate)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Category Name</label>
            <input
              {...register('name', { required: 'Category name is required' })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
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
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 