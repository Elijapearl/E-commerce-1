//create and send token to save in the cookie 

const sendToken = (user, statusCode, res) => {

    //create Jwt Token 
    const token = user.getJwtToken();

    //options for the cookie
    const options = {
        expires: new Date(
        Date.now() + process.env.JWT_COOKIE_EXPIRE_TME * 24 * 60 * 60 * 1000)
        httpOnly: true
    }

    const cookiepass = {
        secure: process.env.NODE_ENV
        sameSite: 
    }

}

module.exports = sendToken;