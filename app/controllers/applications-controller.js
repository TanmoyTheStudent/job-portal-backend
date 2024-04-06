const { validationResult } = require('express-validator')
const _ = require('lodash')
const Application = require('../models/application-model')
const applicationsCltr = {}

applicationsCltr.create = async (req, res) => {
    const errors = validationResult(req) 
    if(!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array()})
    }
    // mass assignment
    const body = _.pick(req.body, ['additionalInfo', 'coverLetter', 'applicationDate'])
    try {
        // const application = await Application.create({...body, candidateId: req.user.id }) 
        const application = new Application(body) 
        application.candidateId = req.user.id 
        application.jobId = req.params.jobId 
        await application.save() 
        res.status(201).json(application) 
    } catch(err) {
        console.log(err) 
        res.status(500).json({ error: 'Internal server error'})
    }
}

//list all jobs applied by candidates
//candidates--can see their all applied applications (current one would be at first place)

applicationsCltr.myApplications= async (req,res) =>{
    try{
        const applications =await Application.find({ candidateId: req.user.id}.sort({applicationDate:-1}))
        res.json(applications)
    }catch(err){
        res.status(500).json({error: "Internal server error"})
    }
}

//remove an application by the candidate, but if the application is viewed by the recruiter then the candidate can not remove it

applicationsCltr.remove= async (req,res)=>{
    const id= req.params.id
    try{
        const application = await Application.findOne({ _id: id,candidateId: req.user.id})
        if(!application){
            return res.status(404).json({error: "job not found"})
            }
        const application2= await Application.findByIdAndDelete({ _id: application.id}) //here we can use "id" also which is coming from req.params, but it's better to use the id coming from database
         res.json(application2)
    }catch(err){
        res.status(500).json({error:"Internal server error"})
    }
}

//status only can be updated by recruiter
applicationsCltr.update= async (req,res)=>{
    const errors=validationResult(req)
    if(!errors.isEmpty()){
        return res.status(400).json({errors:errors.array()})
    }
    const id= req.params.id
    const body = _.pick(req.body, ['status'])
    
    try{
        const application = await Application.findOne({ _id: id,candidateId: req.user.id})
        if(!application){
            return res.status(404).json({error: "job not found"})
            }
        
        const application2= await Application.findByIdAndUpdate({ _id: application.id},body,{new:true}) //here we can use "id" also which is coming from req.params, but it's better to use the id coming from database
        res.json(application2)
    }catch(err){
        res.status(500).json({error:"Internal server error"})
    } 
}

module.exports = applicationsCltr