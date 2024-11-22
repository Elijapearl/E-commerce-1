const Product = require('../models/product')

const ErrorHandler = require('../utils/errorHandler')

const catchAsyncError = require('../middlewares/catchAsyncErrors')

const APIFeatures = require('../utils/features')

//create new product for admin => api/v1/admin/product/new
exports.newProduct = catchAsyncError(async (req, res, next) => {

    req.body.user = req.user.id;
 
    const product = await Product.create(req.body)

    res.status(201).json({
        success: true,
        product
    })
})


//Get all products => /api/v1/products?keyword=apple - ito directory nya para sa postman
exports.getProducts = catchAsyncError(async (req, res, next) => {

    const resPerPage = 8;//ito yung count ng product na makikita per page
    const productCount = await Product.countDocuments(); //this just counts all products
    
    const features = new APIFeatures(Product.find(), req.query)   
                        .search() 
                        .filter() 
                        .pagination(resPerPage)
    const products = await features.query;

    res.status(200).json({
        success: true,
        count: products.length,
        productCount,
        products
    })
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



// Get Product reviews => /api/v1/reviews/:productId
exports.getProductReviews = catchAsyncError(async (req, res, next) => {
    // Ensure you're using the correct identifier (productId)
    const product = await Product.findById(req.query.id)

    if (!product) {
        return next(new ErrorHandler('Product not found', 404));
    }

    res.status(200).json({
        success: true,
        reviews: product.reviews, // Return the reviews for the product
    });
});


exports.deleteReviews = catchAsyncError(async (req, res, next) => {
    const { productId, id } = req.query;

    // Ensure that both productId and id are provided
    if (!productId || !id) {
        return next(new ErrorHandler('Product ID and Review ID are required', 400));
    }

    const product = await Product.findById(productId);

    if (!product) {
        return next(new ErrorHandler('Product not found', 404));
    }

    // Find the review that matches the provided review ID
    const reviewToDelete = product.reviews.find(review => review._id.toString() === id.toString());

    if (!reviewToDelete) {
        return next(new ErrorHandler('Review not found', 404));
    }

    // Check if the logged-in user is the one who created the review
    if (reviewToDelete.user.toString() !== req.user._id.toString()) {
        return next(new ErrorHandler('You are not authorized to delete this review', 403));
    }

    // Filter the reviews and remove the review with the provided ID
    const reviews = product.reviews.filter(review => review._id.toString() !== id.toString());

    // If there are no reviews left, ensure that the `reviews` array is still valid
    const numOfReviews = reviews.length;
    const ratings = reviews.length
        ? reviews.reduce((acc, item) => item.rating + acc, 0) / reviews.length
        : 0;

    // Update the product with the new reviews and ratings
    await Product.findByIdAndUpdate(
        productId,
        { reviews, rating: ratings, numOfReviews },
        { new: true, runValidators: false, useFindAndModify: false }
    );

    res.status(200).json({
        success: true,
        message: 'Review deleted successfully'
    });
});

