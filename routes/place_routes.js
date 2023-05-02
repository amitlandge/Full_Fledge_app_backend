const express = require("express");
const router = express.Router();
const place_controller = require("../Controller/place_controller");
const auth = require("../middleware/auth");
const fileUpload = require("../middleware/fileUpload");

router.get("/user/:userId", place_controller.getPlacesById);
router.get("/:userId", place_controller.getPlacesByUserId);
router.use(auth);
router.post("/", fileUpload.single("image"), place_controller.createPlaces);
router.get("/:placeId/user", place_controller.getPlaceById);
router.put("/:placeId", place_controller.updatePlace);

router.delete("/:placeId", place_controller.deletePlace);
module.exports = router;
