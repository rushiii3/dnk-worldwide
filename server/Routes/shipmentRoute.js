const router = require("express").Router();
const { getLocationFromPincode,placeOrder,addAddress, getDeliveryCost , getAddresses} = require("../Controllers/shipmentController");
const protect = require("../Middlewares/auth");

router.get("/get-location/:pincode", protect, getLocationFromPincode);
router.put("/add-address", protect,addAddress)
router.get("/get-delivery-cost", protect,getDeliveryCost)
router.get("/get-addresses", protect,getAddresses)
router.put("/place-order",protect, placeOrder)

module.exports = router;
