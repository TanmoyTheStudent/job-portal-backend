const User= require("../models/user-model")

const userRegisterSchema ={
    username: {
        notEmpty:{
            errorMessage:"username is required"
        },
        trim:true
    },
    email:{
        notEmpty:{
            errorMessage:"Email is required"
        },
        isEmail:{
            errorMessage:"Email should be in a valid format"
        },
        custom:{
            options: async function(value){
                const user = await User.findOne({email:value})
                if(!user){
                    return true
                } else{
                    throw new Error("Email already exists")
                }
            }
        },
        trim: true,
        normalizeEmail: true
    },
    password:{
        notEmpty:{
            errorMessage:"Password is required"
        },
        isLength:{
            options:{min:8,max:128},
            errorMessage:"Password should be between 8-128 characters"
        }, //isStrongPassword:{},
        trim:true
    },

    role:{
        notEmpty:{
            errorMessage:"Role is required"
        },
        isIn:{
            options:[['candidate','recruiter']],
            errorMessage:'role should either be a candidaate or recruiter'
        }
    }
}

const userLoginSchema= {
    email:{
        notEmpty:{
            errorMessage:"Email is required"
        },
        isEmail:{
            errorMessage:"Email should be in a valid format"
        },
        trim: true,
        normalizeEmail: true
    },
    password:{
        notEmpty:{
            errorMessage:"Password is required"
        },
        isLength:{
            options:{min:8,max:128},
            errorMessage:"Password should be between 8-128 characters"
        },
        trim:true
    }
}

module.exports={
    userRegisterSchema: userRegisterSchema,
    userLoginSchema : userLoginSchema
}