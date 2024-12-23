import axios from 'axios';
import { useAuthStore } from '../stores/auth';

const api = axios.create({
  baseURL: 'https://car-rental-management-system-ghd0.onrender.com/api'
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {

    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle token expiration
    if (error.response?.status === 401) {
      // Clear invalid token
      useAuthStore.getState().logout();
      // Redirect to login if not already there
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export const login = async (email: string, password: string) => {
  try {
    const { data } = await api.post('/auth/login', { email, password }, {
      timeout: 10000 // 10 seconds timeout
    });
    return data;
  } catch (error: any) {
    if (error.code === 'ECONNABORTED') {
      throw new Error('Login request timed out. Please try again.');
    }
    throw error;
  }
};

export const fetchCars = async () => {
  const { data } = await api.get('/admin/cars');
  return data;
};

export const searchCar = async (query: string) => {
  const { data } = await api.get(`/admin/cars/search?query=${query}`);
  return data;
};

export const addCar = async (data: any) => {
  const response = await api.post('/admin/cars', data, {
    headers: {
      'Content-Type': 'application/json',
    },
  });
  return response.data;
};

export const fetchBranches = async () => {
  const { data } = await api.get('/admin/branches');
  return data;
};

export const getBranchById = async (branchId: string) => {
  const { data } = await api.get(`/admin/branches/${branchId}`);
  return data;
};

export const addBranch = async (branchData: any) => {
  const { data } = await api.post('/admin/branches', branchData);
  return data;
};

export const updateBranch = async (branchId: string, branchData: any) => {
  const { data } = await api.put(`/admin/branches/${branchId}`, branchData);
  return data;
};

export const deleteBranch = async (branchId: string) => {
  const { data } = await api.delete(`/admin/branches/${branchId}`);
  return data;
};

export const fetchCategories = async () => {
  const { data } = await api.get('/admin/categories');
  return data;
};

export const addCategory = async (categoryData: any) => {
  const { data } = await api.post('/admin/categories', categoryData);
  return data;
};

export const updateCategory = async (categoryId: string, categoryData: any) => {
  const { data } = await api.put(`/admin/categories/${categoryId}`, categoryData);
  return data;
};

export const deleteCategory = async (categoryId: string) => {
  const { data } = await api.delete(`/admin/categories/${categoryId}`);
  return data;
};

export const fetchStaff = async () => {
  const { data } = await api.get('/admin/staff');
  return data;
};

export const addStaff = async (staffData: any) => {
  const { data } = await api.post('/admin/staff', staffData);
  return data;
};

export const searchVehicle = async (plateNumber: string, countryCode: string) => {
  const { data } = await api.get(`/admin/cars/search`, {
    params: {
      plateNumber,
      countryCode,
    },
  });
  return data;
};

export const getCarImages = async (make: string, model: string) => {
  const { data } = await api.get(`/admin/cars/images`, {
    params: {
      make,
      model,
    },
  });
  return data;
};

export const deleteCar = async (carId: string) => {
  const { data } = await api.delete(`/admin/cars/${carId}`);
  return data;
};

export const updateCar = async (carId: string, carData: any) => {
  const { data } = await api.put(`/admin/cars/${carId}`, carData);
  return data;
};

export const getCarById = async (carId: string) => {
  const { data } = await api.get(`/admin/cars/${carId}`);
  return data;
};

export const deleteStaff = async (staffId: string) => {
  const { data } = await api.delete(`/admin/staff/${staffId}`);
  return data;
};

export const updateStaff = async (staffId: string, data: any) => {
  const { data: response } = await api.put(`/admin/staff/${staffId}`, data);
  return response;
};

export const getStaffById = async (staffId: string) => {
  const { data } = await api.get(`/admin/staff/${staffId}`);
  return data;
};


// Add these new functions
export const getRevenueReport = async (startDate: string, endDate: string) => {
  const { data } = await api.get(`/admin/reports/revenue?startDate=${startDate}&endDate=${endDate}`);
  return data;
};

export const getUsageReport = async () => {
  const { data } = await api.get('/admin/reports/usage');
  return data;
};

export const getTrendsReport = async () => {
  const endDate = new Date().toISOString().split('T')[0];
  const startDate = new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]; // 60 days ago
  const { data } = await api.get(`/admin/reports/trends?startDate=${startDate}&endDate=${endDate}`);
  return data;
};