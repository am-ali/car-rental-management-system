import { useForm } from 'react-hook-form';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import { X } from 'lucide-react';
import { updateBranch } from '../../lib/api';

interface EditBranchModalProps {
  isOpen: boolean;
  onClose: () => void;
  branch: {
    _id: string;
    name: string;
    address: string;
    city: string;
    contactNumber: string;
    email: string;
    coordinates?: {
      latitude: number;
      longitude: number;
    };
  };
}

export default function EditBranchModal({ isOpen, onClose, branch }: EditBranchModalProps) {
  const queryClient = useQueryClient();
  const { register, handleSubmit } = useForm({
    defaultValues: {
      name: branch.name,
      address: branch.address,
      city: branch.city,
      contactNumber: branch.contactNumber,
      email: branch.email,
      latitude: branch.coordinates?.latitude,
      longitude: branch.coordinates?.longitude,
    }
  });

  const updateBranchMutation = useMutation({
    mutationFn: (data: any) => updateBranch(branch._id, {
      ...data,
      coordinates: {
        latitude: parseFloat(data.latitude) || 0,
        longitude: parseFloat(data.longitude) || 0
      }
    }),
    onSuccess: () => {
      queryClient.invalidateQueries(['branches']);
      toast.success('Branch updated successfully');
      onClose();
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to update branch');
    },
  });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[60]">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Edit Branch</h2>
          <button onClick={onClose}>
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit(updateBranchMutation.mutate)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Branch Name</label>
            <input
              {...register('name')}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Address</label>
            <input
              {...register('address')}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">City</label>
            <input
              {...register('city')}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Contact Number</label>
            <input
              {...register('contactNumber')}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              {...register('email')}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Latitude</label>
              <input
                type="number"
                step="any"
                {...register('latitude')}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Longitude</label>
              <input
                type="number"
                step="any"
                {...register('longitude')}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
              />
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