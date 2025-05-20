require("dotenv").config({
  path: require("path").resolve(__dirname, "../.env"),
});
const mongoose = require("mongoose");
const TaxesModel = require("../Models/TaxesModel");
const DeliveryRatesSchema = require("../Models/DeliveryRatesModel");
const CountrySchema = require("../Models/CountryModel");
const { connectToMongoDB, disconnectFromMongoDB } = require("./MongoConnect");

async function insertDeliveryData() {
  await connectToMongoDB();
  let indiaCountryId = await CountrySchema.findOne({ name: "INDIA" }).select(
    "_id",
  );
  let usCountryId = await CountrySchema.findOne({ name: "USA" }).select("_id");
  //let ukCountryId = await CountrySchema.find({name:"UK"});

  console.log(indiaCountryId);
  console.log(usCountryId);

  let deliveryRateData = [
    {
      senderCountry: indiaCountryId,
      receiverCountry: usCountryId,
      ratePerKg: { amount: 4000, currency: "INR" },
      minWeight: 0,
      maxWeight: 0.5,
    },
    {
      senderCountry: indiaCountryId,
      receiverCountry: usCountryId,
      ratePerKg: { amount: 2700, currency: "INR" },
      minWeight: 0.5,
      maxWeight: 1,
    },
    {
      senderCountry: indiaCountryId,
      receiverCountry: usCountryId,
      ratePerKg: { amount: 1750, currency: "INR" },
      minWeight: 1,
      maxWeight: 2,
    },
    {
      senderCountry: indiaCountryId,
      receiverCountry: usCountryId,
      ratePerKg: { amount: 1400, currency: "INR" },
      minWeight: 2,
      maxWeight: 3,
    },
    {
      senderCountry: indiaCountryId,
      receiverCountry: usCountryId,
      ratePerKg: { amount: 1225, currency: "INR" },
      minWeight: 3,
      maxWeight: 4,
    },
    {
      senderCountry: indiaCountryId,
      receiverCountry: usCountryId,
      ratePerKg: { amount: 1120, currency: "INR" },
      minWeight: 4,
      maxWeight: 5,
    },
    {
      senderCountry: indiaCountryId,
      receiverCountry: usCountryId,
      ratePerKg: { amount: 1000, currency: "INR" },
      minWeight: 5,
      maxWeight: 6,
    },
    {
      senderCountry: indiaCountryId,
      receiverCountry: usCountryId,
      ratePerKg: { amount: 915, currency: "INR" },
      minWeight: 6,
      maxWeight: 7,
    },
    {
      senderCountry: indiaCountryId,
      receiverCountry: usCountryId,
      ratePerKg: { amount: 850, currency: "INR" },
      minWeight: 7,
      maxWeight: 8,
    },
    {
      senderCountry: indiaCountryId,
      receiverCountry: usCountryId,
      ratePerKg: { amount: 800, currency: "INR" },
      minWeight: 8,
      maxWeight: 9,
    },
    {
      senderCountry: indiaCountryId,
      receiverCountry: usCountryId,
      ratePerKg: { amount: 770, currency: "INR" },
      minWeight: 9,
      maxWeight: 11,
    },
    {
      senderCountry: indiaCountryId,
      receiverCountry: usCountryId,
      ratePerKg: { amount: 675, currency: "INR" },
      minWeight: 11,
      maxWeight: 20,
    },
    {
      senderCountry: indiaCountryId,
      receiverCountry: usCountryId,
      ratePerKg: { amount: 650, currency: "INR" },
      minWeight: 20,
      maxWeight: 50,
    },
    {
      senderCountry: indiaCountryId,
      receiverCountry: usCountryId,
      ratePerKg: { amount: 600, currency: "INR" },
      minWeight: 50,
      maxWeight: 100,
    },
  ];

  const deleteExisting = await DeliveryRatesSchema.deleteMany({
    senderCountry: indiaCountryId,
    receiverCountry: usCountryId,
  });

  if (deleteExisting && deleteExisting.deletedCount > 0) {
    const insertResult = await DeliveryRatesSchema.insertMany(deliveryRateData);
    //    console.log(insertResult);
  }

  const taxesData = [
    {
      senderCountry: indiaCountryId,
      receiverCountry: usCountryId,
      priority: 0,
      name: "gst",
      percent: 18,
      leviedOn: "sender",
    },
    {
      senderCountry: indiaCountryId,
      receiverCountry: usCountryId,
      priority: 0,
      name: "excise-duty",
      percent: 1,
      leviedOn: "sender",
    },
    {
      senderCountry: indiaCountryId,
      receiverCountry: usCountryId,
      priority: 1,
      name: "gst",
      percent: 5,
      leviedOn: "sender",
    },
    {
      senderCountry: indiaCountryId,
      receiverCountry: usCountryId,
      priority: 1,
      name: "gst",
      percent: 10,
      leviedOn: "sender",
    },
    {
      senderCountry: indiaCountryId,
      receiverCountry: usCountryId,
      priority: 2,
      name: "gst",
      percent: 18,
      leviedOn: "sender",
    },
    {
      senderCountry: indiaCountryId,
      receiverCountry: usCountryId,
      priority: 2,
      name: "gst",
      percent: 20,
      leviedOn: "sender",
    },
  ];

  const taxesDeleteResult = await TaxesModel.deleteMany({
    senderCountry: indiaCountryId,
    receiverCountry: usCountryId,
  });

  if (taxesDeleteResult && taxesDeleteResult.deletedCount >= 0) {
    const taxesInsertResult = await TaxesModel.insertMany(taxesData);
    console.log(taxesInsertResult);
  }
}

insertDeliveryData();
