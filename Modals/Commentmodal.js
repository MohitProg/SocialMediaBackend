import mongoose from "mongoose";

const CommentSchema = new mongoose.Schema(
  {
    postId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "post",
      required:true
    },
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required:true
    },

    message: {
      type: String,
      required: true,
      trim: true,
      minlength: 1
      
      
    },
  },
  { timestamps: true }
);


export default mongoose.model("commnet",CommentSchema)
