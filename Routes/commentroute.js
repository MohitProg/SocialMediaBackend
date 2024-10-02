import {Router} from "express"
import { Createcomment, DeleteComment, Getcomments, Updatecomment } from "../Controllers/CommentController.js";
import { verifyToken } from "../Middleware/VerifyAuth.js";

const route=Router();

route.post("/crtecmt/:id",verifyToken, Createcomment)
route.delete("/delete/:id",verifyToken,DeleteComment)
route.put("/update/:id",verifyToken,Updatecomment)
//  creating a route for getting comment for specific post data 

route.get("/getcmt/:id",verifyToken,Getcomments)
export default route;