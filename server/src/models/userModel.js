import { Schema, model } from "mongoose";


const userSchema = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    profileImage: String, // s3 link
    phone: { type: String, required: true, unique: true },
    password: { type: String, required: true, min: 8, max: 15 }, // encrypted password
    city: String,
    fund: { type: Number, default: 0 },
    favorites: [String]
}, { timestamps: true })


export default model("User", userSchema)