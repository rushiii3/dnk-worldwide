const router = require("express").Router();
const {
  getLocationFromPincode,
  createOrder,
  addAddress,
  getDeliveryCost,
  getAddresses,
  onPaymentSuccess,
  onPaymentFailure,
} = require("../Controllers/shipmentController");
const protect = require("../Middlewares/auth");

router.get("/get-location/:pincode", protect, getLocationFromPincode);
router.put("/add-address", protect, addAddress);
router.get("/get-delivery-cost", protect, getDeliveryCost);
router.get("/get-addresses", protect, getAddresses);
router.post("/create-order", protect, createOrder);
router.post("/payment-success", protect, onPaymentSuccess);
router.post("/payment-failure", protect, onPaymentFailure);

module.exports = router;
