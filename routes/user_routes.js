const express = require("express");
const router = express.Router();
const user_controller = require("../Controller/user_controller");
const fileUpload = require("../middleware/fileUpload");
router.get("/", user_controller.getUser);
router.post("/signup", fileUpload.single("image"), user_controller.signup);
router.post("/signin", user_controller.signin);
module.exports = router;
