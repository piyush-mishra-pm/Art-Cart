const User = require('../models/user');
const ErrorHandler = require('../utils/errorHandler');
const catchAsyncErrors = require('../middlewares/catchAsyncErrors');
const sendToken = require('../utils/jwtToken');
const sendEmail = require('../utils/sendEmail');
const crypto =require('crypto');
const { send } = require('express/lib/response');

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

// Reset Password => /api/v1/password/reset/:token
exports.resetPassword = catchAsyncErrors(async (req, res, next) => {
    const token = req.params.token;

    // Hash the url token: (because the DB contains hashed token and hence we need to match the hash of token)
    const hashedResetPasswordToken = crypto.createHash('sha256')
                                            .update(token)
                                            .digest('hex');

    // comparing with the hashed token stored in DB. 
    // Ensure that tokens match and that token hasnot expired.
    const user = await User.findOne({
        resetPasswordToken: hashedResetPasswordToken,
        resetPasswordExpire:{$gt: Date.now()}
    });

    // If token invalid or expired.
    if(!user){
        return next(new ErrorHandler('Password reset token is invalid or has been expired',400));
    }

    // Check whether the provided new password and confirm-new-password are equal.
    if(req.body.password !== req.body.confirmPassword){
        return next(new ErrorHandler('Password and Confirm passwords do not match.',400));
    }

    // Set the new Password:
    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    // Saving the User with new password and resetted reset password attributes.
    await user.save();

    sendToken(user, 200, res);
})

// Get user details of currently logged in user. => /api/v1/me
exports.getUserProfile = catchAsyncErrors(async (req, res, next) => {
    const user = await User.findById(req.user.id);
    res.status(200).json({
        success: true,
        user
    });
})

// Update/Change password => /api/v1/password/update
exports.updatePassword = catchAsyncErrors(async (req,res,next) => {
    const user = await User.findById(req.user.id).select('+password');
    
    // Check previous user password:
    const isMatched = await user.comparePassword(req.body.oldPassword);
    if(!isMatched) {
        return next(new ErrorHandler('old password is incorrect',400));
    }

    user.password = req.body.password;
    await user.save();

    sendToken(user,200, res);
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