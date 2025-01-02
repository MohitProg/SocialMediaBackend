import dotenv from "dotenv"
dotenv.config()
import express from "express"
import cookieParser from "cookie-parser"
import { db } from "./Database/db.js"
import UserRoute from "./Routes/userRoutes.js"
import postRoute from "./Routes/PostRoutes.js"
import commentRoute from "./Routes/commentroute.js"

import cors from "cors"
import bodyparser from "body-parser"
import { Errormiddleware } from "./Middleware/ErrorMidleware.js"
const app=express();
const port=process.env.PORT||5000;


app.use(cors({origin:["http://localhost:5173","https://socialmedia-cbf5f.web.app"]}))
app.use(express.static("public"));
app.use(cookieParser());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// routes 
app.use("/api/v1/user",UserRoute);
app.use("/api/v1/post",postRoute);
app.use("/api/v1/post/comment",commentRoute);


//  using error middleware 
app.use(Errormiddleware);

db().then(()=>{
    app.listen(port,()=>{
        console.log(`Server is started at ${port}`)
    })
}).catch((error)=>{
    console.log(error.message)
})

