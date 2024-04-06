const Job = require('../models/job-model')
const Application = require('../models/application-model') 
const applicationCreateSchema = {
    jobId: {
        in: ['params'],
        isMongoId: {
            errorMessage: 'should be a valid mongodb objectId'
        }
    },
    candidateId: {
        custom: {
            options: async function(value, { req }){
                const application = await Application.findOne({ candidateId: req.user.id, jobId: req.params.jobId  })
                if(application) {
                    throw new Error('you have already applied for the job')
                } else {
                    return true 
                }
            }
        }
    }, 
    coverLetter: {
        in: ['body'],
        notEmpty: {
            errorMessage: 'cover letter should not empty'
        },
        isLength: {
            options: { min: 10, max: 2000}
        }
    },
    applicationDate: {
        in: ['body'], 
        exists: {
            errorMessage: 'application date is required'
        }, 
        notEmpty: {
            errorMessage: 'application date cannot be empty'
        },
        isDate : { 
            errorMessage: 'should be a valid date'
        },
        custom: {
            options: async function(value, { req }) {
                const job = await Job.findById(req.params.jobId)
                if(new Date(value) <= job.deadline) {
                    return true 
                } else {
                    throw new Error("Job has expired")
                }
            }
        }
    }
}

const applicationUpdateSchema = {}

module.exports = {
    applicationCreateSchema,
    applicationUpdateSchema
}