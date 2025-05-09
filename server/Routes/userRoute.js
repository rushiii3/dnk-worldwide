const router = require("express").Router();
const { sendOTP, verifyOTP, generateRefreshTokenUser, updateUserInfo, getVerifiedUser } = require("../Controllers/userController");
const protect = require("../Middlewares/auth");
router.post("/send-otp", sendOTP);
router.post("/verify-otp", verifyOTP);
router.post("/refresh-token", generateRefreshTokenUser);
router.get("/verified-user", protect ,getVerifiedUser)
router.patch("/profile-update", protect ,updateUserInfo)
module.exports = router;