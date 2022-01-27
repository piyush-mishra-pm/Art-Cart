const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required:[true, 'Please enter a valid product name'],
        trim: true,
        maxLength:[100, 'Product name cannot exceed 100 characters']
    },
    price:{
        type: Number,
        required: [true, 'Please enter a valid product price'],
        maxLength: [5, 'Product price cannot exceed 5 characters'],
        default: 0.0
    },
    description: {
        type: String,
        required: [true, 'Please enter a valid product description']
    },
    ratings:{
        type: Number,
        default: 0,
    },
    images: [
        {
            public_id:{
                type: String,
                required: [true, 'Please enter a valid cloudinary public id'],
            },
            url:{
                type: String,
                required: [true, 'Please enter a valid cloudinary img url'],
            }
        }
    ],
    category:{
        type:String,
        required: [true, 'Please select valid product category'],
        enum: {
            values: [
                'Sculptures',
                'Fabric',
                'Paintings',
                'Cards'
            ],
            message: 'Please select valid product category from the specified categories.'
        }
    },
    seller:{
        type: String,
        required: [true, 'Please enter a valid product Seller'],
    },
    stock: {
        type: Number,
        required:[true, 'Please enter product\'s available stock'],
        maxLength:[5, 'Stock can\'t have more than 5 digits'],
        default: 0,
    },
    numOfReviews: {
        type: Number,
        default: 0
    },
    reviews: [
        {
            name:{
                type: String,
                required: [true, 'Please enter a valid name for reviewer.'],
            },
            rating: {
                type: Number,
                required: [true, 'Please enter a valid rating for product.'],
            },
            comment:{
                type:String,
                required: [true, 'Please enter a valid comment for the product being reviewed.'],
            }
        }
    ],
    createdAt:{
        type:Date,
        default: Date.now,
    }
});

module.exports = mongoose.model('Product', productSchema);