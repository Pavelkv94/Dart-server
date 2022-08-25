const Router = require("express");
const messagesController = require("../controllers/messagesController");
const authMiddleware = require("../middleware/authMiddleware");
const router = new Router();


router.get("/get", authMiddleware, messagesController.getMessages);


module.exports = router;