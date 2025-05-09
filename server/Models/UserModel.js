const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    countryCode: {
      type: String,
      required: true,
    },
    phoneNumber: {
      type: String,
      required: true,
    },
    fullname: {
      type: String,
      trim: true,
      default: "", // Not required at creation
    },
    email: {
      type: String,
      unique: true,
      lowercase: true,
      trim: true,
      sparse: true, // Ensures unique works even when email is not provided
    },
    country: {
      type: String,
      default: "",
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
  },
  {
    timestamps: true,
  }
);



module.exports = mongoose.model("User", userSchema);
