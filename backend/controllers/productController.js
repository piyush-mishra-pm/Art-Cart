const Product = require('../models/product');

// Create a new product via => /api/v1/product/new
exports.newProduct = async (req, res, next) => {
    const product = await Product.create(req.body);
    res.status(201).json({
        success: true,
        product
    });
}

// Gets all the products via => api/v1/allproducts
exports.getAllProducts = async (req,res,next) =>{
    const allProducts = await Product.find();
    res.status(200).json({
        success: true,
        count: allProducts.length,
        allProducts,
    });
}