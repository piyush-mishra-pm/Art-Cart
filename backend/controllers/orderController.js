const Order = require('../models/order');
const Product = require('../models/product');

const ErrorHandler = require('../utils/errorHandler');
const catchAsyncErrors = require('../middlewares/catchAsyncErrors');

// Create a new Order => /api/v1/order/new
exports.newOrder = catchAsyncErrors(async (req, res, next) => {
    const {
        orderItems,
        shippingInfo,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
        paymentInfo,
    } = req.body;

    const order = await Order.create({
        orderItems,
        shippingInfo,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
        paymentInfo,
        paidAt:Date.now(),
        user:req.user._id
    });

    res.status(200).json({
        success: true,
        order
    });

});

// Get a single order => /api/v1/order/:id
exports.getSingleOrder = catchAsyncErrors(async (req, res, next) => {
    const order = await Order.findById(req.params.id)
                                .populate(
                                    'user',
                                    'name email'
                                );
    
    if(!order) {
        return next(new ErrorHandler('No Order found with this ID', 404));
    }

    res.status(200).json({
        success: true,
        order
    });
});

// Get all orders of a logged in user => /api/v1/orders/me
exports.myOrders = catchAsyncErrors(async (req, res, next) => {
    const orders = await Order.find({user:req.user.id});
    
    if(!orders) {
        return next(new ErrorHandler('No Order found with this ID', 404));
    }

    res.status(200).json({
        success: true,
        orders
    });
});

// ADMIN-ROUTES:
// Admin can get all orders => /api/v1/admin/orders
exports.allOrders = catchAsyncErrors(async (req, res, next) => {
    const orders = await Order.find();

    let totalPriceOfAllOrders = 0;
    orders.forEach(order=>{
        totalPriceOfAllOrders+=order.totalPrice;
    });
    
    if(!orders) {
        return next(new ErrorHandler('No Order found with this ID', 404));
    }

    res.status(200).json({
        success: true,
        totalPriceOfAllOrders,
        orders
    });
});

// Admin can update / process an order => /api/v1/admin/order/:id
exports.updateOrder = catchAsyncErrors(async (req, res, next) => {
    const order = await Order.findById(req.params.id);
    
    if(!order) {
        return next(new ErrorHandler('No Order found with this ID', 404));
    }

    if(order.orderStatus === 'Delivered'){
        return next(new ErrorHandler('Order already delivered, so cannot update the order', 400))
    }

    // Order exists, and is not delivered yet. So can update the order.
    order.orderItems.forEach(async item => {
        await updateStock(item.product, item.quantity);
    });

    order.orderStatus = req.body.status;
    order.deliveredAt = Date.now();

    await order.save();

    res.status(200).json({
        success: true,
    });
});

async function updateStock(id, quantity){
    const product = await Product.findById(id);
    product.stock = product.stock - quantity;
    await product.save({validateBeforeSave:false});
}

// Admin can delete an order => /api/v1/admin/order/:id
exports.deleteOrder = catchAsyncErrors(async (req, res, next) => {
    const order = await Order.findById(req.params.id);
    
    if(!order) {
        return next(new ErrorHandler('No Order found with this ID', 404));
    }

    await order.remove();    

    res.status(200).json({
        success: true,
    });
});