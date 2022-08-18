const Router = require("express");
const postsController = require("../controllers/postsController");
const authMiddleware = require("../middleware/authMiddleware");
const router = new Router();


router.post("/create", authMiddleware, postsController.createPost);
router.get("/getMyPosts", authMiddleware, postsController.getMyPosts);

module.exports = router;