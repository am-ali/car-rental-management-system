const Car = require('../models/Car');
const Category = require('../models/Category');
const Branch = require('../models/Branch');
const User = require('../models/User');
const Booking = require('../models/Booking');
const Payment = require('../models/Payment');
const axios = require('axios');

// Utility function to fetch car details from CarAPI
async function fetchCarDetails(make, model, year) {
    try {
        const response = await axios.get(`https://api.carapi.app/api/models`, {
            headers: {
                'Authorization': `Bearer ${process.env.CAR_API_KEY}`
            },
            params: {
                make: make,
                model: model,
                year: year
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching car details:', error);
        return null;
    }
}

// Utility function to fetch car images from CarXE
async function fetchCarImages(make, model, year) {
    try {
        const response = await axios.get(`https://api.carxe.com/images`, {
            headers: {
                'Authorization': `Bearer ${process.env.CARXE_API_KEY}`
            },
            params: {
                make: make,
                model: model,
                year: year
            }
        });
        return response.data.images;
    } catch (error) {
        console.error('Error fetching car images:', error);
        return [];
    }
}

// Car Management Controllers
exports.addCar = async (req, res) => {
    try {
        const { make, model, year } = req.body;

        // Attempt to fetch car details from CarAPI
        let carDetails = await fetchCarDetails(make, model, year);

        // If car details are not found, use manual entry
        if (!carDetails) {
            carDetails = {
                engine_size: req.body.engineSize,
                fuel_type: req.body.fuelType,
                doors: req.body.doors,
                seats: req.body.seats
            };
        }

        // Fetch car images from CarXE
        const carImages = await fetchCarImages(make, model, year);

        // Combine API data with request data
        const carData = {
            ...req.body,
            images: carImages,
            engineSize: carDetails.engine_size,
            fuelType: carDetails.fuel_type,
            doors: carDetails.doors,
            seats: carDetails.seats,
            carApiData: carDetails // Store complete API response
        };

        // Create and save the new car
        const newCar = new Car(carData);
        await newCar.save();

        res.status(201).json({ 
            success: true, 
            data: newCar 
        });
    } catch (error) {
        res.status(400).json({ 
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