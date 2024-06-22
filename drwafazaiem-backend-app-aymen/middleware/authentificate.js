const jwt = require("jsonwebtoken");
const Patient = require("../Models/patientModel.js");
require("dotenv").config();
const secretKey = process.env.SECRETKEY;
const authentificate = async (req, res, next) => {
  try {
    const token = req.headers.authorization;
    const verifyToken = jwt.verify(token, secretKey);
    const rootPatient = await Patient.findOne({ _id: verifyToken._id });
    if (!rootPatient) {
      throw new Error("patient not found");
    }
    req.token = token;
    req.rootPatient = rootPatient;
    req.patientId = rootPatient._id;
    next();
  } catch (error) {
    res.status(401).json({status:401,message:"Unauthorized no token provide"})
  }
};

module.exports = authentificate;
