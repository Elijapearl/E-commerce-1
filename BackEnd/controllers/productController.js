const Product = require('../models/product')

const ErrorHandler = require('../utils/errorHandler')

const catchAsyncError = require('../middlewares/catchAsyncErrors')

const APIFeatures = require('../utils/features')

//create new product for admin => api/v1/admin/product/new
exports.newProduct = catchAsyncError(async (req, res, next) => {
    req.body.user = req.user.id; // Assign logged-in user to product

    // Populate `user` in reviews if provided
    if (req.body.reviews && Array.isArray(req.body.reviews)) {
        req.body.reviews = req.body.reviews.map(review => ({
            ...review,
            user: req.user.id // Automatically add the user
        }));
    }

    const product = await Product.create(req.body);

    res.status(201).json({
        success: true,
        product
    });
});



//Get all products => /api/v1/products - ito directory nya para sa postman
exports.getProducts = catchAsyncError(async (req, res, next) => {

    const resPerPage = 8;//ito yung count ng product na makikita per page
    const productsCount = await Product.countDocuments(); //this just counts all products
    
    const features = new APIFeatures(Product.find(), req.query)   
                        .search() 
                        .filter() 
                        .pagination(resPerPage)
    const products = await features.query;

    setTimeout(() => {
        res.status(200).json({
            success: true,
            productsCount,
            products
        })
    }, 2000);

    
})

//Get Single Product Details => /api/v1/product/:id - ito directory nya para sa postman

exports.getSingleProduct = catchAsyncError(async (req, res, next) => {
    const product = await Product.findById(req.params.id)

    if (!product){
        return next(new ErrorHandler('Product Not Found', 404));
    }

    res.status(200).json({
        success: true,
        product
    })

})

//Get Single Product Details => /api/v1/admin/product/:id - ito directory nya para sa postman
exports.updateProduct = catchAsyncError(async (req, res, next) => {

    let product = await Product.findById(req.params.id)

    if (!product){
        return res.status(404).json({
            success: false,
            message: "Product not found"
        })
    }

    product = await Product.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
        useFindAndModify: false
    })

    res.status(200).json({
        success: true,
        product
    })
})


// Delete product by admin => /api/v1/admin/product/:id - ito directory nya para sa postman
exports.deleteProduct = catchAsyncError(async (req, res, next) => {
    let product = await Product.findById(req.params.id);

    if (!product) {
        return res.status(404).json({
            success: false,
            message: "Product not found"
        });
    }

    await Product.findByIdAndDelete(req.params.id);  

    res.status(200).json({
        success: true,
        message: 'Product is deleted.'
    });
})

// Create or Update Review => /api/v1/review
exports.createProductReview = catchAsyncError(async (req, res, next) => {
    const { rating, comment, productId } = req.body;

    // Step 1: Check if the product exists
    const product = await Product.findById(productId);

    if (!product) {
        return next(new ErrorHandler('Product not found', 404));
    }

    // Step 2: Create a review object
    const review = {
        user: req.user._id,
        name: req.user.name,
        rating: Number(rating), // Ensure rating is a number
        comment
    };

    // Step 3: Check if the reviews array is defined and if the user has already reviewed this product
    if (!Array.isArray(product.reviews)) {
        product.reviews = []; // Initialize it as an empty array if it's undefined
    }

    const isReviewed = product.reviews.find(
        (r) => r.user && r.user.toString() === req.user._id.toString() // Ensure r.user exists
    );

    if (isReviewed) {
        // Step 4: Update the existing review if the user already reviewed
        product.reviews.forEach(review => {
            if (review.user && review.user.toString() === req.user._id.toString()) { // Ensure r.user exists
                review.comment = comment;
                review.rating = rating;
            }
        });
    } else {
        // Step 5: Add a new review if the user hasn't reviewed yet
        product.reviews.push(review);
        product.numOfReviews = product.reviews.length;
    }

    // Step 6: Recalculate the average rating
    product.rating =
        product.reviews.reduce((acc, item) => item.rating + acc, 0) /
        product.reviews.length;

    // Step 7: Save the updated product with the new or updated review
    await product.save({ validateBeforeSave: false });

    // Step 8: Send response
    res.status(200).json({
        success: true,
        message: isReviewed ? 'Review updated successfully' : 'Review added successfully',
    });
});

