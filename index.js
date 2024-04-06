//.env file setup
require('dotenv').config()
//1- initial server running with a port
const express=require("express")
const cors=require("cors")
const app=express()
const port=3055

const configureDB=require("./config/db")
configureDB()

app.use(cors())
app.use(express.json())

app.listen(port,()=>{
    console.log("server connected to the port no",port)
})

//2-3 (2)first add api and check postman (3)then validation
const {checkSchema}=require("express-validator") //3

const usersCltr= require("./app/controllers/users-controller") //2
const {userRegisterSchema}=require("./app/validatons/user-validation") //3

app.post('/api/users/register',checkSchema(userRegisterSchema),usersCltr.register)

// //4-login 
const {userLoginSchema}=require("./app/validatons/user-validation") //line no-23
app.post('/api/users/login',checkSchema(userLoginSchema),usersCltr.login)

// //5-account and auth

const {authenticateUser, authorizeUser}=require("./app/middlewares/auth")

app.get('/api/users/account',authenticateUser,usersCltr.account)


// // app.get('/app/jobs',(req,res) =>{
// //     res.send('api to list job postings')
// // })
// // app.post('/api/jobs',authenticateUser,authorizeUser(['recruiter']),(req,res)=>{
// //     res.send('api to create a job postings')
// // })
// // app.post('/api/jobs/apply',authorizeUser(['candidate']),(req,res)=>{
// //     res.send('api to apply for a job')
// // })

// ///6- job related api
const jobsCltr= require("./app/controllers/jobs-controller")
const jobValidationSchema = require('./app/validatons/job-validation')


app.get('/api/jobs',jobsCltr.list)
app.get('/api/jobs/:id',jobsCltr.show) //showing details of a specific job-- public router

app.post('/api/jobs/create',authenticateUser,authorizeUser(['recruiter']),checkSchema(jobValidationSchema),jobsCltr.create)
app.get('/api/jobs/my',authenticateUser,authorizeUser(['recruiter']),jobsCltr.myjobs)
app.put('/api/jobs/update/:id',authenticateUser,authorizeUser(['recruiter']),checkSchema(jobValidationSchema),jobsCltr.update)
app.delete('/api/jobs/delete/:id',authenticateUser,authorizeUser(['recruiter']),jobsCltr.delete)


//7-application related api
const applicationsCltr=require("./app/controllers/applications-controller")
const { applicationCreateSchema } = require('./app/validatons/application-validation-schema')

//apply for a job
app.post("/api/jobs/:jobId/apply",authenticateUser,authorizeUser(['candidate']),checkSchema(applicationCreateSchema),applicationsCltr.create)
//list all jobs applied by a particular candidate
app.get("/api/application/my",authenticateUser,authorizeUser(["candidate"]),applicationsCltr.myApplications)
//all applications for a particular job- the specific recruiter can see all the applications on a job notification
app.get("/api/jobs/:id/applications",authenticateUser,authorizeUser(["recruiter"]),jobsCltr.listApplications) //the controller is written in jobs-controllers as ':id' is related with jobs. We can write in applications-controller as well

// all applications for a particular job 
app.get('/api/jobs/:id/applications', authenticateUser, authorizeUser(['recruiter']), jobsCltr.listApplications)

// remove application 
app.delete('/api/applications/:id', authenticateUser, authorizeUser(['candidate']), applicationsCltr.remove)

// update application 
app.put('/api/applications/:id', authenticateUser, authorizeUser(['recruiter']), applicationsCltr.update)

// see application 
app.get('/api/jobs/:jobId/applications/:id', authenticateUser, authorizeUser(['recruiter', 'candidate']), jobsCtlr.showApplication)
