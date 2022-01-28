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
        let errorCopy = {...error};
        errorCopy.message = error.message || 'Internal Server Error';

        // Wrong Mongoose ObjectID Error:
        if(error.name === 'CastError'){
            const message = `Resource not found. Invalid: ${error.path}`;
            errorCopy = new ErrorHandler(message,400);
        }
        // Handling Mongoose Validation Errors:
        else if(error.name === 'ValidationError'){
            const message = Object.values(error.errors).map(value=> value.message);
            errorCopy = new ErrorHandler(message, 400);
        }

        res.status(errorCopy.statusCode).json({
            success: false,
            message: errorCopy.message,
        });
    }
}