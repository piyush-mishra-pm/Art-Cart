const ErrorHandler = require('../utils/errorHandler');

module.exports = (error,req,res,next)=>{
    error.statusCode = error.statusCode || 500; // Default error code is 500: internal server error.
    error.message = error.message || 'Internal Server Error';
    res.status(error.statusCode).json({
        success: false,
        error: error.stack
    });
}