const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const OtpSchema = new mongoose.Schema(
  {
    phone: { type: String, required: true },
    otp: { type: String, required: true }, // hashed
    attempts: { type: Number, default: 0 },
    expiresAt: { type: Date, required: true },
    verified: { type: Boolean, default: false },
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("otp")) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    this.otp = await bcrypt.hash(this.otp, salt);
    next();
  } catch (err) {
    next(err);
  }
});

userSchema.methods.compareOTP = function (enteredOTP) {
  return bcrypt.compare(enteredOTP, this.otp);
};
module.exports = mongoose.model("OtpVerification", OtpSchema);
