const Router = require("express");
const postsController = require("../controllers/postsController");
const authMiddleware = require("../middleware/authMiddleware");
const router = new Router();


router.post("/create", authMiddleware, postsController.createPost);
router.get("/getMyPosts", authMiddleware, postsController.getMyPosts);
router.put("/addComment", authMiddleware, postsController.addComment);
router.post("/liked", authMiddleware, postsController.addLike);
// router.delete("/like/:post_id", authMiddleware, postsController.removeLike);

module.exports = router;