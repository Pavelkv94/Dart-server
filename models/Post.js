const { Schema, model} = require('mongoose');

const Post = new Schema({
image: {type: String},
user: {type: String},
user_id: {type: String},
userAvatar: {type:String},
created_at: { type: String },
text: {type: String},
likes: {type: Number},
comments: {type: Array, ref: "Comment"}

});

module.exports = model('Post', Post)