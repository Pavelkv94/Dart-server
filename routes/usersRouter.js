const Router = require("express");
const router = new Router();
const authMiddleware = require("../middleware/authMiddleware");
const usersController = require("../controllers/usersController");


router.get("/", authMiddleware, usersController.getUsers);
router.post("/follow", authMiddleware, usersController.followUsers);
router.post("/unfollow", authMiddleware, usersController.unfollowUsers);


module.exports = router;
