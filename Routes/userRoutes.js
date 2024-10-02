import {Router} from "express"
import { FollowandFollowinguser, GetAlluser, Getuser, loginUser, LogoutUser, registerUser, Unfollowfollowinguser, Updateuser } from "../Controllers/UserContoller.js";
import { verifyToken } from "../Middleware/VerifyAuth.js";
import {upload} from "../Middleware/Multer.js"

const route=Router()

// auth route 
route.post("/login",loginUser)
route.post("/signup",registerUser)

//  CRUD routes 
route.put("/update",upload.single("avatar"),verifyToken,Updateuser)

//  get user data 
route.get("/getalluser",verifyToken,GetAlluser)
//  get user by id 
route.get("/getuser/:id",verifyToken,Getuser)

//  follower metheod 
route.post("/follow/:id",verifyToken  ,FollowandFollowinguser)
//unfollowmember
route.delete("/unfollow/:id",verifyToken  ,Unfollowfollowinguser)
route.put("/logout",verifyToken  ,LogoutUser)

export default route;