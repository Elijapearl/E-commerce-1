const User = require('../models/users')

const jwt = require('jsonwebtoken');
const ErrorHandler = require("../utils/errorhandler");
const catchAsyncErrors = require("./catchAsyncErrors");

//checks if user is authenticated
exports.isAuthenticatedUser = catchAsyncErrors( async (req, res, next) => {

     const { token } = req.cookies

    if(!token) {
        return next(new ErrorHandler('Login First to access this resource.', 401));
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    req.user = await User.findById(decoded.id);

    next()
})