const express = require('express');
const app = express();
const errorMiddleware = require('./middlewares/errors');

app.use(express.json());

// Importing All Routes here:
const products = require('./routes/product');
const auth = require('./routes/auth');

// Binding routes here:
app.use('/api/v1', products);
app.use('/api/v1', auth);

// Middleware for handling errors:
app.use(errorMiddleware);

module.exports=app;