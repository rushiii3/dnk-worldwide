const mongoose = require("mongoose");

const otpSessionSchema = new mongoose.Schema({
  sessionId: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  attempts: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now, expires: 300 }, // auto-delete after 5 minutes
});

module.exports = mongoose.model("OtpSession", otpSessionSchema);
