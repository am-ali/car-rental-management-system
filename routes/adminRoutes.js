const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { authenticateAdmin } = require('../middleware/auth');

// Apply admin authentication middleware to all routes
router.use(authenticateAdmin);

// Car Management Routes
router.get('/cars/search', adminController.searchVehicle);
router.get('/cars/images', adminController.getCarImages);
router.post('/cars', adminController.addCar);
router.get('/cars', adminController.getAllCars);
router.get('/cars/:carId', adminController.getCarById);
router.put('/cars/:carId', adminController.updateCar);
router.delete('/cars/:carId', adminController.deleteCar);

// Car Category Routes
router.post('/categories', adminController.addCategory);
router.get('/categories', adminController.getAllCategories);
router.put('/categories/:categoryId', adminController.updateCategory);
router.delete('/categories/:categoryId', adminController.deleteCategory);

// Branch Management Routes
router.post('/branches', adminController.addBranch);
router.get('/branches', adminController.getAllBranches);
router.get('/branches/:branchId', adminController.getBranchById);
router.put('/branches/:branchId', adminController.updateBranch);
router.delete('/branches/:branchId', adminController.deleteBranch);

// Staff Management Routes
router.post('/staff', adminController.addStaff);
router.get('/staff', adminController.getAllStaff);
router.get('/staff/:staffId', adminController.getStaffById);
router.put('/staff/:staffId', adminController.updateStaff);
router.delete('/staff/:staffId', adminController.deleteStaff);

// Reports Routes
router.get('/reports/revenue', adminController.getRevenueReport);
router.get('/reports/usage', adminController.getUsageReport);
router.get('/reports/trends', adminController.getTrendsReport);

module.exports = router; 