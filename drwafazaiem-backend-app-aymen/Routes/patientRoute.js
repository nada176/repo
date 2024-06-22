const route = require('express').Router()
const authentificate = require("../middleware/authentificate.js")

const{register,login,validPatient,logout, forgetPass,sendEmail,ansQuest,sendEmailVerification,verifyAccount,deleteToken,findPatientbyEmail,changePassword,hcaptchaRegister}=require("../Controllers/patientController.js")


route.post("/login",login)
route.post("/register",register)
route.get("/validPatient",authentificate,validPatient)
route.get("/logout",authentificate,logout)
route.post("/forgetPassword",forgetPass)
route.post("/sendEmail",sendEmail)
route.post("/sendEmailVerif",sendEmailVerification)
route.post("/postQA",ansQuest)
route.post("/verifAccount",verifyAccount)
route.post("/deleteToken",deleteToken)
route.get("/findPatientByEmail",findPatientbyEmail)
route.post("/changePassword",changePassword)
route.post("/verify-captcha",hcaptchaRegister)




module.exports = route
