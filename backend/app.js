const express = require('express');
const app = express();

app.use(express.json());

// Importing All Routes here:
const products = require('./routes/product');

// Binding routes here:
app.use('/api/v1', products);

module.exports=app;