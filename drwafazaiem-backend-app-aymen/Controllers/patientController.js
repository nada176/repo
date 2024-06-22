const { response } = require("express");
const Patient = require("../Models/patientModel.js");
const bcrypt = require("bcryptjs");
const nodemailer = require("nodemailer");
// const mongoose = require("mongoose")
require('dotenv').config();
// const hcaptcha = require('@hcaptcha/express');
const { verify } = require("hcaptcha");



module.exports = {
  register: async (req, res) => {
    const { nom, prenom, email,address,phoneNumber, password, confirmPassword } = req.body;

    if (!nom || !address || !phoneNumber || !prenom || !email || !password ) {
      return res.status(422).json({ error: "fill all the details" });
    }
    try {
      const findUser = await Patient.findOne({ email: email });
      if (findUser) {
        return res.status(422).json({ error: "This email is already existed" });
      } else if (password !== confirmPassword) {
        return res
          .status(422)
          .json({ error: "Password and confirm password are not match" });
      } else {
        const finalUser = new Patient({
          nom: nom,
          prenom: prenom,
          address:address,
          phoneNumber:phoneNumber,
          email: email,
          password: password,
         
        });
        const storeData = await finalUser.save();
        console.log(storeData);
        res.status(201).json(storeData);
      }
    } catch (error) {
      return res.status(422).json(error);
    }
  },
  login: async (req, res) => {
    const { email, password, rememberMe } = req.body;

    if (!email || !password) {
      return res
        .status(422)
        .json({ error: "Please provide email and password" });
    }

    try {
      const patientValid = await Patient.findOne({ email });

      if (!patientValid) {
        return res.status(404).json({ error: "Patient not found" });
      }

      // if (!patientValid.isVerified) {
      //   return res
      //     .status(403)
      //     .json({
      //       error: "Account not verified. Please verify your email address",
      //     });
      // }
      if (patientValid.isBlocked || patientValid.isArchived) {
        return res
          .status(403)
          .json({
            error: "Account is blocked or archived",
          });
      }

      const isMatch = await bcrypt.compare(password, patientValid.password);
      if (isMatch && !patientValid.isVerified) {
        return res
          .status(403)
          .json({
            error: "Account not verified. Please verify your email address",
          });
      }
      if (!isMatch) {
        return res.status(422).json({ error: "Invalid email or password" });
      }

      const token = await patientValid.generateAuthToken(rememberMe);
      res.cookie("patientcookie", token, {
        expires: rememberMe ? new Date(Date.now() + 5*30*24*60*60*1000):new Date(Date.now() + 9000000),
        httpOnly: true,
      });

      const result = {
        patientValid,
        token,
      };

      res.status(200).json({ status: 200, result });
    } catch (error) {
      console.error("Error during login:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  },
  validPatient: async (req, res) => {
    try {
      const validPatientOne = await Patient.findOne({ _id: req.patientId });
      res.status(201).json({ status: 201, validPatientOne });
    } catch (error) {
      res.status(401).json({ status: 401, error });
    }
  },
  logout: async (req, res) => {
    try {
      req.rootPatient.tokens = req.rootPatient.tokens.filter((currentElem) => {
        return currentElem.token !== req.token;
      });
      res.clearCookie("patientcookie", { path: "/" });
      req.rootPatient.save();
      res.status(201).json({ status: 201 });
    } catch (error) {
      res.status(401).json({ status: 401, error });
    }
  },
  forgetPass: async (req, res) => {
    const { email, code, questionsAndAnswers } = req.body;
  
    try {
      const patient = await Patient.findOne({ email });
  
      if (!patient) {
        return res.status(404).json({ error: "Patient not found" });
      }
  
      const result = await patient.forgetPassword(code, questionsAndAnswers);
  
      return res.status(result.status).json({ message: result.message });
    } catch (error) {
      console.error("Error during password reset:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  },
  
  sendEmail: async (req, res) => {
    const { recipientEmail } = req.body;
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
      tls: {
        rejectUnauthorized: false,
      },
    });

    try {
      const patient = await Patient.findOne({ email: recipientEmail });

      if (!patient) {
        return res.status(404).json({ error: "Patient not found" });
      }

      if (
        patient.forgotPassword.codeAttempts >= 3 &&
        patient.forgotPassword.lastWrongCodeTrialTime
      ) {
        const oneHourAgo = new Date();
        oneHourAgo.setHours(oneHourAgo.getHours() - 1);
        if (patient.forgotPassword.lastWrongCodeTrialTime <= oneHourAgo) {
          patient.forgotPassword.codeAttempts = 0;
          patient.forgotPassword.lastWrongCodeTrialTime = undefined;
         
          const code = Math.floor(100000 + Math.random() * 900000).toString();
          const codeExpires = new Date(Date.now() + 600000);
          patient.forgotPassword.code = code;
          patient.forgotPassword.codeExpires = codeExpires;
          await patient.save();
          const mailOptions = {
            from: process.env.EMAIL_USER,
            to: recipientEmail,
            subject: "Password Reset Code",
            text: `Your password reset code is: ${code}`,
          };
  
          await transporter.sendMail(mailOptions);
  
          console.log("Email sent successfully");
          return res.status(200).json({ message: "Email sent successfully" });
        }
      }

      if (patient.forgotPassword.codeAttempts < 3) {
        const code = Math.floor(100000 + Math.random() * 900000).toString();
        const codeExpires = new Date(Date.now() + 600000);

        patient.forgotPassword.code = code;
        patient.forgotPassword.codeExpires = codeExpires;
        await patient.save();

        const mailOptions = {
          from: process.env.EMAIL_USER,
          to: recipientEmail,
          subject: "Password Reset Code",
          text: `Your password reset code is: ${code}`,
        };

        await transporter.sendMail(mailOptions);

        console.log("Email sent successfully");
        return res.status(200).json({ message: "Email sent successfully" });
      } else {
        return res
          .status(422)
          .json({
            error:
              "Too many failed attempts. Please try again later or answer security questions.",
          });
      }
    } catch (error) {
      console.error("Error sending email:", error);
      return res.status(500).json({ error: "Failed to send email" });
    }
  },

  ansQuest: async (req, res) => {
    const { email, quest, answ } = req.body;
    try {
      const patientValid = await Patient.findOne({ email: email });
      patientValid.securityQuestions.push({ question: quest, response: answ })
      await patientValid.save();
      res.json(patientValid);
    } catch (error) {
      console.error("Error in ansQuest:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  },
  sendEmailVerification: async (req, res) => {
    const { recipientEmail } = req.body;
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
      tls: {
        rejectUnauthorized: false,
      },
    });

    try {
      const patient = await Patient.findOne({ email: recipientEmail });

      if (!patient) {
        return res.status(404).json({ error: "Patient not found" });
      }

      const code = Math.floor(100000 + Math.random() * 900000).toString();
      const codeExpires = new Date(Date.now() + 600000);

      patient.otpVerification = {
        code: code,
        codeExpires: codeExpires,
      };

      await patient.save();

      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: recipientEmail,
        subject: "OTP Verification Code",
        text: `Your OTP verification code is: ${code}`,
      };

      await transporter.sendMail(mailOptions);

      console.log("Email sent successfully");
      return res.status(200).json({ message: "Email sent successfully" });
    } catch (error) {
      console.error("Error sending email:", error);
      return res.status(500).json({ error: "Failed to send email" });
    }
  },
  verifyAccount: async (req, res) => {
    const { email, otpFromBody } = req.body;

    try {
      const patient = await Patient.findOne({ email });

      if (!patient) {
        return res.status(404).json({ error: "Patient not found" });
      }

      const { otpVerification } = patient;

      if (
        otpVerification &&
        otpVerification.code === otpFromBody &&
        new Date() < otpVerification.codeExpires
      ) {
        patient.isVerified = true;
        await patient.save();

        return res
          .status(200)
          .json({ message: "Account verified successfully" });
      } else {
        return res.status(422).json({ error: "Invalid OTP or OTP expired" });
      }
    } catch (error) {
      console.error("Error verifying account:", error);
      return res.status(500).json({ error: "Failed to verify account" });
    }
  },
  deleteToken: async (req, res) => {
    try {
      const { patientId, tokenToDelete } = req.body;

      if (!patientId || !tokenToDelete) {
        return res
          .status(400)
          .json({
            error:
              "Patient ID or token to delete is missing in the request body",
          });
      }
      
      const patient = await Patient.findById(patientId);

      if (!patient) {
        return res.status(404).json({ error: "Patient not found" });
      }

      patient.tokens = patient.tokens.filter((tokenObj) => {
        return tokenObj.token !== tokenToDelete;
      });

      await patient.save();

      res
        .status(200)
        .json({ status: 200, message: "Token deleted successfully" });
    } catch (error) {
      console.error("Error deleting token:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  },
  findPatientbyEmail:async(req,res)=>{
    const{email}=req.body
    try {
      const findUser = await Patient.findOne({ email: email });
      res.status(200).json(findUser);
    } catch (error) {
      throw new Error(error);
    }
  },
  changePassword: async (req, res) => {
    const { email, newPassword, confirmPassword } = req.body

    try {
      if (!email || !newPassword || !confirmPassword) {
        return res
          .status(400)
          .json({ error: "Please provide email, new password, and confirm password" })
      }

      if (newPassword !== confirmPassword) {
        return res
          .status(422)
          .json({ error: "New password and confirm password do not match" })
      }

      const patient = await Patient.findOne({ email })

      if (!patient) {
        return res.status(404).json({ error: "Patient not found" })
      }

      const isMatch = await bcrypt.compare(newPassword, patient.password)

      if (isMatch) {
        return res.status(400).json({ error: "Please choose a different password" })
      }

      patient.password = newPassword
      await patient.save()

      res.status(200).json({ message: "Password changed successfully" })
    } catch (error) {
      console.error("Error changing password:", error)
      res.status(500).json({ error: "Internal server error" })
    }
  },
  hcaptchaRegister: async (req, res, next) => {
    if (!req.body.token) {
        return res.status(400).json({ error: "Token is missing" });
    }

    try {
        let { success } = await verify(
            process.env.HCAPTCHA_SECRET_KEY,
            req.body.token
        );
        if (success) {
            return res.json({ success: true });
        } else {
            return res.status(400).json({ error: "Invalid Captcha" });
        }
    } catch (e) {
        return res.status(400).json({ error: "Captcha Error. Try again." });
    }
}
  
  
};
