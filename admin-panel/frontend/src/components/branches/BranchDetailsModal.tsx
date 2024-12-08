import { X, Edit, Trash2, MapPin, Phone, Mail, Globe } from 'lucide-react';
import { useState } from 'react';
import EditBranchModal from './EditBranchModal';

interface BranchDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  branch: any;
  onDelete: (branchId: string, e: React.MouseEvent) => void;
}

export default function BranchDetailsModal({ isOpen, onClose, branch, onDelete }: BranchDetailsModalProps) {
  const [showEditModal, setShowEditModal] = useState(false);

  if (!isOpen || !branch) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 z-40" />
      <div className="fixed inset-0 flex items-center justify-center z-40 p-4">
        <div className="bg-white rounded-lg max-w-3xl w-full p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Branch Details</h2>
            <button onClick={onClose}>
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="space-y-6">
            {/* Basic Information */}
            <div>
              <h3 className="text-xl font-semibold mb-4">{branch.name}</h3>
              <div className="space-y-3">
                <div className="flex items-center text-gray-600">
                  <MapPin className="w-4 h-4 mr-2" />
                  {branch.address}, {branch.city}
                </div>
                <div className="flex items-center text-gray-600">
                  <Phone className="w-4 h-4 mr-2" />
                  {branch.contactNumber}
                </div>
                <div className="flex items-center text-gray-600">
                  <Mail className="w-4 h-4 mr-2" />
                  {branch.email}
                </div>
              </div>
            </div>

            {/* Coordinates */}
            {branch.coordinates && (
              <div>
                <p className="text-sm text-gray-500 mb-2">Location Coordinates</p>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">Latitude</p>
                      <p className="font-medium">{branch.coordinates.latitude}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Longitude</p>
                      <p className="font-medium">{branch.coordinates.longitude}</p>
                    </div>
                  </div>
                  {/* Optional: Add a link to view on map */}
                  <a
                    href={`https://www.google.com/maps?q=${branch.coordinates.latitude},${branch.coordinates.longitude}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center text-blue-600 hover:text-blue-800 mt-3"
                  >
                    <Globe className="w-4 h-4 mr-2" />
                    View on Map
                  </a>
                </div>
              </div>
            )}

            {/* Timestamps */}
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-500">Created At</p>
                <p>{new Date(branch.createdAt).toLocaleDateString()}</p>
              </div>
              <div>
                <p className="text-gray-500">Last Updated</p>
                <p>{new Date(branch.updatedAt).toLocaleDateString()}</p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowEditModal(true)}
                className="flex items-center px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                <Edit className="w-4 h-4 mr-2" />
                Edit
              </button>
              <button
                onClick={(e) => onDelete(branch._id, e)}
                className="flex items-center px-3 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>

      {showEditModal && (
        <EditBranchModal
          isOpen={showEditModal}
          onClose={() => setShowEditModal(false)}
          branch={branch}
        />
      )}
    </>
  );
} 