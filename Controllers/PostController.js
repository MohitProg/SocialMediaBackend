import PostModel from "../Modals/PostModel.js";
import { UploadmutipleimagesonCloudinary } from "../utils/Cloudinary.js";
import userModel from "../Modals/UserModel.js";
import UserModel from "../Modals/UserModel.js";
import { v2 as cloudinary } from "cloudinary";

import { upload } from "../Middleware/Multer.js";
import multer from "multer";

//  create post of user
export const CreatePost = async (req, res) => {
  //  handling file error using multer

  upload.array("files", 4)(req, res, async (err) => {
    if (err instanceof multer.MulterError) {
      return res.send({ success: false, message: err.message });
    } else if (err) {
      return res.send({ success: false, message: err.message });
    }

    const userId = req.authdata.id;
    const { desc } = req.body;

    try {
      if (!desc) {
        return res.send({
          success: false,
          message: "Please Tell someThing about your post",
        });
      }

      if (req.files && req.files !== undefined) {
        const filepatharray = [];
        req.files?.forEach((img) => filepatharray.push(img.path));

        const imglinkarray = await UploadmutipleimagesonCloudinary(
          filepatharray
        );

        const CreatePost = new PostModel({
          postOwner: userId,
          desc,
          files: imglinkarray,
        });

        await CreatePost.save();
        const userupdated = await UserModel.findByIdAndUpdate(
          { _id: userId },
          {
            $addToSet: { post: CreatePost?._id },
          },
          { new: true }
        );
        console.log(userupdated);

        return res.send({
          success: true,
          CreatePost,
          userupdated,
          message: "post uploaded successfully",
        });
      } else {
        const CreatePost = new PostModel({
          postOwner: userId,
          desc,
        });
        await CreatePost.save();
        const userupdated = await UserModel.findByIdAndUpdate(
          { _id: userId },
          {
            $addToSet: { post: CreatePost?._id },
          },
          { new: true }
        );

        return res.send({
          success: true,
          userupdated,
          CreatePost,
          message: "post uploaded Successfully",
        });
      }
    } catch (error) {
      console.log(error, "this is the error");
      return res.send({ success: false, message: "internal Server Error" });
    }
  });
};

//  update post route
export const UpdatePost = async (req, res) => {
  const postid = req.params.id;
  const { desc } = req.body;
  console.log(req.body);

  try {
    if (req.files && req.files !== undefined) {
      const filepatharray = [];
      req.files?.forEach((img) => filepatharray.push(img.path));

      const imglinkarray = await UploadmutipleimagesonCloudinary(filepatharray);

      const Updatepost = await PostModel.findByIdAndUpdate(
        { _id: postid },
        {
          desc,
          files: imglinkarray,
        },
        { new: true }
      );

      return res.send({
        success: true,
        Updatepost,
        message: "post uploaded successfully",
      });
    } else {
      const Updatepost = await PostModel.findByIdAndUpdate(
        { _id: postid },
        {
          desc,
        },
        { new: true }
      );
      console.log(UpdatePost);
      return res.send({
        success: true,
        Updatepost,
        message: "post updated Successfully",
      });
    }
  } catch (error) {
    console.log(error);
    return res.send({ success: false, message: "internal  Error" });
  }
};

//  delete post
export const DeletePost = async (req, res) => {
  const id = req.params.id;
  const userId = req.authdata.id;

  try {
    const postdata = await PostModel.findOne({ _id: id });
    console.log(postdata);

    let publicidobj = [];
    postdata?.files?.forEach((value) => {
      const obj = {};
      obj["type"] = value.includes("video") ? "video" : "image";
      obj["publicid"] = value.split("/").pop().split(".")[0];
      publicidobj.push(obj);
      console.log(value.split("/").pop().split(".")[0]);
    });

    console.log(publicidobj);

    if (publicidobj?.length > 0) {
      publicidobj.forEach(async (value) => {
        console.log(value);
        try {
          if (value?.type === "image") {
            await cloudinary.uploader.destroy(value.publicid, {
              resource_type: "image",
            });
          } else if (value?.type === "video") {
            await cloudinary.uploader.destroy(value.publicid, {
              resource_type: "video",
            });
          }
        } catch (error) {
          console.log(error);
        }
      });

      await PostModel.findByIdAndDelete({ _id: id });
    } else {
      await PostModel.findByIdAndDelete({ _id: id });
    }

    await UserModel.findByIdAndUpdate(
      { _id: userId },
      {
        $pull: {
          post: id,
        },
      },
      { new: true }
    );

    return res.send({ success: true, message: " delete successfully" });
  } catch (error) {
    console.log(error);
    return res.send({ success: false, message: "internal Server Error" });
  }
};

//  get all post of login user
export const GetAllPostofLoginuser = async (req, res) => {
  const id = req.params.id;
  try {
    const userpost = await PostModel.find({ postOwner: id })
      .sort({
        createdAt: -1,
      })
      .populate(["postOwner", "likes"]);

    return res.send({ success: true, userpost });
  } catch (error) {
    console.log(error);
    return res.send({ success: false, message: "internal Server Error" });
  }
};

//  save post of login user
export const SavePostofLoginUser = async (req, res) => {
  const userId = req.authdata.id;
  const id = req.params.id;
  try {
    await userModel.findByIdAndUpdate(
      { _id: userId },
      {
        $pull: {
          savedPost: id,
        },
      },
      { new: true }
    );

    return res.send({ success: true, message: "post saved successfully" });
  } catch (error) {
    console.log(error);
    return res.send({ success: false, message: "internal Server Error" });
  }
};

//  get post for to show a login user  on basis of there interest

export const GetPostforUserInterest = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 6;
  const userId = req.authdata.id;

  try {
    const userdata = await UserModel.findOne({ _id: userId });

    const getpostaccordingtouser = await PostModel.find({
      postOwner: { $in: userdata?.Following },
    })
      .populate(["postOwner", "likes"])
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);
    return res.send({ success: true, getpostaccordingtouser });
  } catch (error) {
    console.log(error);
    return res.send({ success: false, message: "internal server error" });
  }
};

//  like the post
export const LikeDislikePost = async (req, res) => {
  const userId = req.authdata.id;
  const postId = req.params.id;

  try {
    const ckeckliked = await PostModel.findOne({
      _id: postId,
      likes: { $in: userId },
    });
    if (!ckeckliked) {
      const postdata = await PostModel.findByIdAndUpdate(
        { _id: postId },
        {
          $addToSet: { likes: userId },
        },
        { new: true }
      ).populate(["postOwner", "likes"]);
      return res.send({ success: true, postdata, message: "like the post " });
    } else {
      const postdata = await PostModel.findByIdAndUpdate(
        { _id: postId },
        {
          $pull: { likes: userId },
        },
        { new: true }
      ).populate(["postOwner", "likes"]);

      return res.send({
        success: true,
        postdata,
        message: "Dislike the post ",
      });
    }
  } catch (error) {}
};

export const getlistofLikedUser = () => {};
