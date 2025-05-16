const mongoose = require("mongoose");

const PackageSchema =new mongoose.Schema({
    sender: mongoose.Schema.Types.ObjectId,
    recepient: mongoose.Schema.Types.ObjectId,
    orderType: {type: String, enum:["domestic", "international"], required:true},
    packageDetails: {
        packageType: {type: String, },
        packageContent:String,
        weight: {type:String, required: true},
        dimensions: {
            length: {type: Number, required:false, default:null},
            width: {type: Number, required:false, default:null},
            height: {type: Number, required:false, default:null},
        },
        //todo: are the values different for international and domestic
        packageValue: {type:Number, min:0, max:50000,required:true },
    },

    delivery: {
        deliveryType:{ 
            type:String, 
            required:true,
            enum: ["surface", "express"]
        }, 
        pickUpDate: Date
    },

    status: {
        type: String,
        enum: [
            'Order Placed',
            'Picked Up',
            'In Transit',
            'At Hub',
            'Out for Delivery',
            'Delivered',
            'Cancelled',
            'Failed Delivery',
        ],
        default: 'Order Placed',

    },

})

module.exports = mongoose.model("Package",PackageSchema)
