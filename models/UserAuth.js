const { Schema, model} = require('mongoose');

const UserAuth = new Schema({
    user_id: {type: String, unique: true, required:true},
    email: {type: String, unique: true, required:true},
    password: {type: String, required:true},
    roles: [{type: String, ref: 'Role'}]
});

module.exports = model('UserAuth', UserAuth)