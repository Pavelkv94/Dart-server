const UserAuth = require("../models/UserAuth");
const UserProfile = require("../models/UserProfile");

class UsersController {
    async getUsers(req, res) {
        try {
            UserProfile.find({}).exec((err, data) => {
                if (err) return res.status(400).json({ err });

                let nesData = data.map((el) => ({
                    user_id: el.user_id,
                    email: el.email,
                    _id: el._id,
                    name: `${el.first_name} ${el.last_name}`,
                    photo: el.photo,
                    background: el.background,
                    country: el.country,
                    friends: el.friends,
                }));

                res.json(nesData);
            });
        } catch (e) {
            console.log(e);
            res.status(500).json({ message: "Server Error with get Users" });
        }
    }
    async followUsers(req, res) {
        try {
            await UserProfile.findOneAndUpdate({ user_id: req.body.userFrom }, { $push: { friends: req.body.userTo } });
            await UserProfile.findOneAndUpdate({ user_id: req.body.userTo }, { $push: { friends: req.body.userFrom } });
            res.json({ message: "success" });
        } catch (e) {
            console.log(e);
            res.status(500).json({ message: "Server Error with get Users" });
        }
    }
    async unfollowUsers(req, res) {
        try {
            await UserProfile.updateOne({ user_id: req.body.userFrom }, { $pull: { friends: req.body.userTo } });
            await UserProfile.updateOne({ user_id: req.body.userTo }, { $pull: { friends: req.body.userFrom } });
            res.json({ message: "success" });
        } catch (e) {
            console.log(e);
            res.status(500).json({ message: "Server Error with get Users" });
        }
    }
}

module.exports = new UsersController();
