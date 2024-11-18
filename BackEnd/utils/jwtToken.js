//create and send token to save in the cookie 

const sendToken = (user, statusCode, res) => {

    //create Jwt Token 
    const token = user.getJwtToken();

    //options for the cookie
    const options = {
        expires: new Date(
        Date.now() + process.env.COOKIE_EXPIRE_TIME * 24 * 60 * 60 * 1000
    ),
        httpOnly: true
        //http only cookie only so that it can't be accessed by using javascript
    }

    res.status(statusCode).cookie('token',token, options).json({
        success: true,
        token,
        user
    })

}   

module.exports = sendToken;