const Job= require("../models/job-model")
const Application=require('../models/application-model')
const {validationResult}=require("express-validator")
const jobsCltr={}

jobsCltr.create=async (req,res) =>{
    const errors=validationResult(req)
    if(!errors.isEmpty()){
        return res.status(400).json({errors:errors.array()})
    }
    const {body}=req
    try{
        const job= new Job(body)
        job.recruiterId=req.user.id
        await job.save()
        res.status(201).json(job)

    }catch(err){
        console.log(err)
        res.status(500).json({error: "Internal Server error"})
    }
}



jobsCltr.list= async (req,res)=>{
    try{
        const jobs= await Job.find().sort({createdAt:-1})
        res.json(jobs)
    }catch(err){
        console.log(err)
        res.status(500).json({error: "Internal Server error"})
    }
}

jobsCltr.myjobs= async (req,res)=>{
    try{
        const jobs= await Job.find({recruiterId:req.user.id}).sort({createdAt:-1})
        res.json(jobs)
    }catch(err){
        console.log(err)
        res.status(500).json({error: "Internal Server error"})
    }
}

jobsCltr.update= async (req,res) =>{

    const errors=validationResult(req)
    if(!errors.isEmpty()){
        return res.status(400).json({errors:errors.array()})
    }
    const id= req.params.id
    const body=req.body
    try{
        const job=await Job.findOneAndUpdate({ _id:id, recruiterId: req.user.id },body,     {new:true})
        res.json(job)
    }catch(err){
        console.log(err)
        res.status(500).json({error: "Internal Server error"})
    }
}

jobsCltr.delete=async (req,res) =>{
    const id = req.params.id
try{   
    const job= await Job.findOneAndDelete({_id: id, recruiterId: req.user.id})
    res.json(job)
}catch(err){
    console.log(err)
    res.status(500).json({error: "Internal Server error"})
}
}

//show a single job-- public route--anyone can see a specific job details, but if the candidate wants to apply for the job he/she has to login

jobsCltr.show= async (req,res) =>{
    const id =req.params.id
    try{
        const job= await Job.findById(id)
        res.json(job)
    }catch(err){
        console.log(err)
        res.status(500).json({error: "Internal server error"})
        //res.status(500).json(err)
    }
}

//for showing all application under a job that is posted/created-- **application model needs to be importe/required in jobs-controller.js file
jobsCltr.listApplications= async (req,res) =>{
    const id= req.params.id
    try{
    const job = await Job.findOne({_id:id, recruiterId: req.user.id }) //this will ensure us that the same recruiter should see all the applied applications, other recruiter should not see the applications
    if(!job){
        return res.status(404).json({error: "job not found"})
        }
        const applications= await Application.find({ jobId: job._id}) //here we can use "id" also which is coming from req.params, but it's better to use the id coming from database
        res.json(applications)
    }catch(err){
        res.status(500).json({error: "Internal server Error"})
    }

}

module.exports=jobsCltr