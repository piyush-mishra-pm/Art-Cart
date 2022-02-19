const mongoose = require('mongoose');

const orderSchema = mongoose.Schema({
    shippingInfo: {
        address: {
            type: String,
            required: true,
        },
        city: {
            type: String,
            required: true,
        },
        postalCode: {
            type: String,
            required: true,
        },
        country: {
            type: String,
            required: true,
        },
        phoneNo: {
            type: String,
            required: true,
        },
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User',
    },
    orderItems: [
        {
            name: {
                type: String,
                required: true,
            },
            price: {
                type: Number,
                required: true,
            },
            product: {
                type: mongoose.Schema.Types.ObjectId,
                required: true,
                ref: 'Product',
            },
            quantity: {
                type: Number,
                required: true,
            },
            image: {
                type: String,
                required: true,
            },
        },
    ],
    paymentInfo: {
        // Stripe ID of transaction:
        id: {
            type: String,
        },
        // Stripe payment status.
        status: {
            type: String,
        },
    },
    itemsPrice: {
        type: Number,
        required: true,
        default: 0.0,
    },
    taxPrice: {
        type: Number,
        required: true,
        default: 0.0,
    },
    // Shipping Price can depend upon total price of order
    // (above a certain threshold, shippuing can be free).
    shippingPrice: {
        type: Number,
        required: true,
        default: 0.0,
    },
    totalPrice: {
        type: Number,
        required: true,
        default: 0.0,
    },
    paidAt:{
        type:Date,
    },
    orderStatus: {
        type: String,
        required: true,
        default: 'Processing'
    },
    deliveredAt:{
        type:Date,
    },
    createdAt:{
        type:Date,
        default: Date.now,
    }
});

module.exports = mongoose.model('Order',orderSchema);