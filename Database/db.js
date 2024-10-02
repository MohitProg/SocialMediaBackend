import mongoose from "mongoose"

export const db=async()=>{
    try {
        const res =await mongoose.connect(process.env.MONGO_URL);
      if(res){
        console.log("database is connected successfully")
      }
    } catch (error) {
        console.log(error);
        return error;
    }






}