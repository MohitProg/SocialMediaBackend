import bcryptjs from "bcryptjs";
import UserModel from "../Modals/UserModel.js";
import { UploadImageonCloudinary } from "../utils/Cloudinary.js";
import jwt from "jsonwebtoken";
import PostModel from "../Modals/PostModel.js";

export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res
      .status(201)
      .send({ success: false, message: "please fill All the filled" });
  }

  try {
    const existuser = await UserModel.findOne({ email });
    console.log(existuser);

    if (!existuser) {
      return res
        .status(201)
        .send({ success: false, message: "user doesn't exist" });
    }

    const decodepassword = await bcryptjs.compare(
      password,
      existuser?.password
    );
    if (!decodepassword) {
      return res
        .status(201)
        .send({ success: false, message: "please Enter correct password" });
    }

    const token = await jwt.sign(
      {
        id: existuser?.id,
      },
      process.env.SECRET_KEY,
      { expiresIn: "1d" }
    );

    if (!token) {
      return res
        .status(201)
        .send({ success: false, message: "invalid Credentials" });
    }

    let updateduser = await UserModel.findByIdAndUpdate(
      { _id: existuser.id },
      {
        $set: {
          token,
        },
      },
      { new: true }
    ).select("-password").populate(["followers", "Following", "post"]);
    return res.status(201).send({
      success: true,
      updateduser,
      message: "user login successfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ success: false, message: "Server problem" });
  }
};

//Create new account
export const registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res
      .status(201)
      .send({ success: false, message: "please fill All the filled" });
  }

  try {
    const existuser = await UserModel.findOne({ email: email });
    if (existuser) {
      return res
        .status(201)
        .send({ success: false, message: "user already exits" });
    }
    const hashpassword = await bcryptjs.hash(password, 10);
    if (!hashpassword) {
      return res
        .status(201)
        .send({ success: false, message: "user already exits" });
    }

    const newuser = new UserModel({
      name,
      email,
      password: hashpassword,
    });

    await newuser.save();

    if (newuser) {
      return res.status(201).send({
        success: true,
        newuser,
        message: "user registered successfully",
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).send({ success: false, message: "Server problem" });
  }
};

//    update user
export const Updateuser = async (req, res) => {
  const { id } = req.authdata;

  const { name, desc, dateofBirth } = req.body;

  try {
    let updateuser;
    if (req.file && req.file !== undefined) {
      const uploadedimage = await UploadImageonCloudinary(req.file.path);
      updateuser = await UserModel.findByIdAndUpdate(
        { _id: id },
        {
          $set: req.body,
          avatar: uploadedimage,
        },
        { new: true }
      )
        .select(["-password", "-token"])
        .populate(["followers", "Following", "post"]);
      return res.status(200).send({
        success: true,
        updateuser,
        message: "user updated successfully",
      });
    } else {
      updateuser = await UserModel.findByIdAndUpdate(
        { _id: id },
        {
          $set: {
            name,
            desc,
            dateofBirth,
          },
        },
        { new: true }
      )
        .select(["-password", "-token"])
        .populate(["followers", "Following", "post"]);
      return res.status(200).send({
        success: true,
        updateuser,
        message: "user updated successfully",
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(400).send({ success: false, message: error.message });
  }
};

//  get All user which you are not following

export const GetAlluser = async (req, res) => {
  const query = req.query.new;
  const userId = req.authdata.id;

  try {
    //  finding following user of lofin users;
    const followinguser = await UserModel.findOne({ _id: userId });

    const getAlluser = query
      ? await UserModel.find()
          .sort({ _id: -1 })
          .limit(1)
          .select(["-password", "-token"])
      : await UserModel.find({
          _id: { $nin: [...followinguser.Following, userId] },
        })
          .sort({ _id: -1 })
          .limit(10)
          .select(["-password", "-token"]);
    return res.status(200).send({ success: true, getAlluser });
  } catch (error) {
    console.log(error);
    return res
      .status(400)
      .send({ success: false, message: "Internal Server error" });
  }
};

//  get single user  by id reference
export const Getuser = async (req, res) => {
  const id = req.params.id;

  try {
    const getuser = await UserModel.findById(id)
      .select(["-password", "-token"])
      .populate("followers")
      .populate("Following")
      .populate({
        path: "post",
        populate: {
          path: "postOwner",
        },
      });
    return res.status(200).send({ success: true, getuser });
  } catch (error) {
    console.log(error);
    return res
      .status(400)
      .send({ success: false, message: "Internal Server error" });
  }
};

//  method to create follower and following
export const FollowandFollowinguser = async (req, res) => {
  const followinguserId = req.params.id;

  const { id } = req.authdata;

  try {
    const followingUser = await UserModel.findByIdAndUpdate(
      { _id: followinguserId },
      {
        $push: {
          followers: id,
        },
      },
      { new: true }
    ).populate(["Following", "followers", "post"]);

    //  getting post of folling user to store 
    const postoffollowinguserdata=await PostModel.find({postOwner:followingUser?._id}).populate(["postOwner", "likes"]);
    


    const followeruser = await UserModel.findByIdAndUpdate(
      { _id: id },
      {
        $push: {
          Following: followinguserId,
        },
      },
      { new: true }
    ).populate(["Following", "followers", "post"]);

    

    if (followingUser && followeruser) {
      return res.send({
        success: true,
        followeruser,
        followingUser,
        postoffollowinguserdata,
        message: "following user Successfully",
      });
    }
  } catch (error) {
    console.log(error);
    return res.send({ success: false, message: "Internal Server Error" });
  }
};

export const Unfollowfollowinguser = async (req, res) => {
  const unfollowuserId = req.params.id;

  const { id } = req.authdata;
  console.log(id);
  try {
    const updateduserdata = await UserModel.findByIdAndUpdate(
      { _id: id },
      {
        $pull: {
          Following: unfollowuserId,
        },
      },
      { new: true }
    ).populate(["Following", "followers", "post"]);
    const unfollowuserdata = await UserModel.findByIdAndUpdate(
      { _id: unfollowuserId },
      {
        $pull: {
          followers: id,
        },
      },
      { new: true }
    ).populate(["Following", "followers", "post"]);
    const unfollowuserpost= await PostModel.find({postOwner:unfollowuserId})

    return res.send({
      success: true,
      updateduserdata,
      unfollowuserdata,
      unfollowuserpost,
      message: "Unfollow user Successfully",
    });
  } catch (error) {
    console.log(error);
    return res.send({ success: false, message: "Internal Server Error" });
  }
};

//  method to logout user
export const LogoutUser = async (req, res) => {
  const userid = req.authdata.id;
  try {
    await UserModel.findByIdAndUpdate(
      { _id: userid },
      {
        $set: {
          token: "",
        },
      }
    );
    return res.send({ success: true, message: "Logout Successfully" });
  } catch (error) {
    console.log(error);
    return res.send({ success: false, message: "Internal Server Error" });
  }
};
