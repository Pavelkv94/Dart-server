const { Schema, model } = require("mongoose");

const UserProfile = new Schema({
    user_id: { type: String, unique: true, required: true },
    email: { type: String, unique: true, required: true },
    first_name: { type: String },
    last_name: { type: String },
    status: { type: String },
    photo: { type: String },
    background: { type: String },
    country: { type: String },
    birthday: { type: String },
    contacts: { type: Object, ref: "Contacts" },
    about: { type: String },
    created_at: { type: String },
    friends: {type: [String]},
    education: { type: String },
    work:  { type: String },
    gender:  { type: String }
});

module.exports = model("UserProfile", UserProfile);
