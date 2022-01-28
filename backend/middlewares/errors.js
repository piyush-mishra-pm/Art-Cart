const ErrorHandler = require('../utils/errorHandler');

module.exports = (error,req,res,next)=>{
    error.statusCode = error.statusCode || 500; // Default error code is 500: internal server error.
    
    if(process.env.NODE_ENV === 'DEVELOPMENT'){
        res.status(error.statusCode).json({
            success: false,
            message: error.message || 'Internal Server Error',
            error: error,
            stack: error.stack
        });
    }

    if(process.env.NODE_ENV === 'PRODUCTION'){
        res.status(error.statusCode).json({
            success: false,
            message: error.message || 'Internal Server Error'
        });
    }
}