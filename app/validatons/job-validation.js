const Job= require("../models/job-model")

const jobValidationSchema ={
    title: {
        notEmpty:{
            errorMessage:"title is required"
        },
        trim:true
    },
    description: {
        notEmpty:{
            errorMessage:"description is required"
        },
        trim:true
    },
    skills: {
       
        // custom:{
        //     options:  function(value){
        //         if(Array.isArray(value) && value.length>0 && value.every(ele => typeof ele!= "string")){
        //             return true
        //         } else{
        //             throw new Error('skills is invalid')
        //         }
        //     }
        // }

        custom:{
            options: function(value){
                if(!Array.isArray(value)){
                    throw new Error("skills should be array")
                } 
                if(value.length == 0){
                    throw new Error("must contain atleast one skill")
                } 
                if(value.every(ele => typeof ele != "string")){
                    throw new Error("skills should be a string")
                } 
                return true
            }
        }
    },
    location: {
        notEmpty:{
            errorMessage:"location is required"
        },
        trim:true
    },
    salary : {
        custom: {
            options: function(value){
                if(typeof value != 'object') {
                    throw new Error('salary should be an object')
                }
                if(Object.keys(value).length != 2) {
                    throw new Error('salary should have 2 fields')
                }
                if(typeof value.min != 'number') {
                    throw new Error('min salary should be a number')
                }
                if(value.min <= 0) {
                    throw new Error("min salary should be greater than 0")
                }
                if(typeof value.max != 'number') {
                    throw new Error('max salary should be a number')
                }
                if(value.max < value.min) {
                    throw new Error("max salary should be greater than min salary")
                }
                return true 
            }
        }
    },
    // 'salary.min' : {
    //     notEmpty: {
    //         errorMessage: 'minimum value is required'
    //     },
    //     isNumeric: {
    //         errorMessage: 'it should be number'
    //     }
    // },
    // 'salary.max' : {
    //     notEmpty: {
    //         errorMessage: 'maximum value is required'
    //     },
    //     isNumeric: {
    //         errorMessage: 'it should be number'
    //     },
    //     custom: {
    //         options: function(value,  { req } ){
    //             if(value < req.body.salary.min) {
    //                 throw new Error('max should be greater than min')
    //             }
    //             return true 
    //         }
    //     }
    // },
    deadline: {
       notEmpty: {
        errorMessage: 'Deadline is required'
       },
       isDate: {
        errorMessage: 'should be a valid date format'
       }, 
       custom: {
        options: function(value){
            if(new Date(value) < new Date()) {
                throw new Error('deadline cannot be less than today')
            }
            return true 
        }
       }
    } // should the greater than today 

}


module.exports= jobValidationSchema

