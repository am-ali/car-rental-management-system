import { Edit, Trash2, Mail } from 'lucide-react';
import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';
import { deleteStaff, getStaffById } from '../../lib/api';
import { toast } from 'react-hot-toast';
import { useState } from 'react';
import EditStaffModal from './EditStaffModal';
import StaffDetailsModal from './StaffDetailsModal';
import ConfirmDialog from '../common/ConfirmDialog';

interface StaffMember {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  branch: {
    name: string;
  };
  status: string;
}

interface StaffListProps {
  staff: StaffMember[];
}

export default function StaffList({ staff }: StaffListProps) {
  const queryClient = useQueryClient();
  const [editingStaff, setEditingStaff] = useState<StaffMember | null>(null);
  const [selectedStaffId, setSelectedStaffId] = useState<string | null>(null);
  const [staffToDelete, setStaffToDelete] = useState<string | null>(null);

  const deleteStaffMutation = useMutation({
    mutationFn: deleteStaff,
    onSuccess: () => {
      queryClient.invalidateQueries(['staff']);
      toast.success('Staff member deleted successfully');
    },
    onError: (error: any) => {
      console.error('Delete staff error:', error);
      toast.error(error.message || 'Failed to delete staff member');
    },
  });

  const { data: selectedStaff } = useQuery({
    queryKey: ['staff', selectedStaffId],
    queryFn: () => selectedStaffId ? getStaffById(selectedStaffId) : null,
    enabled: !!selectedStaffId
  });

  const handleDelete = async (staffId: string, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent event bubbling if you have click handlers on parent elements
    setStaffToDelete(staffId);
  };

  const handleConfirmDelete = async () => {
    if (staffToDelete) {
      try {
        await deleteStaffMutation.mutateAsync(staffToDelete);
        setSelectedStaffId(null); // Close details modal if open
      } catch (error) {
        console.error('Error deleting staff:', error);
      }
    }
    setStaffToDelete(null);
  };

  const handleEdit = (member: StaffMember, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingStaff(member);
  };

  return (
    <>
      <div className="bg-white shadow-sm rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Staff Member
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Contact
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Branch
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {staff?.map((member) => (
              <tr 
                key={member._id} 
                onClick={() => setSelectedStaffId(member._id)}
                className="cursor-pointer hover:bg-gray-50"
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    {member.firstName} {member.lastName}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{member.email}</div>
                  <div className="text-sm text-gray-500">{member.phoneNumber}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {member.branch.name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    member.status === 'active'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {member.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button 
                    onClick={(e) => handleEdit(member, e)}
                    className="text-blue-600 hover:text-blue-900 mr-3"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={(e) => handleDelete(member._id, e)}
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

      <ConfirmDialog
        isOpen={!!staffToDelete}
        onClose={() => setStaffToDelete(null)}
        onConfirm={handleConfirmDelete}
        title="Delete Staff Member"
        message="Are you sure you want to delete this staff member? This action cannot be undone."
      />

      {selectedStaffId && (
        <StaffDetailsModal
          isOpen={!!selectedStaffId}
          onClose={() => setSelectedStaffId(null)}
          staff={selectedStaff?.data}
          onDelete={handleDelete}
        />
      )}

      {editingStaff && (
        <EditStaffModal
          isOpen={!!editingStaff}
          onClose={() => setEditingStaff(null)}
          staff={editingStaff}
        />
      )}
    </>
  );
}