// Validate email format
exports.isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

// Validate phone number format (simple example)
exports.isValidPhoneNumber = (phoneNumber) => {
    const phoneRegex = /^\+?[1-9]\d{1,14}$/; // E.164 format
    return phoneRegex.test(phoneNumber);
};

// Format date to a readable string
exports.formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
};

// Calculate the number of days between two dates
exports.calculateDaysBetween = (startDate, endDate) => {
    const oneDay = 1000 * 60 * 60 * 24;
    const diffInTime = new Date(endDate) - new Date(startDate);
    return Math.round(diffInTime / oneDay);
};

// Generate a random string (e.g., for temporary passwords)
exports.generateRandomString = (length = 8) => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
}; 