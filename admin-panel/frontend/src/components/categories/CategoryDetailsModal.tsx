import { X, Edit, Trash2, DollarSign, Calendar, Clock } from 'lucide-react';
import { useState } from 'react';
import EditCategoryModal from './EditCategoryModal';

interface CategoryDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  category: {
    _id: string;
    name: string;
    description: string;
    basePrice: number;
    createdAt: string;
    updatedAt: string;
  };
  onDelete: (categoryId: string, e: React.MouseEvent) => void;
}

export default function CategoryDetailsModal({ isOpen, onClose, category, onDelete }: CategoryDetailsModalProps) {
  const [showEditModal, setShowEditModal] = useState(false);

  if (!isOpen || !category) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 z-40" />
      <div className="fixed inset-0 flex items-center justify-center z-40 p-4 overflow-y-auto">
        <div className="bg-white rounded-lg max-w-2xl w-full p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Category Details</h2>
            <button onClick={onClose}>
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="space-y-6">
            {/* Basic Information */}
            <div>
              <h3 className="text-xl font-semibold mb-2">{category.name}</h3>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-gray-600">{category.description || 'No description provided'}</p>
              </div>
            </div>

            {/* Price Information */}
            <div>
              <p className="text-sm text-gray-500 mb-2">Base Price</p>
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="flex items-center text-xl font-semibold text-blue-700">
                  <DollarSign className="w-6 h-6 mr-1" />
                  {category.basePrice.toFixed(2)}
                  <span className="ml-2 text-sm text-blue-600 font-normal">per day</span>
                </div>
              </div>
            </div>

            {/* Timestamps */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center text-gray-600 mb-1">
                  <Calendar className="w-4 h-4 mr-2" />
                  <span className="text-sm">Created</span>
                </div>
                <p className="text-sm font-medium">
                  {new Date(category.createdAt).toLocaleDateString()} at{' '}
                  {new Date(category.createdAt).toLocaleTimeString()}
                </p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center text-gray-600 mb-1">
                  <Clock className="w-4 h-4 mr-2" />
                  <span className="text-sm">Last Updated</span>
                </div>
                <p className="text-sm font-medium">
                  {new Date(category.updatedAt).toLocaleDateString()} at{' '}
                  {new Date(category.updatedAt).toLocaleTimeString()}
                </p>
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
                onClick={(e) => onDelete(category._id, e)}
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
        <EditCategoryModal
          isOpen={showEditModal}
          onClose={() => setShowEditModal(false)}
          category={category}
        />
      )}
    </>
  );
} 