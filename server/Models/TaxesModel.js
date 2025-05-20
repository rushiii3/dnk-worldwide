const mongoose = require("mongoose");

const TaxesSchema = new mongoose.Schema({
  senderCountry: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Country",
    required: true,
  },
  receiverCountry: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Country",
    required: true,
  },

  leviedOn: { type: String, enum: ["sender", "receiver"], required: true },
  name: {
    type: String,
    required: true,
    enum: ["customs", "excise-duty", "gst"],
  },
  percent: { type: Number, required: true },
  priority: { type: Number, required: true },
  productHSCode: { type: Number, default: null },
});
module.exports = mongoose.model("Taxes", TaxesSchema);
