// Create and send token and save in the cookie.
const sendToken = (user, statusCode, res) => {
    // Create Jwt token:
    const token = user.getJwtToken();

    // Cookie Options:
    const cookieOptions = {
        expires: new Date(
            Date.now() + process.env.COOKIE_EXPIRATION_TIME_IN_DAYS*24*60*60*1000
        ),
        httpOnly: true
    }

    res.status(statusCode).cookie('token',token, cookieOptions).json({
        success: true,
        token,
        user
    })
}

module.exports = sendToken;