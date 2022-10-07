const Router = require("express");
const postsController = require("../controllers/postsController");
const authMiddleware = require("../middleware/authMiddleware");
const router = new Router();


router.post("/create", authMiddleware, postsController.createPost);
router.get("/getPosts/:user_id", authMiddleware, postsController.getPosts);
router.get("/getSavedPosts/:user_id", authMiddleware, postsController.getSavedPosts);
router.put("/addComment", authMiddleware, postsController.addComment);
router.post("/liked", authMiddleware, postsController.addPostLike);
router.post("/likedComment", authMiddleware, postsController.addCommentLike);
router.post("/unliked", authMiddleware, postsController.removePostLike);
router.delete("/deletePost/:post_id", authMiddleware, postsController.removePost);

module.exports = router;