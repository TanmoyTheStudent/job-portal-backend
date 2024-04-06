const mongoose = require ('mongoose')

const configureDB= async () =>{
    try{
        const db= await mongoose.connect("mongodb://127.0.0.1:27017/job-portal-2023")
        console.log("connected to db")
       // console.log("connected to db",db)
    }catch(err){
        console.log("error connected to DB",err)
    }

}

module.exports=configureDB