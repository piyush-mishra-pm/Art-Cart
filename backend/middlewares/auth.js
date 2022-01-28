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

// Handling user Authorisation based on roles: (Admin / User)
exports.authorizeRoles = (...roles) => {
    return (req,res,next)=>{
        if(!roles.includes(req.user.role)){
            return next(new ErrorHandler(`Role of ${req.user.role} not authorised to access this`, 403));
        }
        next();
    }
}