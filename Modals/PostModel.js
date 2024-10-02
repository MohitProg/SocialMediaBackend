import mongoose from "mongoose";

const PostSchema = new mongoose.Schema({
    postOwner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user"
    },

    desc: {
        type: String,
        required: true
    },
    files: [
        {
            type: String
        }
    ],
    likes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        

    }],
    comments: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "comments"

    }],
    // tags: [{
    //     type: String
    // }]

}, { timestamps: true })


export default mongoose.model("post", PostSchema);