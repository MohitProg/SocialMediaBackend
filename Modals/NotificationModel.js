import mongoose from "mongoose";

const NotificationSchema = new mongoose.Schema({
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
  },
  message: {
    type: String,
    required: true,
  },
  post: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'post',
  },
  Reciver: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
  },
},{timestamps:true});


export default mongoose.model("notify",NotificationSchema)
