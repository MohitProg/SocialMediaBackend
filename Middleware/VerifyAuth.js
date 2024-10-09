import jwt from "jsonwebtoken";
export const verifyToken=async(req,res,next)=>{
    try {
        const token=req.headers["auth-token"];
  
      
        if(!token){
        return res.status(400).send({success:false,message:"provide jwt token please "});

        };

        const authdata= jwt.verify(token,process.env.SECRET_KEY);
        req.authdata = authdata;
        next();

    } catch (error) {
        console.log(error);
        next(error);
   
    }
}

