//install and require jwt //.env file
const User= require("../models/user-model")
const bcryptjs = require ("bcryptjs")
const jwt=require ("jsonwebtoken")
const { validationResult }= require("express-validator")
const usersCltr = {}

usersCltr.register= async(req,res)=>{
    const errors = validationResult(req)
    if(!errors.isEmpty()){
        return res.status(400).json({ errors: errors.array() })
    }
    try{

        const body= req.body   //es5 feature
         //const {body}=req --destructuring--es6 feature

         const user= new User(body)
         const salt =await bcryptjs.genSalt()
         const encryptedPassword = await bcryptjs.hash(user.password, salt)
         user.password=encryptedPassword
        await user.save()
        res.status(201).json(user)
    }catch(err){
        console.log(err)
        res.status(500).json({error: "Internal Server Error"})
    }

}

//login

usersCltr.login= async(req,res)=>{
    const errors = validationResult(req)
    if(!errors.isEmpty()){
        return res.status(400).json({ errors: errors.array() })
    }
    try{

        const body= req.body   //es5 feature
         //const {body}=req --destructuring--es6 feature

        const user= await User.findOne({ email: body.email })
        if(!user){ //to check if the user with email provided is present in the system
            return res.status(404).json({ error:"invalid email/password" })
        }
        const checkPassword = await bcryptjs.compare(body.password, user.password)
        if(!checkPassword){
            return res.status(404).json({ error: "invalid email/password"})
        }
        const tokenData = {
            id: user._id,
            role: user.role //Q
        }
        const token= jwt.sign(tokenData, process.env.JWT_SECRET,{ expiresIn: '7d'})
        res.json({token:token})
        //res.json(user)

    }catch(err){
        console.log(err)
        res.status(500).json({error: "Internal Server Error"})
    }

}

//account

usersCltr.account=async (req,res)=>{
    try{
        const user=await User.findById(req.user.id).select({password:0})
        res.json(user)

    }catch(err){
        console.log(err)
        res.status(500).json({error: 'Internal server error'})
    }

}

module.exports=usersCltr

