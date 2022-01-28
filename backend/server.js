const dotenv = require('dotenv');

const app = require('./app.js');
const connectDatabse = require('./config/database');

// Setting up the Config file for environment:
dotenv.config({path: 'backend/config/config.env'});

// Connecting to the DB:
connectDatabse();

const server = app.listen(process.env.PORT, () => {
    console.log(`Server has started on PORT#: ${process.env.PORT} in ${process.env.NODE_ENV} mode.`);
});


// Handle Unhandled Promise Rejection Errors:

process.on('unhandledRejection',error=>{
    console.log(`ERROR: ${error}`);
    console.log('Shutting down server due to Unhandled Promise Rejections');
    server.close(()=>{
        process.exit(1);
    })
})