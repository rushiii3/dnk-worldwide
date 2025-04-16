// db.js
const mongoose = require('mongoose');

const uri = process.env.MONGO_URL;
const clientOptions = {
  serverApi: {
    version: '1',
    strict: true,
    deprecationErrors: true,
  },
};

async function connectToMongoDB() {
  try {
    await mongoose.connect(uri, clientOptions);
    await mongoose.connection.db.admin().command({ ping: 1 });
    console.log("✅ Pinged your deployment. Successfully connected to MongoDB!");
  } catch (err) {
    console.error("❌ MongoDB connection error:", err);
    throw err;
  }
}

async function disconnectFromMongoDB() {
  await mongoose.disconnect();
  console.log("🛑 Disconnected from MongoDB");
}

module.exports = {
  connectToMongoDB,
  disconnectFromMongoDB,
};
