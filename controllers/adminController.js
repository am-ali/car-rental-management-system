const Car = require('../models/Car');
const Category = require('../models/Category');
const Branch = require('../models/Branch');
const User = require('../models/User');
const Booking = require('../models/Booking');
const Payment = require('../models/Payment');
const axios = require('axios');


// Utility function to fetch car details from CarXE API
async function fetchCarDetails(plateNumber, countryCode) {
    try {
        console.log('Fetching car details for:', plateNumber, countryCode);
        const encodedPlate = encodeURIComponent(plateNumber);
        const response = await axios.get(`https://api.carsxe.com/v2/platedecoder`, {
            params: {
                key: process.env.CARXE_API_KEY,
                plate: encodedPlate,
                country: countryCode
            }
        });
        console.log('API Response:', response.data);
        return response.data;
    } catch (error) {
        console.error('Error fetching car details:', error.response?.data || error.message);
        throw error;
    }
}

// Utility function to fetch car images from CarXE
async function fetchCarImages(make, model) {
    try {
        console.log('Fetching images for:', make, model);
        const encodedMake = encodeURIComponent(make);
        const encodedModel = encodeURIComponent(model);
        const response = await axios.get(`https://api.carsxe.com/images`, {
            params: {
                key: process.env.CARXE_API_KEY,
                make: encodedMake,
                model: encodedModel
            }
        });
        console.log('Images API Response:', response.data);
        return response.data.images;
    } catch (error) {
        console.error('Error fetching car images:', error.response?.data || error.message);
        return [];
    }
}

// Search endpoint
exports.searchVehicle = async (req, res) => {
    try {
        const { plateNumber, countryCode } = req.query;
        console.log('Searching vehicle with plate:', plateNumber, 'country:', countryCode);
        
        if (!plateNumber || !countryCode) {
            return res.status(400).json({
                success: false,
                error: 'Plate number and country code are required'
            });
        }

        const vehicleDetails = await fetchCarDetails(plateNumber, countryCode);
        
        // If vehicle found, fetch images
        if (vehicleDetails) {
            const images = await fetchCarImages(vehicleDetails.make, vehicleDetails.model);
            vehicleDetails.images = images;
        }

        res.status(200).json({
            success: true,
            data: vehicleDetails
        });

    } catch (error) {
        console.error('Search Error:', error.response?.data || error.message);
        res.status(error.response?.status || 500).json({
            success: false,
            error: error.response?.data?.message || error.message
        });
    }
};

// Get car images endpoint
exports.getCarImages = async (req, res) => {
    try {
        const { make, model } = req.query;
        
        if (!make || !model) {
            return res.status(400).json({
                success: false,
                error: 'Make and model are required'
            });
        }

        const response = await fetchCarImages(make, model);
        
        // Extract image links and append .jpg if needed
        const imageLinks = response.map(image => {
            const link = image.link;
            return link.toLowerCase().endsWith('.jpg') ? link : `${link}.jpg`;
        });

        res.status(200).json({
            success: true,
            data: imageLinks
        });

    } catch (error) {
        console.error('Error getting car images:', error.response?.data || error.message);
        res.status(error.response?.status || 500).json({
            success: false,
            error: error.response?.data?.message || error.message
        });
    }
};

// Add car with manual entry
exports.addCar = async (req, res) => {
    try {
        const {
            make,
            model,
            year,
            category,
            licensePlate,
            branch,
            dailyRate,
            transmission,
            features,
            mileage,
            images,
            ...otherDetails
        } = req.body;

        // Validate required fields
        if (!make || !model || !category || !licensePlate || !branch || !dailyRate || !transmission) {
            return res.status(400).json({
                success: false,
                error: 'Missing required fields'
            });
        }

        // Create and save the new car
        const newCar = new Car({
            make,
            model,
            year,
            category,
            licensePlate,
            branch,
            dailyRate,
            transmission,
            features,
            mileage,
            images: images || [], // If no images provided, default to empty array
            ...otherDetails
        });
        
        await newCar.save();

        res.status(201).json({
            success: true,
            data: newCar
        });

    } catch (error) {
        console.error('Error adding car:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
};

exports.getAllCars = async (req, res) => {
    try {
        const cars = await Car.find()
            .populate('category')
            .populate('branch');
        res.status(200).json({ success: true, data: cars });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
};

exports.getCarById = async (req, res) => {
    try {
        const car = await Car.findById(req.params.carId)
            .populate('category')
            .populate('branch');
        if (!car) {
            return res.status(404).json({ success: false, error: 'Car not found' });
        }
        res.status(200).json({ success: true, data: car });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
};

exports.updateCar = async (req, res) => {
    try {
        const car = await Car.findByIdAndUpdate(
            req.params.carId,
            req.body,
            { new: true, runValidators: true }
        );
        if (!car) {
            return res.status(404).json({ success: false, error: 'Car not found' });
        }
        res.status(200).json({ success: true, data: car });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
};

exports.deleteCar = async (req, res) => {
    try {
        const car = await Car.findByIdAndDelete(req.params.carId);
        if (!car) {
            return res.status(404).json({ success: false, error: 'Car not found' });
        }
        res.status(200).json({ success: true, data: {} });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
};

// Category Management Controllers
exports.addCategory = async (req, res) => {
    try {
        const newCategory = new Category(req.body);
        await newCategory.save();
        res.status(201).json({ success: true, data: newCategory });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
};

exports.getAllCategories = async (req, res) => {
    try {
        const categories = await Category.find();
        res.status(200).json({ success: true, data: categories });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
};

exports.updateCategory = async (req, res) => {
    try {
        const category = await Category.findByIdAndUpdate(
            req.params.categoryId,
            req.body,
            { new: true, runValidators: true }
        );
        if (!category) {
            return res.status(404).json({ success: false, error: 'Category not found' });
        }
        res.status(200).json({ success: true, data: category });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
};

exports.deleteCategory = async (req, res) => {
    try {
        const category = await Category.findByIdAndDelete(req.params.categoryId);
        if (!category) {
            return res.status(404).json({ success: false, error: 'Category not found' });
        }
        res.status(200).json({ success: true, data: {} });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
};

// Branch Management Controllers
exports.addBranch = async (req, res) => {
    try {
        const newBranch = new Branch(req.body);
        await newBranch.save();
        res.status(201).json({ success: true, data: newBranch });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
};

exports.getAllBranches = async (req, res) => {
    try {
        const branches = await Branch.find();
        res.status(200).json({ success: true, data: branches });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
};

exports.getBranchById = async (req, res) => {
    try {
        const branch = await Branch.findById(req.params.branchId);
        if (!branch) {
            return res.status(404).json({ success: false, error: 'Branch not found' });
        }
        res.status(200).json({ success: true, data: branch });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
};

exports.updateBranch = async (req, res) => {
    try {
        const branch = await Branch.findByIdAndUpdate(
            req.params.branchId,
            req.body,
            { new: true, runValidators: true }
        );
        if (!branch) {
            return res.status(404).json({ success: false, error: 'Branch not found' });
        }
        res.status(200).json({ success: true, data: branch });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
};

exports.deleteBranch = async (req, res) => {
    try {
        const branch = await Branch.findByIdAndDelete(req.params.branchId);
        if (!branch) {
            return res.status(404).json({ success: false, error: 'Branch not found' });
        }
        res.status(200).json({ success: true, data: {} });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
};

// Staff Management Controllers
exports.addStaff = async (req, res) => {
    try {
        const staffData = {
            ...req.body,
            role: 'staff',
            status: 'active'
        };
        const newStaff = new User(staffData);
        await newStaff.save();
        res.status(201).json({ success: true, data: newStaff });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
};

exports.getAllStaff = async (req, res) => {
    try {
        const staff = await User.find({ role: 'staff' }).populate('branch');
        res.status(200).json({ success: true, data: staff });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
};

exports.getStaffById = async (req, res) => {
    try {
        const staff = await User.findOne({
            _id: req.params.staffId,
            role: 'staff'
        }).populate('branch');
        if (!staff) {
            return res.status(404).json({ success: false, error: 'Staff member not found' });
        }
        res.status(200).json({ success: true, data: staff });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
};

exports.updateStaff = async (req, res) => {
    try {
        const staff = await User.findOneAndUpdate(
            { _id: req.params.staffId, role: 'staff' },
            req.body,
            { new: true, runValidators: true }
        );
        if (!staff) {
            return res.status(404).json({ success: false, error: 'Staff member not found' });
        }
        res.status(200).json({ success: true, data: staff });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
};

exports.deleteStaff = async (req, res) => {
    try {
        const staff = await User.findOneAndDelete({
            _id: req.params.staffId,
            role: 'staff'
        });
        if (!staff) {
            return res.status(404).json({ success: false, error: 'Staff member not found' });
        }
        res.status(200).json({ success: true, data: {} });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
};

// Reports Controllers
exports.getRevenueReport = async (req, res) => {
    try {
        const { startDate, endDate } = req.query;
        const payments = await Payment.find({
            status: 'completed',
            createdAt: {
                $gte: new Date(startDate),
                $lte: new Date(endDate)
            }
        }).populate('booking');

        const totalRevenue = payments.reduce((sum, payment) => sum + payment.amount, 0);
        
        res.status(200).json({
            success: true,
            data: {
                totalRevenue,
                payments
            }
        });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
};

exports.getUsageReport = async (req, res) => {
    try {
        const cars = await Car.find();
        const bookings = await Booking.find({ status: 'completed' })
            .populate('car');

        const usageStats = cars.map(car => ({
            car: car,
            totalBookings: bookings.filter(b => b.car._id.equals(car._id)).length,
            totalDays: bookings
                .filter(b => b.car._id.equals(car._id))
                .reduce((sum, b) => {
                    const days = Math.ceil((b.endDate - b.startDate) / (1000 * 60 * 60 * 24));
                    return sum + days;
                }, 0)
        }));

        res.status(200).json({ success: true, data: usageStats });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
};

exports.getTrendsReport = async (req, res) => {
    try {
        const bookings = await Booking.find()
            .populate('car')
            .populate('customer')
            .sort({ createdAt: -1 });

        const monthlyBookings = {};
        bookings.forEach(booking => {
            const month = booking.createdAt.toISOString().slice(0, 7);
            monthlyBookings[month] = (monthlyBookings[month] || 0) + 1;
        });

        res.status(200).json({
            success: true,
            data: {
                totalBookings: bookings.length,
                monthlyTrends: monthlyBookings
            }
        });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
};