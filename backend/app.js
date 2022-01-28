const express = require('express');
const app = express();
const errorMiddleware = require('./middlewares/errors');

app.use(express.json());

// Importing All Routes here:
const products = require('./routes/product');

// Binding routes here:
app.use('/api/v1', products);

// Middleware for handling errors:
app.use(errorMiddleware);

module.exports=app;