const asyncHandler = require("express-async-handler");
const User = require("../Models/UserModel");
const { generateAccessToken, generateRefreshToken } = require("../utils/token");
const ThrowError = require("../utils/ThrowError");
const { PhoneNumberUtil, PhoneNumberFormat } = require("google-libphonenumber");
const phoneUtil = PhoneNumberUtil.getInstance();
const PNF = require("google-libphonenumber").PhoneNumberFormat;
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const validator = require("validator");

const validatePhoneNumber = (countryCode, phoneNumber) => {
  try {
    // Combine the country code and phone number to form the full number
    const fullPhoneNumber = `${countryCode}${phoneNumber}`;

    // Parse the full phone number (including country code)
    const number = phoneUtil.parseAndKeepRawInput(
      fullPhoneNumber,
      countryCode.substring(1)
    ); // Remove the "+" from country code
    // Validate the phone number
    if (!phoneUtil.isValidNumber(number)) {
      return "Invalid phone number";
    }

    return null; // Valid phone number
  } catch (error) {
    console.log(error);

    return "Invalid phone number format";
  }
};

const { sendOtp, verifyOtp } = require("../utils/smsHelper");
const refreshModel = require("../Models/refreshModel");
const sendOTP = asyncHandler(async (req, res) => {
  const { countryCode, phoneNumber } = req.body;

  if (!countryCode || !phoneNumber) {
    ThrowError("Phone number and country code are required", 400);
  }

  // Validate countryCode (simple check for + followed by digits)
  if (!countryCode.match(/^\+\d{1,4}$/)) {
    ThrowError(
      "Invalid country code. Format should be '+<countryCode>' (e.g., '+91')",
      400
    );
  }

  // Validate phone number with libphonenumber
  const validationError = validatePhoneNumber(countryCode, phoneNumber);
  if (validationError) {
    ThrowError(validationError, 400);
  }
  const phone = `${countryCode} ${phoneNumber}`;
  const { sessionId, sid } = await sendOtp(phone); // Call the sendOtp function from utils
  //   if (!sessionId || !sid) {

  if (!sessionId) {
    ThrowError("Failed to send OTP. Please try again", 500);
  }
  res.status(200).json({
    message: "OTP sent successfully",
    sessionId, // Return session ID for future validation
    status: true,
  });
});

const sendTokenResponse = (res, user, accessToken, refreshToken) => {
  res.cookie("accessToken", accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "Strict",
    maxAge: 15 * 60 * 1000,
  });

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "Strict",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  res.status(200).json({
    message: "OTP verified successfully",
    user: {
      fullname: user.fullname || "",
      email: user.email || "",
      phoneNumber: user.phoneNumber,
      countryCode: user.countryCode,
    },
    status: true,
  });
};

const verifyOTP = asyncHandler(async (req, res, next) => {
  const { sessionId, code, countryCode, phoneNumber } = req.body;

  // Input validations
  if (!sessionId || !code) {
    ThrowError("Session ID and OTP code are required", 400);
  }

  if (code.length !== 6 || !/^\d{6}$/.test(code)) {
    ThrowError("Invalid OTP code. It should be 6 digits", 400);
  }

  if (!countryCode || !phoneNumber) {
    ThrowError("Phone number and country code are required", 400);
  }

  if (!countryCode.match(/^\+\d{1,4}$/)) {
    ThrowError("Invalid country code format. Expected '+<digits>'", 400);
  }

  const validationError = validatePhoneNumber(countryCode, phoneNumber);
  if (validationError) ThrowError(validationError, 400);

  try {
    const isValid = await verifyOtp(sessionId, code, countryCode, phoneNumber);
    if (!isValid) return res.status(400).json({ error: "Invalid OTP" });

    let user = await User.findOne({ phoneNumber, countryCode });

    if (!user) {
      user = await User.create({ phoneNumber, countryCode });
    }

    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    const expiresIn = 7 * 24 * 60 * 60 * 1000; // 7 days in milliseconds
    await refreshModel.deleteMany({ user: user._id }); // One active session

    await refreshModel.create({
      token: refreshToken,
      user: user._id,
      expiresAt: new Date(Date.now() + expiresIn),
    });

    await user.save();

    sendTokenResponse(res, user, accessToken, refreshToken);
  } catch (error) {
    next(error);
  }
});

const getRefreshToken = (req) => {
  // 1. Try cookies
  if (req.cookies && req.cookies.refreshToken) {
    return req.cookies.refreshToken;
  }

  // 2. Try Authorization header
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith("Bearer ")) {
    return authHeader.split(" ")[1];
  }

  return null; // If no token found
};

const generateRefreshTokenUser = asyncHandler(async (req, res, next) => {
  const refreshToken = getRefreshToken(req);

  console.log(refreshToken);

  if (!refreshToken) {
    ThrowError("Refresh token is required", 400);
  }
  const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);

  try {
    const checkRefreshToken = await refreshModel.findOne({
      token: refreshToken,
      user: new mongoose.Types.ObjectId(decoded.id),
    });

    if (!checkRefreshToken) {
      ThrowError("Invalid refresh token", 403);
    }
    const newAccessToken = generateAccessToken(checkRefreshToken.user);
    const newRefreshToken = generateRefreshToken(checkRefreshToken.user);
    checkRefreshToken.refreshToken = newRefreshToken;
    await checkRefreshToken.save();
    res.cookie("accessToken", newAccessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Strict",
      maxAge: 15 * 60 * 1000,
    });
    res.cookie("refreshToken", newRefreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    res.status(200).json({
      message: "Refresh token generated successfully",
      status: true,
    });
  } catch (error) {
    next(error);
  }
});

const getVerifiedUser = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  const user = await User.findById(userId).select("-password");

  if (!user) {
    ThrowError("User not found", 404);
  }

  res.status(200).json({
    message: "User fetched successfully",
    user,
    status: true,
  });
});

const updateUserInfo = asyncHandler(async (req, res, next) => {
  const { fullname, email } = req.body;
  const userId = req.user._id;

  // Basic presence check
  if (!email) {
    ThrowError("Email is required", 400);
  }
  if (!fullname) {
    ThrowError("Fullname is required", 400);
  }
  if (!validator.isEmail(email)) {
    ThrowError("Invalid email format.", 400);
  }

  // Fullname: only letters and spaces, min 2 and max 50 characters
  const nameRegex = /^[a-zA-Z\s]{2,50}$/;
  if (!nameRegex.test(fullname)) {
    ThrowError(
      "Fullname must contain only letters and spaces, and be 2 to 50 characters long.",
      400
    );
  }

  // Get current user
  const currentUser = await User.findById(userId);
  if (!currentUser) {
    ThrowError("User not found", 404);
  }

  // Compare current and new data
  if (currentUser.fullname === fullname && currentUser.email === email) {
    ThrowError("No changes detected in user information.", 400);
  }

  const updatedUser = await User.findByIdAndUpdate(
    userId,
    { fullname, email },
    { new: true }
  );

  if (!updatedUser) {
    ThrowError("Failed to update info", 400);
  }

  res.status(200).json({
    message: "User info updated successfully",
    status: true,
  });
});

module.exports = {
  sendOTP,
  verifyOTP,
  generateRefreshTokenUser,
  getVerifiedUser,
  updateUserInfo,
};
