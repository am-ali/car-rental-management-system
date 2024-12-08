import { useState } from 'react';
import { Edit, Trash2, MapPin } from 'lucide-react';
import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';
import { deleteBranch, getBranchById } from '../../lib/api';
import { toast } from 'react-hot-toast';
import EditBranchModal from './EditBranchModal';
import BranchDetailsModal from './BranchDetailsModal';

interface Branch {
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
}

interface BranchListProps {
  branches: Branch[];
}

export default function BranchList({ branches }: BranchListProps) {
  const [selectedBranchId, setSelectedBranchId] = useState<string | null>(null);
  const [editingBranch, setEditingBranch] = useState<Branch | null>(null);
  const queryClient = useQueryClient();

  const { data: selectedBranch } = useQuery({
    queryKey: ['branch', selectedBranchId],
    queryFn: () => selectedBranchId ? getBranchById(selectedBranchId) : null,
    enabled: !!selectedBranchId
  });

  const deleteBranchMutation = useMutation({
    mutationFn: deleteBranch,
    onSuccess: () => {
      queryClient.invalidateQueries(['branches']);
      toast.success('Branch deleted successfully');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to delete branch');
    },
  });

  const handleDelete = async (branchId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this branch?')) {
      try {
        await deleteBranchMutation.mutateAsync(branchId);
      } catch (error) {
        console.error('Error deleting branch:', error);
      }
    }
  };

  return (
    <>
      <div className="bg-white shadow-sm rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Branch
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Location
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Contact
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {branches?.map((branch) => (
              <tr
                key={branch._id}
                onClick={() => setSelectedBranchId(branch._id)}
                className="cursor-pointer hover:bg-gray-50"
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{branch.name}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center text-sm text-gray-500">
                    <MapPin className="w-4 h-4 mr-2" />
                    {branch.city}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{branch.contactNumber}</div>
                  <div className="text-sm text-gray-500">{branch.email}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setEditingBranch(branch);
                    }}
                    className="text-blue-600 hover:text-blue-900 mr-3"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={(e) => handleDelete(branch._id, e)}
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

      {selectedBranchId && (
        <BranchDetailsModal
          isOpen={!!selectedBranchId}
          onClose={() => setSelectedBranchId(null)}
          branch={selectedBranch?.data}
          onDelete={handleDelete}
        />
      )}

      {editingBranch && (
        <EditBranchModal
          isOpen={!!editingBranch}
          onClose={() => setEditingBranch(null)}
          branch={editingBranch}
        />
      )}
    </>
  );
} 