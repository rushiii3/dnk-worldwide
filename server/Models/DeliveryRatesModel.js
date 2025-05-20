const mongoose = require("mongoose");

const DeliveryRatesSchema = new mongoose.Schema({
  senderCountry: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Country",
  },
  receiverCountry: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Country",
  },
  ratePerKg: {
    amount: {
      type: Number,
      required: true,
    },
    currency: {
      type: String,
      enum: ["INR", "USD", "GBP"],
      required: true,
    },
  },
  minWeight: { type: Number, required: true },
  maxWeight: { type: Number, required: true },
});

module.exports = mongoose.model("DeliveryRates", DeliveryRatesSchema);
