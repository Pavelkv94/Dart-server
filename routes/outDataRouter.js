const Router = require("express");
const outDataController = require("../controllers/outDataController");
const authMiddleware = require("../middleware/authMiddleware");
const router = new Router();


router.get("/:city_id", authMiddleware, outDataController.getWeather);


module.exports = router;