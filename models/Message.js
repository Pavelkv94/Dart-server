const { Schema, model } = require("mongoose");

const Message = new Schema({
    user_id: { type: String },
    photo: { type: String },
    message: { type: String },
    id: { type: String },
    event: { type: String },
    date: { type: String },
    image: { type: String },
});

module.exports = model("Message", Message);
