const dotenv = require('dotenv');
const {connect} = require('mongoose');

const Product = require('../models/product');
const connectDB = require('../config/database');
const productsData = require('../data/product.json');

// Setting the dotenv:
dotenv.config({path: 'backend/config/config.env'});

connectDB();
const seedProducts = async()=>{
    try{
        // Firstly delete pre-existing data:
        await Product.deleteMany();
        console.log('All products deleted from DB');

        // Then add all the product seed data in DB:
        await Product.insertMany(productsData);
        console.log('All products from data/product.json seeded in DB');

        process.exit();

    }catch(error){
        console.log(error.message);
        process.exit();
    }
}

seedProducts();