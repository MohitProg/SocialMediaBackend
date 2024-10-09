import mongoose from "mongoose";

const CommentSchema = new mongoose.Schema(
  {
    postId: {
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'Post',
      required: true
    },
    senderId: {
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'user',
      required: true
    },
    text: {
      type: String,
      required: true,
      trim: true
    },
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      }
    ],
    replies: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Comment' // Refers to the Comment model itself for nested replies
      }
    ],
  

  },
  { timestamps: true }
);


export default mongoose.model("Comment",CommentSchema)
