const mongoose = require("mongoose");

const PaymentSchema = new mongoose.Schema(
  {
    summary: {
      grandTotal: { type: Number, required: true },
      shippingCost: { type: Number, required: true },
      taxes: [
        {
          name: { type: String, required: true },
          amount: { type: Number, required: true },
          percent: { type: Number, required: true },
          // type: { type: String, enum: ["sender", "receiver"], required: true },
        },
      ],
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    paymentGateway: {
      orderId: { type: String, required: true, default: null },
      metadata: mongoose.Schema.Types.Mixed,
    },

    orderId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    date: { type: Date, required: true },
    method: {
      type: String,
      enum: ["card", "upi", "netbanking"],
      default: null,
    },
    status: {
      type: String,
      enum: ["pending", "successful", "failed", "refunded"],
      default: "pending",
    },

    failureReason: {
      type: String,
      default: null,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Payment", PaymentSchema);
