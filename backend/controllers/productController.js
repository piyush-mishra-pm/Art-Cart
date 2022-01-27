const Product = require('../models/product');
const mongoose = require('mongoose');

// Create a new product via => /api/v1/admin/product/new
exports.newProduct = async (req, res, next) => {
    const product = await Product.create(req.body);
    res.status(201).json({
        success: true,
        product
    });
};

// Gets all the products via => api/v1/allproducts
exports.getAllProducts = async (req,res,next) =>{
    const allProducts = await Product.find();
    res.status(200).json({
        success: true,
        count: allProducts.length,
        allProducts,
    });
};
// Gets product details for a single product using the product id:
exports.getSingleProduct =async(req,res,next)=>{
    const product = await Product.findById(req.params.id);
    if(!product){
        return res.status(404).json({
            success:false,
            message:'Product not found',
        });
    }

    res.status(200).json({
        success:true,
        product,
    });
};

// Update a single product via => /api/v1/admin/product/:id
exports.updateSingleProduct = async (req, res, next) => {
    let product
    if(mongoose.Types.ObjectId.isValid(req.params.id)){
        product = await Product.findById(req.params.id);
    }

    if (!product) {
        return res.status(404).json({
            success: false,
            message: 'Product not found, could not update.',
        });
    }

    product = await Product.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
        useFindAndModify: false
    });

    res.status(200).json({
        success: true,
        product,
    });
};

// Deleting a Product via => /api/v1/admin/product/:id
exports.deleteSingleProduct = async(req,res, next)=>{
    let product
    if(mongoose.Types.ObjectId.isValid(req.params.id)){
        product = await Product.findById(req.params.id);
    }

    if (!product) {
        return res.status(404).json({
            success: false,
            message: 'Product not found, could not delete.',
        });
    }

    await product.remove();

    res.status(200).json({
        success: true,
        message: 'Product is deleted.'
    });
}