// const UserAuth = require("../models/UserAuth");
// const UserProfile = require("../models/UserProfile");

// class ProfileController {
//     async getProfile(req, res) {
//         try {
//             UserProfile.findOne({ user_id: req.params.user_id }).exec((err, data) => {
//                 if (err) return res.status(400).json({ err });
//                 res.json(data);
//             });
//         } catch (e) {
//             console.log(e);
//             res.status(500).json({ message: "Server Error with getProfile" });
//         }
//     }
//     async changeBackground(req, res) {
//         try {
//             const user = await UserAuth.findById(req.user.id);
//             await UserProfile.findOneAndUpdate({ user_id: user.user_id }, { background: req.body.url });

//             return res.json({ image: req.body.url }); //мессадж
//         } catch (e) {
//             console.log(e);
//             res.status(500).json({ message: "Server Error with change background" });
//         }
//     }
//     async editProfile(req, res) {
//         try {
//             const user = await UserAuth.findById(req.user.id);
//             await UserProfile.findOneAndUpdate(
//                 { user_id: user.user_id },
//                 {
//                     first_name: req.body.first_name,
//                     last_name: req.body.last_name,
//                     gender: req.body.gender,
//                     birthday: req.body.birthday,
//                     country: req.body.country,
//                     education: req.body.education,
//                     work: req.body.work,
//                     about: req.body.about,
//                     contacts: req.body.contacts,
//                 }
//             );

//             return res.json({ user_id: req.body.user_id }); //мессадж
//         } catch (e) {
//             console.log(e);
//             res.status(500).json({ message: "Server Error with edit profile" });
//         }
//     }
// }

// module.exports = new ProfileController();
