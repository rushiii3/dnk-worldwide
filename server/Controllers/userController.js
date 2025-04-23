const asyncHandler = require("express-async-handler");
const User = require("../Models/UserModel");
const { generateAccessToken, generateRefreshToken } = require("../utils/token");
const ThrowError = require("../utils/ThrowError");
const { PhoneNumberUtil, PhoneNumberFormat } = require("google-libphonenumber");
const phoneUtil = PhoneNumberUtil.getInstance();
const PNF = require("google-libphonenumber").PhoneNumberFormat;
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

    user.accessToken = accessToken;
    await user.save();

    sendTokenResponse(res, user, accessToken, refreshToken);
  } catch (error) {
    next(error);
  }
});

module.exports = {
  sendOTP,
  verifyOTP,
};
