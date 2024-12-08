import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import { X, Search, Image as ImageIcon } from 'lucide-react';
import { searchCar, addCar, searchVehicle, fetchCategories, fetchBranches, getCarImages } from '../../lib/api';

interface AddCarModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface CarFormData {
  make: string;
  model: string;
  year?: number;
  category: string;
  licensePlate: string;
  branch: string;
  dailyRate: number;
  transmission: string;
  features?: string[];
  mileage?: number;
  image?: File[];
  otherFeatures?: string;
}

interface CountryOption {
  code: string;
  name: string;
}

const COUNTRY_OPTIONS: CountryOption[] = [
  { code: 'AU', name: 'Australia' },
  { code: 'BR', name: 'Brazil' },
  { code: 'DK', name: 'Denmark' },
  { code: 'FI', name: 'Finland' },
  { code: 'FR', name: 'France' },
  { code: 'DE', name: 'Germany' },
  { code: 'IN', name: 'India' },
  { code: 'IE', name: 'Ireland' },
  { code: 'IM', name: 'Isle of Man' },
  { code: 'IT', name: 'Italy' },
  { code: 'ES', name: 'Spain' },
  { code: 'MX', name: 'Mexico' },
  { code: 'NZ', name: 'New Zealand' },
  { code: 'SG', name: 'Singapore' },
  { code: 'ZA', name: 'South Africa' },
  { code: 'NL', name: 'The Netherlands' },
  { code: 'GB', name: 'United Kingdom' },
];

export default function AddCarModal({ isOpen, onClose }: AddCarModalProps) {
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isManualEntry, setIsManualEntry] = useState(false);
  const [imagePreview, setImagePreview] = useState<string[]>([]);
  const queryClient = useQueryClient();
  const { register, handleSubmit, reset, formState: { errors } } = useForm<CarFormData>();
  const [plateNumber, setPlateNumber] = useState('');
  const [countryCode, setCountryCode] = useState('');
  const [searchError, setSearchError] = useState('');
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const addCarMutation = useMutation({
    mutationFn: (data: CarFormData) => addCar(data),
    onSuccess: () => {
      // Invalidate and refetch cars list
      queryClient.invalidateQueries(['cars']);
    },
    onError: (error: any) => {
      console.error('Mutation error:', error);
      toast.error(error.message || 'Failed to add car');
    },
  });

  const { data: categoriesData } = useQuery({
    queryKey: ['categories'],
    queryFn: fetchCategories
  });

  const { data: branchesData } = useQuery({
    queryKey: ['branches'],
    queryFn: fetchBranches
  });

  const handleSearch = async () => {
    if (!plateNumber || !countryCode) {
      setSearchError('Please enter both plate number and country');
      return;
    }

    setIsSearching(true);
    setSearchError('');

    try {
      const result = await searchVehicle(plateNumber, countryCode);
      if (result.success && result.data) {
        // First set the vehicle details
        reset({
          make: result.data.make,
          model: result.data.model,
          year: result.data.registration_year,
          licensePlate: plateNumber,
        });

        // Then fetch images for the make and model
        try {
          const imagesResult = await getCarImages(result.data.make, result.data.model);
          if (imagesResult.success && imagesResult.data) {
            setImagePreview(imagesResult.data);
          }
        } catch (imageError) {
          console.error('Failed to fetch car images:', imageError);
          // Don't show error to user, just use any images from vehicle search
          setImagePreview(result.data.images || []);
        }

        setIsManualEntry(true);
      } else {
        setSearchError('No vehicle found with these details');
      }
    } catch (error) {
      setSearchError('Failed to search vehicle');
      console.error(error);
    } finally {
      setIsSearching(false);
    }
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      Array.from(files).forEach(file => {
        const reader = new FileReader();
        reader.onloadend = () => {
          setImagePreview(prev => [...prev, reader.result as string]);
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const onSubmit = async (data: any) => {
    try {
      // Validate required fields
      const requiredFields = [
        'make',
        'model',
        'category',
        'licensePlate',
        'branch',
        'dailyRate',
        'transmission',
        'year'
      ];

      const missingFields = requiredFields.filter(field => !data[field]);
      if (missingFields.length > 0) {
        throw new Error(`Missing required fields: ${missingFields.join(', ')}`);
      }

      // Create the request body as a regular object instead of FormData
      const requestBody = {
        // Add all the regular fields
        ...Object.fromEntries(
          Object.entries(data).filter(([key, value]) => 
            key !== 'otherFeatures' && 
            key !== 'image' && 
            value !== undefined && 
            value !== ''
          )
        ),
        
        // Add features
        features: [
          ...(data.features || []),
          ...(data.otherFeatures 
            ? data.otherFeatures.split(',').map((f: string) => f.trim()).filter(Boolean)
            : []
          )
        ],

        // Add images
        images: imagePreview
      };

      // Submit the request
      await addCarMutation.mutateAsync(requestBody);
      
      toast.success('Car added successfully');
      reset();
      setImagePreview([]); // Reset image preview
      onClose();
    } catch (error: any) {
      console.error('Form submission error:', error);
      toast.error(error.message || 'Failed to add car');
    }
  };

  const handleBackToSearch = () => {
    setIsManualEntry(false);
    setImagePreview([]); // Clear image previews
    reset(); // Reset form
    setPlateNumber(''); // Clear plate number
    setCountryCode(''); // Clear country code
    setSearchError(''); // Clear any search errors
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % imagePreview.length);
  };

  const previousImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + imagePreview.length) % imagePreview.length);
  };

  if (!isOpen) return null;

  return (
    <>
    <div className='fixed inset-0 bg-black bg-opacity-0'>
      <div className="fixed inset-0 bg-black bg-opacity-50" />
      <div className="fixed inset-0 flex items-start justify-center overflow-y-auto z-1 0">
        <div className="bg-white rounded-lg p-6 w-full max-w-2xl my-8 mx-4">
          <div className="flex justify-between items-center mb-4 border-b pb-4">
            <h2 className="text-xl font-semibold">Add New Car</h2>
            <button onClick={onClose}>
              <X className="w-6 h-6" />
            </button>
          </div>

          {!isManualEntry && (
            <div className="mb-6">
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">License Plate</label>
                  <input
                    type="text"
                    value={plateNumber}
                    onChange={(e) => setPlateNumber(e.target.value)}
                    placeholder="Enter license plate"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Country</label>
                  <select
                    value={countryCode}
                    onChange={(e) => setCountryCode(e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                  >
                    <option value="">Select country</option>
                    {COUNTRY_OPTIONS.map((country) => (
                      <option key={country.code} value={country.code}>
                        {country.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <button
                onClick={handleSearch}
                disabled={isSearching}
                className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-300"
              >
                {isSearching ? 'Searching...' : 'Search Vehicle'}
              </button>

              {searchError && (
                <div className="mt-2 text-red-600 text-sm">
                  {searchError}
                </div>
              )}

              <button
                onClick={() => setIsManualEntry(true)}
                className="mt-4 text-blue-600 hover:text-blue-800 w-full text-center"
              >
                Enter car details manually
              </button>
            </div>
          )}

          {isManualEntry && (
            <div>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Make *</label>
                    <input
                      {...register('make', { required: 'Make is required' })}
                      className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm ${errors.make ? 'border-red-500' : ''}`}
                    />
                    {errors.make && <span className="text-red-500 text-xs">{errors.make.message}</span>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Model *</label>
                    <input
                      {...register('model', { required: 'Model is required' })}
                      className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm ${errors.model ? 'border-red-500' : ''}`}
                    />
                    {errors.model && <span className="text-red-500 text-xs">{errors.model.message}</span>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Category *</label>
                    <select
                      {...register('category', { required: 'Category is required' })}
                      className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm ${errors.category ? 'border-red-500' : ''}`}
                    >
                      <option value="">Select a category</option>
                      <option value="6750748a8cd1153a5d1cdb67">Luxury</option>
                    </select>
                    {errors.category && <span className="text-red-500 text-xs">{errors.category.message}</span>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Branch *</label>
                    <select
                      {...register('branch', { required: 'Branch is required' })}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                    >
                      <option value="">Select a branch</option>
                      {branchesData?.data?.map((branch) => (
                        <option key={branch._id} value={branch._id}>
                          {branch.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">License Plate *</label>
                    <input
                      {...register('licensePlate', { required: 'License plate is required' })}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Daily Rate (USD) *</label>
                    <input
                      type="number"
                      {...register('dailyRate', { 
                        required: 'Daily rate is required',
                        min: { value: 0, message: 'Daily rate must be positive' }
                      })}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Transmission *</label>
                    <select
                      {...register('transmission', { required: 'Transmission is required' })}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                    >
                      <option value="">Select transmission</option>
                      <option value="automatic">Automatic</option>
                      <option value="manual">Manual</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Year *</label>
                    <input
                      type="number"
                      {...register('year', { 
                        min: { value: 1900, message: 'Invalid year' },
                        max: { value: new Date().getFullYear() + 1, message: 'Invalid year' }
                      })}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Mileage</label>
                    <input
                      type="number"
                      {...register('mileage', { min: 0 })}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                    />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700">Car Images ({imagePreview.length})</label>
                    <div className="mt-1 flex items-center gap-4">
                      {imagePreview.length > 0 ? (
                        <div className="relative flex-shrink-0 h-48 w-72 border rounded-lg overflow-hidden bg-gray-50">
                          <img
                            src={imagePreview[currentImageIndex]}
                            alt={`Car preview ${currentImageIndex + 1}`}
                            className="h-full w-full object-cover"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              setImagePreview(prev => prev.filter((_, i) => i !== currentImageIndex));
                              if (currentImageIndex >= imagePreview.length - 1) {
                                setCurrentImageIndex(Math.max(0, imagePreview.length - 2));
                              }
                            }}
                            className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                          >
                            <X className="w-4 h-4" />
                          </button>
                          {imagePreview.length > 1 && (
                            <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-2">
                              <button
                                type="button"
                                onClick={previousImage}
                                className="p-1 bg-black bg-opacity-50 text-white rounded-full hover:bg-opacity-75"
                              >
                                ←
                              </button>
                              <span className="px-2 py-1 bg-black bg-opacity-50 text-white rounded-full text-sm">
                                {currentImageIndex + 1} / {imagePreview.length}
                              </span>
                              <button
                                type="button"
                                onClick={nextImage}
                                className="p-1 bg-black bg-opacity-50 text-white rounded-full hover:bg-opacity-75"
                              >
                                →
                              </button>
                            </div>
                          )}
                        </div>
                      ) : null}
                      <div className="flex-shrink-0 h-48 w-72 border rounded-lg overflow-hidden bg-gray-50">
                        <label className="cursor-pointer h-full w-full flex flex-col items-center justify-center text-gray-400 hover:text-gray-500">
                          <ImageIcon className="w-8 h-8" />
                          <span className="mt-2 text-sm">Add Images</span>
                          <input
                            type="file"
                            accept="image/*"
                            multiple
                            {...register('image')}
                            onChange={handleImageChange}
                            className="sr-only"
                          />
                        </label>
                      </div>
                    </div>
                  </div>
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700">Features</label>
                    <div className="mt-2 space-y-4">
                      <div className="grid grid-cols-3 gap-2">
                        {['GPS', 'Bluetooth', 'Backup Camera'].map((feature) => (
                          <label key={feature} className="inline-flex items-center">
                            <input
                              type="checkbox"
                              {...register('features')}
                              value={feature}
                              className="rounded border-gray-300 text-blue-600 shadow-sm"
                            />
                            <span className="ml-2 text-sm text-gray-600">{feature}</span>
                          </label>
                        ))}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Other Features</label>
                        <input
                          type="text"
                          {...register('otherFeatures')}
                          placeholder="Enter additional features, separated by commas"
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end space-x-3 mt-6">
                  <button
                    type="button"
                    onClick={handleBackToSearch}
                    className="px-4 py-2 border rounded-md hover:bg-gray-50"
                  >
                    Back to Search
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                  >
                    Add Car
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
      </div>
    </>
  );
}