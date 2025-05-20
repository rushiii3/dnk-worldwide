require("dotenv").config();
const asyncHandler = require("express-async-handler");
const ThrowError = require("../utils/ThrowError");
//const mongoose = require("mongoose");
//const validator = require("validator");
const crypto = require("crypto");

const User = require("../Models/UserModel");
const PostalCodeModel = require("../Models/PostalCodeModel");
const PackageModel = require("../Models/PackageModel.js");
const AddressModel = require("../Models/AddressModel.js");
const PaymentModel = require("../Models/PaymentModel.js");
const isObjectIdValid = require("../utils/ValidateObjectId.js");
const DeliveryRatesModel = require("../Models/DeliveryRatesModel.js");
const TaxesModel = require("../Models/TaxesModel.js");

//setup razorpay for testing

const getLocationFromPincode = asyncHandler(async (req, res) => {
  const { pincode } = req.body;

  if (!pincode) {
    ThrowError("Pincode is required", 400);
  }

  // Validate pincode (simple check for 6 digits)
  //   if (!validator.isNumeric(pincode) || pincode.length !== 6) {
  //     ThrowError("Invalid pincode. It should be a 6-digit number.", 400);
  //   }

  const postalCode = await PostalCodeModel.findOne({ code: pincode }).populate({
    path: "city",
    populate: {
      path: "state",
      populate: {
        path: "country",
      },
    },
  });

  if (!postalCode) {
    ThrowError("Pincode not found", 404);
  }

  res.status(200).json({
    status: true,
    message: "Location fetched successfully",
    pincode: postalCode.code,
    city: postalCode.city.name,
    state: postalCode.city.state.name,
    country: postalCode.city.state.country.name,
    postalCodeId: postalCode._id,
  });
});

const addAddress = asyncHandler(async (req, res) => {
  const { contactName, phone, email, flat, area, postalCode, type, label } =
    req.body;
  const userId = req.user._id;
  const user = await User.findById(userId);
  if (!user) {
    ThrowError("No user found", 404);
  }

  if (!contactName || contactName.length < 1) {
    ThrowError("Contact name is required", 400);
  } else if (!phone || phone.length < 10) {
    ThrowError("Phone number missing or invalid", 400);
  } else if (!email || email.length < 1) {
    ThrowError("Email required ", 400);
  } else if (!RegExp(/^[\w\.\+-]+@([\w-]+\.)+[\w-]+$/).test(email)) {
    ThrowError("Invalid email", 400);
  } else if (!flat || flat.length < 1) {
    ThrowError("Flat required", 400);
  } else if (!area || area.length < 1) {
    ThrowError("Area required", 400);
  } else if (!postalCode || postalCode.length < 1) {
    ThrowError("Postalcode required", 400);
  } else if (!isObjectIdValid(postalCode)) {
    ThrowError("Invalid postal code provided", 400);
  } else if (!type || type.length < 1) {
    ThrowError("Address type  required", 400);
  } else if (!["delivery", "pickup"].includes(type.toLowerCase().trim())) {
    ThrowError("Invalid address type", 400);
  } else if (!label || label.length < 1) {
    ThrowError("Label required", 400);
  }

  const address = new AddressModel({
    userId: userId,
    contactName: contactName,
    phoneNumber: phone,
    email: email,
    flat: flat,
    area: area,
    postalCode: postalCode,
    type: type,
    label: label,
  });

  const insertResult = await address.save();

  if (!insertResult.id || !insertResult) {
    ThrowError("Failed to add new address", 500);
  }

  return res
    .status(200)
    .json({ success: true, message: "Address added successfully" });
});

const getAddresses = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const user = await User.findById(userId);
  if (!user) {
    ThrowError("No user found", 404);
  }

  let addresses = await AddressModel.find({ userId: userId })
    .populate({
      path: "postalCode",
      select: "code",
      populate: {
        path: "city",
        select: "name",
        populate: {
          path: "state",
          select: "name",
          populate: { path: "country", select: "name" },
        },
      },
    })
    .lean();

  addresses = addresses.map((addr) => ({
    contactName: addr.contactName,
    _id: addr._id,
    phone: addr.phoneNumber,
    email: addr.email,
    flat: addr.flat,
    area: addr.area,
    postalCode: { _id: addr.postalCode?._id, code: addr.postalCode?.code },
    city: addr.postalCode?.city?.name,
    state: addr.postalCode?.city?.state?.name,
    country: addr.postalCode?.city?.state?.country?.name,
    type: addr.type,
    label: addr.label,
  }));

  return res.status(200).json({ success: true, addresses: addresses });
});

const decimalRegex = RegExp(/^\d+(\.\d+)?$/);

const getDeliveryCost = asyncHandler(async (req, res) => {
  const {
    pickUpAddr,
    destinationAddr,
    packageDimensions,
    minWeight,
    maxWeight,
    exactWeight,
    productHSCode = "1000.11", //TODO: remove 1000.11 in production. 1000.11 is just given for testing
  } = req.body;

  if (!pickUpAddr || pickUpAddr.length < 1) {
    ThrowError("Pickup address is required", 400);
  } else if (!isObjectIdValid(pickUpAddr)) {
    ThrowError("Invalid pickup address", 400);
  } else if (!destinationAddr || destinationAddr.length < 1) {
    ThrowError("Destination address is required", 400);
  } else if (!isObjectIdValid(destinationAddr)) {
    ThrowError("Invalid destination address", 400);
  }
  //NOTE: When exact weight is given, min and max weight can be null.
  //When min and max weight are given, exact weight can be null.
  else if ((minWeight && !maxWeight) || (!minWeight && maxWeight)) {
    ThrowError("Both minimum weight and max weight are required", 400);
  } else if (!exactWeight && (!minWeight || !maxWeight)) {
    ThrowError("Exact weight or min and max weight are required", 400);
  } else if (exactWeight && !packageDimensions) {
    ThrowError("Package dimensions - length, width and height required", 400);
  } else if (!exactWeight && packageDimensions) {
    ThrowError("Exact weight required", 400);
  }

  let packageWeight = minWeight;

  if (packageDimensions) {
    const { length, width, height } = packageDimensions;
    let { unit } = packageDimensions;
    //TODO: Check whether these are numbers or something else
    if (!unit || unit.length < 1) {
      ThrowError("Unit is required", 400);
    } else if (!["cm", "in"].includes(unit.toLowerCase().trim())) {
      ThrowError("Invalid unit value. Valid values are 'cm' and 'in' ", 400);
    } else if (!length) {
      ThrowError("Length required", 400);
    } else if (!width) {
      ThrowError("width required", 400);
    } else if (!height) {
      ThrowError("Height required", 400);
    }

    unit = unit.toLowerCase().trim();
    if (unit) {
      if (unit == "cm") {
        packageWeight = (length * width * height) / 5000;
      } else if (unit == "in") {
        packageWeight = (length * width * height) / 139;
      }
    }
  }

  //TODO: What is the lowest limit? and what will happen when exact weight >0 but due to package dimesions, the volumetric weight is 0
  if (packageWeight == 0) {
    ThrowError("Package Weight is zero", 400);
  }

  if (!productHSCode || productHSCode.length < 1) {
    ThrowError("Product HS code required to calculate customs", 400);
  } else if (!RegExp(/^[0-9\.]{7}$/).test(productHSCode)) {
    ThrowError("Invalid Product HS code provided", 400);
  }

  let senderCountry = await AddressModel.findOne({ _id: pickUpAddr }).populate({
    path: "postalCode",
    select: "code",
    populate: {
      path: "city",
      select: "name",
      populate: {
        path: "state",
        select: "name",
        populate: { path: "country", select: "_id" },
      },
    },
  });

  let receiverCountry = await AddressModel.findOne({
    _id: destinationAddr,
  }).populate({
    path: "postalCode",
    select: "code",
    populate: {
      path: "city",
      select: "name",
      populate: {
        path: "state",
        select: "name",
        populate: { path: "country", select: "_id" },
      },
    },
  });

  senderCountry = senderCountry.postalCode?.city?.state?.country?._id;
  receiverCountry = receiverCountry.postalCode?.city?.state?.country?._id;
  if (!senderCountry) {
    ThrowError("Couldn't determine the sender's country", 400);
  }
  if (!receiverCountry) {
    ThrowError("Couldn't determine the receiver's country", 400);
  }

  let ratePerKg;
  if (!exactWeight) {
    ratePerKg = await DeliveryRatesModel.findOne({
      senderCountry: senderCountry,
      receiverCountry: receiverCountry,
      minWeight: minWeight,
      maxWeight: maxWeight,
    }).select("ratePerKg");
  } else {
    //NOTE: BUSINESS LOGIC Take the higher weight between the volumetric weight and the exact weight
    packageWeight = packageWeight > exactWeight ? packageWeight : exactWeight;
    ratePerKg = await DeliveryRatesModel.findOne({
      senderCountry: senderCountry,
      receiverCountry: receiverCountry,
      minWeight: { $lte: exactWeight },
      maxWeight: { $gte: exactWeight },
    }).select("ratePerKg");
  }

  if (!ratePerKg) {
    ThrowError("Weight prices could not be found in the database", 500);
  }

  let shippingCost = 0;

  shippingCost = ratePerKg.ratePerKg?.amount * packageWeight;

  //TODO: fetch customs cost based on product HS code. Need to determine product HS code.

  const customs = await TaxesModel.find({
    senderCountry: senderCountry,
    receiverCountry: receiverCountry,
    name: { $eq: "customs" },
    productHSCode: productHSCode,
  }).sort({ priority: 1 });

  const taxes = await TaxesModel.find({
    senderCountry: senderCountry,
    receiverCountry: receiverCountry,
    name: { $ne: "customs" },
  }).sort({ priority: 1 });

  //TODO:This is a madeup number.Review this and decide whether to keep it or remove it
  const expressMultiplier = 1.2;

  //NOTE:Apply customs first because other taxes are applied after applying customs
  const surfaceCost = calculateShippingCost({
    taxes: customs,
    shippingCost: shippingCost,
    forCustoms: true,
  });

  const expressCost = calculateShippingCost({
    taxes: customs,
    shippingCost: shippingCost * expressMultiplier,
    forCustoms: true,
  });

  //NOTE:Apply other taxes
  surfaceCost.push(
    ...calculateShippingCost({
      taxes: taxes,
      shippingCost: parseFloat(surfaceCost[surfaceCost.length - 1].amount),
    }),
  );

  expressCost.push(
    ...calculateShippingCost({
      taxes: taxes,
      shippingCost: parseFloat(expressCost[expressCost.length - 1].amount),
    }),
  );

  return res.status(200).json({
    status: true,
    surface: surfaceCost,
    express: expressCost,
  });
});

const placeOrder = asyncHandler(async (req, res) => {
  const {
    orderType,
    pickUpAddr,
    destinationAddr,
    packageType,
    weightClass,
    weightValue,
    length,
    width,
    height,
    packageContents,
    packageValue,
    pickUpDay,
    deliveryType,
    amount,
    razorpayOrderId,
    razorpaySignature,
    razorpayPaymentId,
    paymentType,
  } = req.body;

  const userId = req.user._id;
  const user = await User.findById(userId);
  if (!user) {
    ThrowError("No user found", 404);
  }

  if (!orderType || orderType.length < 1) {
    ThrowError("Order type required", 400);
  } else if (
    !["international", "domestic"].includes(orderType.toLowerCase().trim())
  ) {
    ThrowError("Invalid order type", 400);
  } else if (!pickUpAddr || pickUpAddr.length < 1) {
    ThrowError("Pick up address required", 400);
  } else if (!isObjectIdValid(pickUpAddr)) {
    ThrowError("Invalid value", 400);
  } else if (!destinationAddr || pickUpAddr.length < 1) {
    ThrowError("Destination address required", 400);
  } else if (!isObjectIdValid(destinationAddr)) {
    ThrowError("Invalid value", 400);
  } else if (!packageType || packageType.length < 1) {
    ThrowError("Package type required", 400);
  } else if (!weightClass || weightClass.length < 1) {
    ThrowError("Weight class required", 400);
  } else if (!weightValue || weightValue.length < 1) {
    ThrowError("Weight value required", 400);
  } else if (weightClass.toLowerCase().trim() == "l") {
    if (!length && length.length < 1) {
      ThrowError("Length value required", 400);
    } else if (!decimalRegex.test(length)) {
      ThrowError("Invalid length value", 400);
    } else if (!width && width.length < 1) {
      ThrowError("Width value required", 400);
    } else if (!decimalRegex.test(width)) {
      ThrowError("Invalid width value", 400);
    } else if (!height && height.length < 1) {
      ThrowError("Height value required", 400);
    } else if (!decimalRegex.test(height)) {
      ThrowError("Invalid height value", 400);
    }
  } else if (!packageContents || packageContents.length < 1) {
    ThrowError("Package contents value required", 400);
  } else if (!packageValue || packageValue.length < 1) {
    ThrowError("Package contents value required", 400);
  } else if (!decimalRegex.test(packageValue)) {
    ThrowError("Invalid package value", 400);
  } else if (parseFloat(packageValue) > 50000) {
    ThrowError("Exceeded maximum worth of package that can be shipped", 400);
  } else if (!pickUpDay || pickUpDay.length < 1) {
    ThrowError("Pick up date value required", 400);
  } else if (Date.parse(pickUpDay) < absoluteDate(Date.now())) {
    ThrowError("Invalid pickup date provided", 400);
  } else if (!deliveryType || deliveryType.length < 1) {
    ThrowError("Delivery Type required", 400);
  } else if (
    !["surface", "express"].includes(deliveryType.toLowerCase().trim())
  ) {
    ThrowError("Invalid Delivery Type", 400);
  }
  //todo: any more date validation required??
  else if (!amount || amount.length < 1) {
    ThrowError("Amount required", 400);
  } else if (!decimalRegex.test(amount)) {
    ThrowError("Invalid amount value", 400);
  } else if (!razorpayOrderId || razorpayOrderId.length < 1) {
    ThrowError("Razorpay order id ", 400);
  } else if (!razorpayPaymentId || razorpayPaymentId.length < 1) {
    ThrowError("Razorpay payment id ", 400);
  } else if (!razorpaySignature || razorpaySignature.length < 1) {
    ThrowError("Razorpay signature", 400);
  } else if (!paymentType || paymentType.length < 1) {
    ThrowError("Payment type required", 400);
  }

  //payment validation
  const generated_signature = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
    .update(razorpayOrderId + "|" + razorpayPaymentId)
    .digest("hex");

  if (generated_signature !== razorpaySignature) {
    //todo: uncomment this later
    //ThrowError("Invalid payment signature", 400);
  }

  const newOrder = new PackageModel({
    orderType: orderType,
    sender: pickUpAddr,
    recepient: destinationAddr,
    packageDetails: {
      packageType: packageType,
      packageContent: packageContents,
      weight: weightValue,
      dimensions: {
        length: length,
        width: width,
        height: height,
      },
      packageValue: packageValue,
    },
    delivery: {
      deliveryType: deliveryType.toLowerCase().trim(),
      pickUpDate: pickUpDay,
    },
  });

  const orderInsertResult = await newOrder.save();
  console.log(orderInsertResult);

  if (!orderInsertResult || !orderInsertResult.id) {
    ThrowError("Insert failed", 500);
  } else {
    const newPayment = new PaymentModel({
      amount: amount,
      userId: userId,
      packageId: orderInsertResult.id,
      date: new Date(),
      type: "Card",
      status: "Completed",
      transactionDetails: {
        transactionId: razorpayPaymentId,
        provider: "Razorpay",
        metadata: {
          razorpay_order_id: razorpayOrderId,
          razorpay_signature: razorpaySignature,
        },
      },
    });

    const paymentInsertResult = await newPayment.save();
    if (!paymentInsertResult || !paymentInsertResult.id) {
      Throw("Payment insertion failed", 500);
    } else {
      return res
        .status(200)
        .json({ success: true, message: "Order placed successfully" });
    }
  }
});

function absoluteDate(date) {
  return Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function calculateShippingCost({ taxes, shippingCost, forCustoms = false }) {
  let currentLevelBaseCost = shippingCost;
  let currentLevelTaxes = 0;

  let costBreakdown = [];

  if (forCustoms) {
    costBreakdown.push({
      type: "baseAmt",
      name: "Shipping charges",
      amount: shippingCost.toFixed(2),
    });
  }
  if (taxes.length < 1) {
    return costBreakdown;
  }

  let previousPriority = taxes[0].priority;

  //NOTE: Imagine it as a tree, where each level of the tree is assigned a priority level
  //eg: The taxes with priority 2 are applied to the cost calculated after applying all the taxes at priority level 1
  //Taxes at the same level need to be added
  //Taxes at the same level of priority are applied to the same base cost and then all the taxes are added to get the shipping cost at that level of priority

  taxes.forEach((tax) => {
    if (tax.priority != previousPriority) {
      currentLevelBaseCost += currentLevelTaxes;
      currentLevelTaxes = 0;
      costBreakdown.push({
        type: "baseAmt",
        name: "After Taxes",
        amount: currentLevelBaseCost.toFixed(2),
      });
    }

    let taxAmt = currentLevelBaseCost * (tax.percent / 100);

    currentLevelTaxes += taxAmt;
    previousPriority = tax.priority;

    costBreakdown.push({
      type: "tax",
      name: tax.name,
      percent: tax.percent,
      amount: taxAmt.toFixed(2),
    });
  });

  //Final numbers
  costBreakdown.push({
    type: "baseAmt",
    name: "After taxes",
    amount: (currentLevelBaseCost + currentLevelTaxes).toFixed(2),
  });

  if (!forCustoms) {
    costBreakdown.push({
      type: "baseAmt",
      name: "Grand Total",
      amount: (currentLevelBaseCost + currentLevelTaxes).toFixed(2),
    });
  }

  //console.log(costBreakdown);
  return costBreakdown;
}
module.exports = {
  getLocationFromPincode,
  placeOrder,
  getDeliveryCost,
  addAddress,
  getAddresses,
};
