const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const path = require('path');
const User = require('../models/User');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const createAdmin = async () => {
    try {
        // Verify that MONGO_URI exists
        if (!process.env.MONGO_URI) {
            throw new Error('MONGO_URI is not defined in environment variables');
        }

        // Connect to MongoDB
        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });

        // Check if admin already exists
        const adminExists = await User.findOne({ email: 'admin@example.com' });
        if (adminExists) {
            console.log('Admin user already exists');
            process.exit(0);
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash('admin123', salt);

        // Create admin user
        const admin = new User({
            firstName: 'Admin',
            lastName: 'User',
            email: 'admin@example.com',
            password: hashedPassword,
            phoneNumber: '+1234567890',
            role: 'admin',
            status: 'active'
        });

        await admin.save();
        console.log('Admin user created successfully');
        process.exit(0);
    } catch (error) {
        console.error('Error creating admin:', error);
        process.exit(1);
    }
};

createAdmin(); 