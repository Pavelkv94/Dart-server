const Router = require("express");
const postsController = require("../controllers/postsController");
const authMiddleware = require("../middleware/authMiddleware");
const router = new Router();


router.post("/create", authMiddleware, postsController.createPost);
router.get("/getMyPosts", authMiddleware, postsController.getMyPosts);
router.put("/addComment", authMiddleware, postsController.addComment);
router.post("/liked", authMiddleware, postsController.addPostLike);
router.post("/likedComment", authMiddleware, postsController.addCommentLike);
router.post("/unliked", authMiddleware, postsController.removePostLike);

module.exports = router;