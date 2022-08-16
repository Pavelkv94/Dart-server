const UserProfile = require("../models/UserProfile");

class ProfileController {
    async getProfile(req, res) {
        try {
            UserProfile.findOne({ user_id: req.params.user_id }).exec((err, data) => {
                if (err) return res.status(400).json({ err });
                res.json(data);
            });
        } catch (e) {
            console.log(e);
        }
    }
}

module.exports = new ProfileController();
