const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema({
  sender: { type: mongoose.Schema.Types.ObjectId, required: true },
  recepient: { type: mongoose.Schema.Types.ObjectId, required: true },
  orderType: {
    type: String,
    enum: ["domestic", "international"],
    required: true,
  },
  packageInfo: {
    type: { type: String, required: true },
    content: { type: String, required: true },
    exactWeight: { type: Number, default: null },
    minWeight: { type: Number, default: null },
    maxWeight: { type: Number, default: null },
    weightClass: {
      type: String,
      required: true,
      enum: ["xs", "s", "l", "m", "l+", "xl"],
    },
    dimensions: {
      length: { type: Number, required: false, default: null },
      width: { type: Number, required: false, default: null },
      height: { type: Number, required: false, default: null },
      unit: { type: String, enum: ["in", "cm"], default: null },
      volumetricWeight: { type: Number, default: null },
    },
    //todo: are the values different for international and domestic
    value: { type: Number, min: 0, max: 50000, required: true },
    chosenWeight: {
      magnitude: { type: Number, required: true },
      type: {
        type: String,
        enum: ["volumetric", "userProvided"],
        required: true,
      },
    },
  },

  deliveryInfo: {
    deliveryType: {
      type: String,
      required: true,
      enum: ["surface", "express"],
    },
    pickupDate: { type: Date, required: true },
  },

  status: {
    type: String,
    enum: [
      "Order Placed",
      "Picked Up",
      "In Transit",
      "At Hub",
      "Out for Delivery",
      "Delivered",
      "Cancelled",
      "Failed Delivery",
    ],
    default: "Order Placed",
  },
});

module.exports = mongoose.model("Order", OrderSchema);
