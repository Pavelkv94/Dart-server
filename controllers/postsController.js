const Post = require("../models/Post");
const UserAuth = require("../models/UserAuth");

class PostsController {
    async createPost(req, res) {
        try {
            const date = new Date();
            const newPost = new Post({ ...req.body, created_at: `${date.toLocaleDateString()} ${date.toLocaleTimeString()}` });

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

            return res.json(myPosts); //мессадж
        } catch (e) {
            console.log(e);
            res.status(500).json({ message: "Server Error with get my posts" });
        }
    }
    async addComment(req, res) {
        try {
            const date = new Date();
            await Post.findOneAndUpdate({ _id: req.body.post_id }, { $push: { comments: { ...req.body, created_at: `${date.toLocaleDateString()} ${date.toLocaleTimeString()}` } } });

            return res.json(req.body);
        } catch (e) {
            console.log(e);
            res.status(500).json({ message: "Server Error with add comment" });
        }
    }

    async addLike(req, res) {
        try {
            await Post.findOneAndUpdate({ _id: req.body.post_id }, { $push: { likes: req.body.user_id } });

            return res.json(req.body);
        } catch (e) {
            console.log(e);
            res.status(500).json({ message: "Server Error with add Like" });
        }
    }
}

module.exports = new PostsController();
