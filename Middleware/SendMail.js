import nodemailer   from "nodemailer"


// create a transporter function 

const transporter=nodemailer.createTransport({
    host:"smtp.gmail.com",
    secure:true,
    auth:{
        user:"mohit.sharma327043@gmail.com",
        pass:"ikqfsyssbrmskjfg"
    }
})




//  welcome mail 
export const SendMail=async(email,text,html)=>{
    try {
        const info= await transporter.sendMail({
            from:"mohit.sharma327043@gmail.com",
            to:email,
            subject:"Hello Welcome To Socialtech",
            text,
            html
        })
    
        console.log(info)
      
    } catch (error) {
        console.log(error)
    }

   
}