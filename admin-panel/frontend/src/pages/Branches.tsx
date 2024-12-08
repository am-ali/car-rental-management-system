import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Plus, Search } from 'lucide-react';
import { fetchBranches } from '../lib/api';
import BranchList from '../components/branches/BranchList';
import AddBranchModal from '../components/branches/AddBranchModal';

export default function Branches() {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const { data: branches, isLoading } = useQuery({
    queryKey: ['branches'],
    queryFn: fetchBranches
  });

  const filteredBranches = branches?.data?.filter((branch: any) => {
    const searchTerms = searchQuery.toLowerCase().trim().split(/\s+/);
    const branchString = `${branch.name} ${branch.city} ${branch.address}`.toLowerCase();
    return searchTerms.every(term => branchString.includes(term));
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Branch Management</h1>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Branch
        </button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        <input
          type="text"
          placeholder="Search branches..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10 pr-4 py-2 w-full border rounded-md"
        />
      </div>

      {isLoading ? (
        <div>Loading...</div>
      ) : (
        <BranchList branches={filteredBranches} />
      )}

      <AddBranchModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
      />
    </div>
  );
} 