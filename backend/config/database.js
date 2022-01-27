const mongoose = require('mongoose');

const connectDatabse = () => {
    mongoose
        .connect(process.env.DB_LOCAL_URI)
        .then(con => {
            console.log(`MongoDB connected with HOST: ${con.connection.host}`);
        });
}

module.exports = connectDatabse