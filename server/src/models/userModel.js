const mongoose = require("mongoose");


const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    profileImage: String, // s3 link
    phone: { type: String, required: true, unique: true },
    password: { type: String, required: true, min: 8, max: 15 }, // encrypted password
    city: String,
    fund: { type: Number, default: 0 },
    favorites: [String]
}, { timestamps: true })


module.exports = mongoose.model("User", userSchema)