const User = require('../models/users');

const errorHandler = require('../utils/errorhandler');
const catchAsyncErrors = require('../middlewares/catchAsyncErrors');

const sendToken = require('../utils/jwtToken');

const sendEmail = require('../utils/sendEmail');

const crypto = require('crypto');

/*register a user => /api/v1/register 
ito is pang authenticate ng mga info na binigay ng user sa pag reregister at pang register naden mismo*/
exports.registerUser = catchAsyncErrors( async (req, res, next) => {

    const { name, email, password, store } = req.body;

    const user = await User.create({
        name,
        email,
        password, 
        store,
        avatar: {
            public_id: 'users/vgtxrlm9453yi2tijzqk',
            url: 'https://res.cloudinary.com/dnmawrba8/image/upload/v1731847500/users/vgtxrlm9453yi2tijzqk.jpg'
        }
    })
    sendToken(user, 200, res)
})


//login a user => /api/v1/login
/* ito is para sa user login and sa authentication ng logins */
exports.loginUser = catchAsyncErrors( async (req, res, next) => {
    const { email, password } = req.body;

    //check if email and user is entered by user
    if(!email || !password){
        return next(new errorHandler('Please Enter Your Email and Password', 400))
    }

    /* 
    Ang process dito is if nag enter ang user ng email at password is tsaka lang hahanapin ng 
    function yung user sa database
    */


    //find user by email and password
    const user = await User.findOne({ email }).select('+password')

    if (!user) {
        return next(new errorHandler('Invalid Email or Password', 401))
    }

    //check if password is correct or not 
    const isPasswordMatched = await user.comparePassword(password)

    if (!isPasswordMatched) {
        return next(new errorHandler('Invalid Email or Password', 401))
    }
    sendToken(user, 200, res)
})

//Try ko gumawa ng forgot password 
///api/v1/password/forgot
exports.forgotPassword = catchAsyncErrors( async (req, res, next) =>{

    const user = await User.findOne({ email: req.body.email });

    if(!user){
        return next(new errorHandler('User Not Found', 404))
    }

    //Get Reset Token 
    const resetToken =  user.getResetPasswordToken();


    await user.save({ validateBeforeSave: false });

    //create reset password url 

    const resetUrl = `${req.protocol}://${req.get('host')}/api/v1/password/reset/${resetToken}`;

    const message = `Reset Password token:\n\n${resetUrl}\n\nif you have not requested this email, then please ignore it.`

    try{
       
        await sendEmail({
            email: user.email, 
            subject: 'Mente Password Reset',
            message
        })
        res.status(200).json({
            success: true,
            message: `Email sent to: ${user.email}`
        })

    }catch (error){
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;

        await user.save({ validateBeforeSave: false });

        return next(new errorHandler(error.message, 500))
    }
})

///api/v1/password/reset/:token
//now reset the password
exports.resetPassword = catchAsyncErrors( async (req, res, next) =>{
    
    //Hash UTL token
    const resetPasswordToken = crypto.createHash('sha256').update(req.params.token).digest('hex')

    const user = await User.findOne({
        resetPasswordToken,
        resetPasswordExpire: { $gt: Date.now() }
    })


    if(!user){
        return next(new errorHandler('Password Reset Token Expired', 400))
    }

    if(req.body.password !== req.body.confirmPassword){
        return next(new errorHandler('Passwords do not match', 400))
    }

    //setup new password
    user.password = req.body.password;

    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    sendToken(user, 200, res)
})

//get Currently logged in user info /api/v1/me 
exports.getUserProfile = catchAsyncErrors(async (req, res, next) => {
    const user = await User.findById(req.user.id);

    res.status(200).json({
        success: true,
        user
    })
})

//Update / Change Password => /api/v1/password/update
exports.updatePassword = catchAsyncErrors(async (req, res, next) => {

    const user = await User.findById(req.user.id).select('+password')

    //check previous user password

    const isMatched = await user.comparePassword(req.body.oldPassword)

    if(!isMatched){
        return next(new errorHandler('old password is incorect', 401))
    }

    user.password = req.body.password;
    await user.save();

    sendToken(user, 200, res)
})

//logout user = /api/v1/logout
exports.logout = catchAsyncErrors(async (req, res, next) => {
    res.cookie('token', null, {
        expires: new Date(Date.now()),
        httpOnly: true
    })

    res.status(200).json({
        success: true,
        message: 'User logged out'
    })
})
