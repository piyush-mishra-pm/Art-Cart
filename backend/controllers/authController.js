const User = require('../models/user');
const ErrorHandler = require('../utils/errorHandler');
const catchAsyncErrors = require('../middlewares/catchAsyncErrors');
const sendToken = require('../utils/jwtToken');

// Register a User via => /api/v1/register
exports.registerUser = catchAsyncErrors(async(req,res,next) => {
    const {name, email, password} = req.body;
    const user = await User.create(
        {
            name, 
            email, 
            password,
            avatar:{
                public_id:"avataars/kccvibpsuiusmwfebp3m",
                url:"https://res.cloudinary.com/shopit/image/upload/v1606305757/avatars/kccvibpsuiusmwfebp3m.png"
            }
        }
    );

    sendToken(user,200,res);
});

// Login User via => /api/v1/login
exports.loginUser = catchAsyncErrors(async (req, res, next) => {
    const { email, password } = req.body;

    // check if email and password are valid:
    if (!email || !password) {
        return next(new ErrorHandler('Please enter email and password', 400));
    }

    // Finding User in DB:
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
        return next(new ErrorHandler('Invalid Email or Password', 401)); // 401 is unAuthenticated user.
    }

    // Verifying Password:
    const isPasswordMatched = await user.comparePassword(password);

    if (!isPasswordMatched)
        return next(new ErrorHandler('Invalid Email or Password', 401)); // 401 is unAuthenticated user.
    
    // User name and password correct, so assign Token:
    sendToken(user, 200, res);
})

// Logout user => /api/v1/logout
exports.logout = catchAsyncErrors(async (req, res, next)=>{
    res.cookie('token',null, {
        expires: new Date(Date.now()),
        httpOnly: true
    });

    res.status(200).json({
        success: true,
        message: 'Logged out'
    });
})