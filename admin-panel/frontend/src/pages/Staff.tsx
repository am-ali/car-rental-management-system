import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Plus, Search } from 'lucide-react';
import { fetchStaff } from '../lib/api';
import StaffList from '../components/staff/StaffList';
import AddStaffModal from '../components/staff/AddStaffModal';

export default function Staff() {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const { data: staff, isLoading } = useQuery({
    queryKey: ['staff'],
    queryFn: fetchStaff
  });

  const filteredStaff = staff?.data?.filter((member: any) =>
    member.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    member.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    member.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Staff Management</h1>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Staff
        </button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        <input
          type="text"
          placeholder="Search staff..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10 pr-4 py-2 w-full border rounded-md"
        />
      </div>

      {isLoading ? (
        <div>Loading...</div>
      ) : (
        <StaffList staff={filteredStaff} />
      )}

      <AddStaffModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
      />
    </div>
  );
}