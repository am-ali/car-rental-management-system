import { X, Edit, Trash2, MapPin, Phone, Mail } from 'lucide-react';
import { useState } from 'react';
import EditStaffModal from './EditStaffModal';

interface StaffDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  staff: any;
  onDelete: (staffId: string, e: React.MouseEvent) => void;
}

export default function StaffDetailsModal({ isOpen, onClose, staff, onDelete }: StaffDetailsModalProps) {
  const [showEditModal, setShowEditModal] = useState(false);

  if (!isOpen || !staff) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 z-40" />
      <div className="fixed inset-0 flex items-center justify-center z-40 p-4 overflow-y-auto">
        <div className="bg-white rounded-lg max-w-2xl w-full p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Staff Details</h2>
            <button onClick={onClose}>
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="space-y-6">
            {/* Basic Information */}
            <div>
              <h3 className="text-xl font-semibold mb-2">
                {staff.firstName} {staff.lastName}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center text-gray-600">
                  <Mail className="w-4 h-4 mr-2" />
                  {staff.email}
                </div>
                <div className="flex items-center text-gray-600">
                  <Phone className="w-4 h-4 mr-2" />
                  {staff.phoneNumber}
                </div>
              </div>
            </div>

            {/* Status */}
            <div>
              <p className="text-sm text-gray-500 mb-1">Status</p>
              <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                staff.status === 'active'
                  ? 'bg-green-100 text-green-800'
                  : 'bg-red-100 text-red-800'
              }`}>
                {staff.status}
              </span>
            </div>

            {/* Branch Information */}
            <div>
              <p className="text-sm text-gray-500 mb-1">Branch</p>
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium text-gray-900">{staff.branch?.name}</h4>
                <div className="mt-2 space-y-2 text-sm text-gray-600">
                  <div className="flex items-center">
                    <MapPin className="w-4 h-4 mr-2" />
                    {staff.branch?.address}, {staff.branch?.city}
                  </div>
                  <div className="flex items-center">
                    <Phone className="w-4 h-4 mr-2" />
                    {staff.branch?.contactNumber}
                  </div>
                  <div className="flex items-center">
                    <Mail className="w-4 h-4 mr-2" />
                    {staff.branch?.email}
                  </div>
                </div>
              </div>
            </div>

            {/* Additional Information */}
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-500">Created At</p>
                <p>{new Date(staff.createdAt).toLocaleDateString()}</p>
              </div>
              <div>
                <p className="text-gray-500">Last Updated</p>
                <p>{new Date(staff.updatedAt).toLocaleDateString()}</p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end space-x-3 pt-4 border-t">
              <button
                onClick={() => setShowEditModal(true)}
                className="flex items-center px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                <Edit className="w-4 h-4 mr-2" />
                Edit
              </button>
              <button
                onClick={(e) => onDelete(staff._id, e)}
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
        <EditStaffModal
          isOpen={showEditModal}
          onClose={() => setShowEditModal(false)}
          staff={staff}
        />
      )}
    </>
  );
} 