import { useState } from 'react';
import { X } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';
import { updateStaff, fetchBranches } from '../../lib/api';
import { toast } from 'react-hot-toast';

interface EditStaffModalProps {
  isOpen: boolean;
  onClose: () => void;
  staff: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    status: string;
    branch: {
      _id: string;
      name: string;
    };
  };
}

export default function EditStaffModal({ isOpen, onClose, staff }: EditStaffModalProps) {
  const queryClient = useQueryClient();
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      firstName: staff.firstName,
      lastName: staff.lastName,
      email: staff.email,
      phoneNumber: staff.phoneNumber,
      status: staff.status,
      branch: staff.branch._id,
    }
  });

  const { data: branchesData } = useQuery({
    queryKey: ['branches'],
    queryFn: fetchBranches
  });

  const updateStaffMutation = useMutation({
    mutationFn: (data: any) => updateStaff(staff._id, data),
    onSuccess: () => {
      queryClient.invalidateQueries(['staff']);
      toast.success('Staff member updated successfully');
      onClose();
    },
    onError: (error: any) => {
      console.error('Update staff error:', error);
      toast.error(error.message || 'Failed to update staff member');
    },
  });

  const onSubmit = async (data: any) => {
    try {
      await updateStaffMutation.mutateAsync(data);
    } catch (error) {
      console.error('Error updating staff:', error);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 z-[60]" />
      <div className="fixed inset-0 flex items-center justify-center z-[70]">
        <div className="bg-white rounded-lg p-6 w-full max-w-md">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Edit Staff Member</h2>
            <button onClick={onClose}>
              <X className="w-6 h-6" />
            </button>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">First Name</label>
              <input
                type="text"
                {...register('firstName')}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Last Name</label>
              <input
                type="text"
                {...register('lastName')}
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

            <div>
              <label className="block text-sm font-medium text-gray-700">Phone Number</label>
              <input
                type="tel"
                {...register('phoneNumber')}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Branch</label>
              <select
                {...register('branch')}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
              >
                <option value="">Select a branch</option>
                {branchesData?.data?.map((branch: any) => (
                  <option key={branch._id} value={branch._id}>
                    {branch.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Status</label>
              <select
                {...register('status')}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
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
    </>
  );
} 