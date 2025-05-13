const mongoose = require("mongoose");

const addressSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    }, // Reference to the user
    contactName: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    email: { type: String },
    flat: { type: String, required: true },
    area: { type: String, required: true },
    postalCode: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "PostalCode",
      required: true,
    },
    // Address type: Pickup or Delivery
    type: {
      type: String,
      enum: ["Pickup", "Delivery"],
      required: true,
    },
    label: {
      type: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Address", addressSchema);
