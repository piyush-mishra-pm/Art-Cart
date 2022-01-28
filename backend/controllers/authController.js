const User = require('../models/user');
const ErrorHandler = require('../utils/errorHandler');
const catchAsyncErrors = require('../middlewares/catchAsyncErrors');

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

    const token = user.getJwtToken();

    res.status(201).json({
        success: true,
        token
    });
});