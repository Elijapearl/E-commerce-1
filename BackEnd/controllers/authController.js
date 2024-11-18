const User = require('../models/users');

const errorHandler = require('../utils/errorhandler');
const catchAsyncErrors = require('../middlewares/catchAsyncErrors');

const sendToken = require('../utils/jwtToken');

/*register a user => /api/v1/register 
ito is pang authenticate ng mga info na binigay ng user sa pag reregister at pang register naden mismo*/
exports.registerUser = catchAsyncErrors( async (req, res, next) => {

    const { name, email, password } = req.body;

    const user = await User.create({
        name,
        email,
        password, 
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
    Ang process dito is if nag enter ang user ng email at password is tsaka lang mag hahanapin ng 
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

