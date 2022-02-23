const mongoose = require('mongoose');

const Product = require('../models/product');
const ErrorHandler = require('../utils/errorHandler');
const catchAsyncErrors = require('../middlewares/catchAsyncErrors');
const APIFeatures = require('../utils/APIFeatures');

// Create a new product via => /api/v1/admin/product/new
exports.newProduct = catchAsyncErrors(async (req, res, next) => {
    req.body.user = req.user.id;
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

// Create a new review => /api/v1/review
exports.createProductReview = catchAsyncErrors(async (req, res, next) => {
    const {rating, comment, productId} = req.body;

    const review = {
            user: req.user._id,
            name: req.user.name,
            rating: Number(rating),
            comment,
        };

    const product = await Product.findById(productId);

    // A user can only review the product once.
    const isReviewed = product.reviews.find(
        r=>r.user.toString() === req.user._id.toString()
    );
    
    
    // If user has already review product, then update the review.
    if(isReviewed){
        product.reviews.forEach( review => {
                if(review.user.toString() === req.user._id.toString()){
                    review.comment = comment;
                    review.rating = rating;
                }
            }
        );
    }else{
        product.reviews.push(review);
        product.numOfReviews = product.reviews.length;
    }

    // Managing product ratings:
    product.ratings = product.reviews.reduce(
        (acc,item)=> (item.rating + acc, 0)/product.reviews.length
    );

    await product.save({validateBeforeSave: false});

    res.status(200).json({
        success: true,
    });
})
