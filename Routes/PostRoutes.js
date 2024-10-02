import {Router} from "express"
import {upload} from "../Middleware/Multer.js"
import { verifyToken } from "../Middleware/VerifyAuth.js";
import { CreatePost, DeletePost, GetAllPostofLoginuser, getlistofLikedUser, GetPostforUserInterest, LikeDislikePost, SavePostofLoginUser, UpdatePost } from "../Controllers/PostController.js";

const route=Router();
// create post 
route.post("/createpost",verifyToken,CreatePost);
// Delete post 
route.delete("/deletepost/:id",verifyToken,DeletePost);
// update post 
route.put("/updatepost/:id",verifyToken,UpdatePost);
// get post of login user 
route.get("/userpost/:id",verifyToken,GetAllPostofLoginuser);
//  get post according to user interest 
//  get lost of post on the basis of user interest and there following friend 
route.get("/getpost/interest",verifyToken,GetPostforUserInterest);
//  save post of login user 
route.post("/savepost/:id",verifyToken,SavePostofLoginUser);

//  like the post 
route.post("/likepost/:id",verifyToken,LikeDislikePost);




//  get list of liked usererd 

route.get("/likeduser",verifyToken,getlistofLikedUser)





export default route;