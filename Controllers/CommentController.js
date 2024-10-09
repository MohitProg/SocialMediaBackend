import CommentModel from "../Modals/Commentmodal.js";
import PostModel from "../Modals/PostModel.js";

export const Createcomment = async (req, res, next) => {
  console.log(req.body);
  const postId = req.params.id;
  const senderId = req.authdata.id;
  try {
    const { message } = req.body;
    if (!message) {
      const err = new Error(" please fill required field");
      err.status = 400;
      err.success = false;

      return next(err);
    }

    const CreateComment = new CommentModel({
      postId,
      text: message,
      senderId,
    });

    (await CreateComment.save()).populate(["senderId"]);

    const comment = await CommentModel.populate(CreateComment, {
      path: "senderId",
    });

    await PostModel.findByIdAndUpdate(
      { _id: postId },
      {
        $push: {
          comments: comment._id,
        },
      }
    );
    return res.send({
      success: true,
      comment,
      message: "comment added successfully",
    });
  } catch (error) {
    console.log(error);

    return next(error);
  }
};


//  method to like comment 

// const CommentLike= async (req,res,next)=>{
//   const commentid=req.params.id;
//   const userid=req.authdata.id;
//   try {
//     const updatecomment=await CommentModel.findByIdAndUpdate({_id:commentid},{
//       $push
//     })
//   } catch (error) {
//     next(error)
//   }
// }
//  replie on a comment means - comment on the comment

export const Updatecomment = (req, res) => {};

export const DeleteComment = async (req, res, next) => {
  const commentid = req.params.id;
  const userId = req.authdata.id;

  try {
    const deletecomment = await CommentModel.findByIdAndDelete({
      _id: commentid,
    });

    const deletecommentpost = await PostModel.findOneAndUpdate(
      { comments: commentid },
      {
        $pull: {
          comments: deletecomment._id,
        },
      }
    );


    return res.send({
      success: true,
      deletecomment,
      message: "comment delete successfully",
    });
  } catch (error) {
    console.log(error);
    return next(error);
  }
};

export const Getcomments = async (req, res, next) => {
  const postId = req.params.id;
  const userId = req.authdata.id;

  try {
    const commentdata = await CommentModel.find({ postId })
      .sort({ createdAt: -1 })
      .populate(["senderId"]);
    return res.send({
      success: true,
      commentdata,
      message: "comment data successfully",
    });
  } catch (error) {
    console.log(error);
    return next(error);
  }
};
