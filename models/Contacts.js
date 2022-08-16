const { Schema, model } = require("mongoose");

const Contacts = new Schema({
    facebook: { type: String },
    youtube: { type: String },
    vk: { type: String },
    instagram: { type: String },
    linkedin: { type: String },
    twitter: { type: String },
    telegram: { type: String },
});

module.exports = model("Contacts", Contacts);
