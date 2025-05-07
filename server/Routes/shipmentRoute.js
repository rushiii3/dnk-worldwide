const router = require("express").Router();
const { getLocationFromPincode } = require("../Controllers/shipmentController");
const protect = require("../Middlewares/auth");
router.post("/get-location", protect, getLocationFromPincode);
module.exports = router;
