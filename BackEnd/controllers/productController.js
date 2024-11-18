const Product = require('../models/product')

const ErrorHandler = require('../utils/errorhandler')

const catchAsyncError = require('../middlewares/catchAsyncErrors')

const APIFeatures = require('../utils/features')

//create new product for admin => api/v1/admin/product/new
exports.newProduct = catchAsyncError(async (req, res, next) => {
 
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
