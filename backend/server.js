const dotenv = require('dotenv');

const app = require('./app.js');

dotenv.config({path: 'backend/config/config.env'});

app.listen(process.env.PORT, () => {
    console.log(`Server has started on PORT#: ${process.env.PORT} in ${process.env.NODE_ENV} mode.`);
});
