const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please Enter Product name'],
        trim: true,
        maxLength: [100, 'Product name cannot exceed 100 Characters']
    },
    price: {
        type: Number,
        required: [true, 'Please Enter Product name'],
        trim: true,
        maxLength: [5, 'Product name cannot exceed 5 Characters'],
        default: 0.0    
    },
    description: {
        type: String,
        required: true
    },
    ratings: {
        type: Number,
        default: 0
    },
    //i used array in the images so that can use multiple messages 
    images:[
        {
            public_id: {
                type: String,
                required: true
            },
            url: {
                type: String,
                required: true
            }
        }
    ],
    category: {
        type: String,
        required: [true, "Please Select Product Category"],
        enum: {
            values: [
                'Laundry',
                'Beauty',
                'Food',
                'Beverage'
            ],
            message: 'Please select the correct product category.'
        }
    },
    seller: {
        type: String,
        required: [true, 'Please Enter Product Seller']
    },
    stock: {
        type: Number,
        required: [true, 'Please Enter Product Stock'],
        maxLength: [5, 'Product Stock cannot exceed 5 numbers'],
        default: 0
    },
    numOfReviews: {
        type: Number, 
        default: 0
    },
    reviews: [
        {
            name: {
                type: String,
                required: true
            },
            rating: {
                type: Number,
                required: true
            }, 
            comment: {
                type: String,
                required: true
            }
        }
    ], 
    createdAt: {
        type: Date,
        default: Date.now
    }
})
module.exports = mongoose.model('Product', productSchema)