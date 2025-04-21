const router = require("express").Router();
const { loginUser } = require("../Controllers/userController");
router.post("/login", loginUser);
module.exports = router;