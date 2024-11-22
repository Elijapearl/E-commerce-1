const mongoose = require('mongoose');
const Order = require('../models/orders');
const Product = require('../models/product');
const errorHandler = require('../utils/errorHandler');
const catchAsyncErrors = require('../middlewares/catchAsyncErrors');

// Create New Order => /api/v1/order/new
exports.newOrder = catchAsyncErrors(async (req, res, next) => {
    const {
        orderItems,
        shippingInfo,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
        paymentInfo
    } = req.body;

    const order = await Order.create({
        orderItems,
        shippingInfo,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
        paymentInfo,
        paidAt: Date.now(),
        user: req.user._id
    });

    res.status(201).json({
        success: true,
        order
    });
});

// Get Single Order => /api/v1/order/:id
exports.getSingleOrder = catchAsyncErrors(async (req, res, next) => {
    const order = await Order.findById(req.params.id).populate('user', 'name email');

    if (!order) {
        return next(new errorHandler('Order not found', 404));
    }

    res.status(200).json({
        success: true,
        order
    });
});

// Get Logged-in User Orders => /api/v1/order/me
exports.myOrders = catchAsyncErrors(async (req, res, next) => {
    const orders = await Order.find({ user: req.user._id });

    if (!orders || orders.length === 0) {
        return next(new errorHandler('No orders found for this user', 404));
    }

    res.status(200).json({
        success: true,
        orders
    });
});


// Get all Orders - ADMIN => /api/v1/admin/orders
exports.allOrders = catchAsyncErrors(async (req, res, next) => {
    const orders = await Order.find();

    let totalAmount = 0;

    orders.forEach(order => {
        totalAmount += order.totalPrice;
    });

    res.status(200).json({
        success: true,
        totalAmount,
        orders
    });
});

// Update/ Process Orders - ADMIN => /api/v1/admin/order/:id
exports.updateOrder = catchAsyncErrors(async (req, res, next) => {
    const order = await Order.findById(req.params.id);

    if(order.orderStatus === 'Delivered'){
        return next(new errorHandler('You have already delivered this Order'))
    }

    order.orderItems.forEach(async item => {
        await updateStock(item.product, item.quantity)
    })

    order.orderStatus = req.body.status,
    order.deliveredAt = Date.now()

    await order.save()

    res.status(200).json({
        success: true,
    });
});

//update product stock count after customer buy
async function updateStock(id, quantity){
    const product = await Product.findById(id);

    product.stock = product.stock - quantity
    
    await product.save({ validateBeforeSave: false })
}


//Delete Order
exports.deleteOrder = catchAsyncErrors(async (req, res, next) => {
    const order = await Order.findById(req.params.id).populate('user', 'name email');

    if (!order) {
        return next(new errorHandler('Order not found', 404));
    }

    await Order.findByIdAndDelete(req.params.id); // Use the Order model directly for deletion

    res.status(200).json({
        success: true,
        message: 'Order deleted successfully',
    });
});

