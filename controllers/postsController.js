const { v1 } = require("uuid");
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
    async getPosts(req, res) {
        try {
            const posts = req.params.user_id === "all" ? await Post.find({}) : await Post.find({ user_id: req.params.user_id });
            return res.json(posts);
        } catch (e) {
            console.log(e);
            res.status(500).json({ message: "Server Error with get  posts" });
        }
    }
    async getSavedPosts(req, res) {
        try {
            const savedPosts = await Post.find({ likes: {$all: [req.params.user_id]} });
            return res.json(savedPosts);
        } catch (e) {
            console.log(e);
            res.status(500).json({ message: "Server Error with get saved posts" });
        }
    }
    async addComment(req, res) {
        try {
            const date = new Date();
            await Post.findOneAndUpdate({ _id: req.body.post_id }, { $push: { comments: { ...req.body, created_at: `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`, comment_id: v1() } } });

            return res.json(req.body);
        } catch (e) {
            console.log(e);
            res.status(500).json({ message: "Server Error with add comment" });
        }
    }
    async removePost(req, res) {
        try {
            await Post.findOneAndDelete({_id: req.params.post_id})
            return res.json({message: 'Success'});
        } catch (e) {
            console.log(e);
            res.status(500).json({ message: "Server Error with delete  posts" });
        }
    }
    
    async addPostLike(req, res) {
        try {
            await Post.findOneAndUpdate({ _id: req.body.post_id }, { $push: { likes: req.body.user_id } });

            return res.json(req.body);
        } catch (e) {
            console.log(e);
            res.status(500).json({ message: "Server Error with add Post Like" });
        }
    }

    async removePostLike(req, res) {
        try {
            await Post.findOneAndUpdate({ _id: req.body.post_id }, { $pull: { likes: req.body.user_id } });
            return res.json(req.body);
        } catch (e) {
            console.log(e);
            res.status(500).json({ message: "Server Error with add Like" });
        }
    }

    async addCommentLike(req, res) {
        try {
            await Post.findOne({ _id: req.body.post_id}) //, { $push: { "comments.$.likes": req.body.user_id } });
            return res.json(req.body);
        } catch (e) {
            console.log(e);
            res.status(500).json({ message: "Server Error with add Comment Like" });
        }
    }
}

module.exports = new PostsController();
