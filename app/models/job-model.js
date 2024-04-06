const mongoose= require("mongoose")
const {model,Schema}=mongoose

const jobSchema = new Schema({
    title: String,
    description: String,
    skills:[String],
    location:String,
    salary:{
        min:Number,
        max:Number
    },

    recruiterId: Schema.Types.ObjectId,
    // recruiterID: {
    //     type:Schema.Types.ObjectId,
    //     ref:"User"
    // }  ,
    
    deadline:Date
    
},{timestamps:true})

const Job= model('Job',jobSchema)

module.exports=Job