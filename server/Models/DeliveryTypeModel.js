const mongoose = require("mongoose")

//todo: How does the days to delivery work
const DeliveryTypeSchema = new mongoose.Schema({
    name: String,
    cost :Number,
    domesticDaysToDelivery: Number,
    internationalDaysToDelivery: Number,
});

module.exports = mongoose.model("DeliveryType", DeliveryTypeSchema)
