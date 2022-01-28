const jwt = require('jsonwebtoken');

const User = require('../models/user');
const catchAsyncErrors = require('./catchAsyncErrors');
const ErrorHandler = require('../utils/errorHandler');

// Checks whether a user is authenticated or not:
exports.isAuthenticatedUser = catchAsyncErrors(async (req, res, next) => {
    // Here we use HTTPonly cookies, which can be authenticated and 
    // accessible only on server side, but not client side, which makes it more secure.
    const { token } = req.cookies;

    if (!token) return next(new ErrorHandler('Login required before accessing this.', 401));

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id);

    next();
});
