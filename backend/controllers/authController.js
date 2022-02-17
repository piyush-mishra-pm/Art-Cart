const User = require('../models/user');
const ErrorHandler = require('../utils/errorHandler');
const catchAsyncErrors = require('../middlewares/catchAsyncErrors');
const sendToken = require('../utils/jwtToken');
const sendEmail = require('../utils/sendEmail');

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

// Forgot Password => /api/v1/password/forgot
exports.forgotPassword = catchAsyncErrors(async (req, res, next) => {
    const user = await User.findOne({email: req.body.email});
    if(!user){
        return next(new ErrorHandler('Email not found', 404));
    }

    // Get Reset token: 
    const resetToken = user.getResetPasswordToken();

    await user.save({ validateBeforeSave : false });

    // Create reset password url:
    const resetUrl = `${req.protocol}://${req.get('host')}/api/v1/password/reset/${resetToken}`;

    const emailMessage = `Your password reset token is as follows:\n\n${resetUrl}\n\n
    If you have not requested password reset, then ignore it.`

    try{
        await sendEmail({
            email:user.email, 
            subject: 'Art-Cart Password Recovery',
            message: emailMessage
        });

        res.status(200).json({
            success: true,
            message: `Email sent to ${user.email}`
        });


    }catch(error){
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;
        
        await user.save({validateBeforeSave: false});

        return next(new ErrorHandler(error.message, 500));
    }
    
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