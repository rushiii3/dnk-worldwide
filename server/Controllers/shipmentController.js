const asyncHandler = require("express-async-handler");
const User = require("../Models/UserModel");
const ThrowError = require("../utils/ThrowError");
const mongoose = require("mongoose");
const validator = require("validator");
const PostalCodeModel = require("../Models/PostalCodeModel");

const getLocationFromPincode = asyncHandler(async (req, res) => {
  const { pincode } = req.body;

  if (!pincode) {
    ThrowError("Pincode is required", 400);
  }

  // Validate pincode (simple check for 6 digits)
  //   if (!validator.isNumeric(pincode) || pincode.length !== 6) {
  //     ThrowError("Invalid pincode. It should be a 6-digit number.", 400);
  //   }

  const postalCode = await PostalCodeModel.findOne({ code: pincode }).populate({
    path: "city",
    populate: {
      path: "state",
      populate: {
        path: "country",
      },
    },
  });

  if (!postalCode) {
    ThrowError("Pincode not found", 404);
  }

  res.status(200).json({
    status: true,
    message: "Location fetched successfully",
    pincode: postalCode.code,
    city: postalCode.city.name,
    state: postalCode.city.state.name,
    country: postalCode.city.state.country.name,
  });
});

module.exports = {
  getLocationFromPincode,
};
