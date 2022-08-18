const { Schema, model} = require('mongoose');

const Comment = new Schema({
    user: {type: String},
    user_id: {type: String},
    userAvatar: {type:String},
    message: {type: String},
    created_at: { type: String },
    likes: {type: Number}
});

module.exports = model('Comment', Comment)