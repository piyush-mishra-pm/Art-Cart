const express = require('express');
const cookieParser = require('cookie-parser');

const app = express();
const errorMiddleware = require('./middlewares/errors');

app.use(express.json());
app.use(cookieParser());

// Importing All Routes here:
const products = require('./routes/product');
const auth = require('./routes/auth');
const { cookie } = require('express/lib/response');

// Binding routes here:
app.use('/api/v1', products);
app.use('/api/v1', auth);

// Middleware for handling errors:
app.use(errorMiddleware);

module.exports=app;