const asyncHandler = require('express-async-handler')

const User = require('../Models/UserModel')
const {generateAccessToken, generateRefreshToken} = require("../utils/token")
const loginUser = asyncHandler(async (req, res) => { 

    res.status(200).json({
        message: 'Login user',
        accessToken : generateAccessToken({_id: 12345}),
        refreshToken : generateRefreshToken({_id: 12345}),
    })
});

module.exports = {
  loginUser,
}