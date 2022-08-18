const Post = require("../models/Post");
const UserAuth = require("../models/UserAuth");

class PostsController {
    async createPost(req, res) {
        try {
            const newPost = new Post({ ...req.body, created_at: new Date() });

            await newPost.save();

            return res.json(newPost); //мессадж
        } catch (e) {
            console.log(e);
            res.status(500).json({ message: "Server Error with create post" });
        }
    }
    async getMyPosts(req, res) {
        try {
            const user = await UserAuth.findById(req.user.id);
            const myPosts = await Post.find({ user_id: user.user_id });

            console.log(myPosts);

            // UserProfile.findOne({ user_id: req.params.user_id }).exec((err, data) => {
            //     if (err) return res.status(400).json({ err });
            //     res.json(data);
            // });
            return res.json(myPosts); //мессадж
        } catch (e) {
            console.log(e);
            res.status(500).json({ message: "Server Error with get my posts" });
        }
    }
}

module.exports = new PostsController();
