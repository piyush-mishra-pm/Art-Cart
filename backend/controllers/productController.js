const mongoose = require('mongoose');

const Product = require('../models/product');
const ErrorHandler = require('../utils/errorHandler');
const catchAsyncErrors = require('../middlewares/catchAsyncErrors');
const APIFeatures = require('../utils/APIFeatures');

// Create a new product via => /api/v1/admin/product/new
exports.newProduct = catchAsyncErrors(async (req, res, next) => {
    const product = await Product.create(req.body);
    res.status(201).json({
        success: true,
        product,
    });
});

// Gets all the products via => api/v1/allproducts
exports.getAllProducts = catchAsyncErrors(async (req, res, next) => {
    const resultsPerPage = 4;
    const totalProductsCount = await Product.countDocuments();

    const apiFeatures = new APIFeatures(Product.find(),req.query)
                            .search()
                            .filter()
                            .paginate(resultsPerPage);
    const allProducts = await apiFeatures.query;
    res.status(200).json({
        success: true,
        count: allProducts.length,
        totalProductsCount,
        allProducts,
    });
});
// Gets product details for a single product using the product id:
exports.getSingleProduct = catchAsyncErrors(async (req, res, next) => {
    const  product = await Product.findById(req.params.id);
    
    if (!product) {
        return next(new ErrorHandler('Product not found', 404));
    }

    res.status(200).json({
        success: true,
        product,
    });
});

// Update a single product via => /api/v1/admin/product/:id
exports.updateSingleProduct = catchAsyncErrors(async (req, res, next) => {
    let product = await Product.findById(req.params.id);

    if (!product) {
        return next(
            new ErrorHandler('Product not found, could not update the product.', 404)
        );
    }

    product = await Product.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
        useFindAndModify: false,
    });

    res.status(200).json({
        success: true,
        product,
    });
});

// Deleting a Product via => /api/v1/admin/product/:id
exports.deleteSingleProduct = catchAsyncErrors(async (req, res, next) => {
    const product = await Product.findById(req.params.id);

    if (!product) {
        return next(
            new ErrorHandler('Product not found, could not delete.', 404)
        );
    }

    await product.remove();

    res.status(200).json({
        success: true,
        message: 'Product is deleted.',
    });
});
