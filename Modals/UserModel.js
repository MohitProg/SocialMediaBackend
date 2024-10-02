import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true

    },
    avatar: {
        type: String,
        default:""

    },
    desc: {
        type: String,
        default:"Welcome to Socialhub"


    },
    password: {
        type: String,
        required: true,

    },
    dateofBirth: {
        type: String
    },
    followers: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "user"
    }],
    Following: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "user"
    }],
    post: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "post"
    }],
    savedPost: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "post"
    }],
    interest: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "tags"
    }],
    token: {
        type: String,
       

    }
}, { timestamps: true });

export default mongoose.model("user", userSchema)
