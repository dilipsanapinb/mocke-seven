const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    name: String,
    bio: String,
    phone: String,
    profilePicture: String,
    email: String,
    password: String
})

const User = mongoose.model("User", userSchema);

module.exports={User}