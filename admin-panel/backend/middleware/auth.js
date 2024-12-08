const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Verify JWT token
const verifyToken = async (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        
        if (!token) {
            return res.status(401).json({
                success: false,
                error: 'Access denied. No token provided'
            });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.userId);

        if (!user) {
            return res.status(401).json({
                success: false,
                error: 'Invalid token - User not found'
            });
        }

        if (user.status !== 'active') {
            return res.status(403).json({
                success: false,
                error: 'Account is not active'
            });
        }

        req.user = user;
        next();
    } catch (error) {
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({
                success: false,
                error: 'Invalid token'
            });
        }
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({
                success: false,
                error: 'Token has expired'
            });
        }
        res.status(500).json({
            success: false,
            error: 'Authentication error'
        });
    }
};

// Verify admin role
const authenticateAdmin = async (req, res, next) => {
    try {
        await verifyToken(req, res, async () => {
            if (req.user.role !== 'admin') {
                return res.status(403).json({
                    success: false,
                    error: 'Access denied. Admin privileges required'
                });
            }
            next();
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: 'Authentication error'
        });
    }
};

// Verify staff role (can be used for specific staff-only routes)
const authenticateStaff = async (req, res, next) => {
    try {
        await verifyToken(req, res, async () => {
            if (req.user.role !== 'staff' && req.user.role !== 'admin') {
                return res.status(403).json({
                    success: false,
                    error: 'Access denied. Staff privileges required'
                });
            }
            next();
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: 'Authentication error'
        });
    }
};

// Optional: Branch access verification (for staff members)
const verifyBranchAccess = async (req, res, next) => {
    try {
        if (req.user.role === 'admin') {
            return next(); // Admins have access to all branches
        }

        const branchId = req.params.branchId || req.body.branchId;
        
        if (!branchId) {
            return next();
        }

        if (!req.user.branch || req.user.branch.toString() !== branchId) {
            return res.status(403).json({
                success: false,
                error: 'Access denied. You can only access your assigned branch'
            });
        }
        
        next();
    } catch (error) {
        res.status(500).json({
            success: false,
            error: 'Branch verification error'
        });
    }
};

module.exports = {
    verifyToken,
    authenticateAdmin,
    authenticateStaff,
    verifyBranchAccess
}; 