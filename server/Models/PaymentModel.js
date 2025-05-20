const mongoose = require("mongoose");

const PaymentSchema = new mongoose.Schema(
  {
    amount: {
      finalAmount: { type: Number, required: true },
      baseAmount: { type: Number, required: true },
      taxes: [
        {
          name: { type: String, required: true },
          amount: { type: Number, required: true },
          percent: { type: Number, required: true },
          type: { type: String, enum: ["sender", "receiver"], required: true },
        },
      ],
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    packageId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    date: Date,
    type: {
      type: String,
      enum: ["Card", "UPI", "Netbanking"],
      required: true,
    },
    status: {
      type: String,
      enum: ["Pending", "Completed", "Failed", "Refunded"],
      default: "Pending",
    },

    failureReason: {
      type: String,
      default: null,
    },
    transactionDetails: {
      transactionId: String,
      provider: String,
      metadata: mongoose.Schema.Types.Mixed,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Payment", PaymentSchema);
