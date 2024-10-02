import CommentModel from "../Modals/Commentmodal.js";

export const Createcomment = async (req, res) => {
  const postId = req.params.id;
  const senderId = req.authdata.id;
  try {
    const { message } = req.body;
    if (!message) {
      return res.send({ success: true, message: "add some comment" });
    }
    const CreateComment = new CommentModel({
      postId,
      message,
      senderId,
    });
    await CreateComment.save();
    return res.send({ success: true, message: "comment added successfully" });
  } catch (error) {
    console.log(error);
    return res.send({ success: false, message: "internal server error" });
  }
};

export const Updatecomment = (req, res) => {};


export const DeleteComment = async (req, res) => {
  const commentid = req.params.id;
  const userId = req.authdata.id;

  try {
    await CommentModel.findByIdAndDelete({ _id: commentid, senderId: userId });
    return res.send({ success: true, message: "comment delete successfully" });
  } catch (error) {
    console.log(error);
    return res.send({ success: false, message: "internal server error" });
  }
};

export const Getcomments = async(req, res) => {
    const postId = req.params.id;
    const userId = req.authdata.id;
  
    try {
      const commentdata=await CommentModel.find({postId})
      return res.send({ success: true,commentdata, message: "comment delete successfully" });
    } catch (error) {
      console.log(error);
      return res.send({ success: false, message: "internal server error" });
    }

};
