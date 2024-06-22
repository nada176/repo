const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const patientSchema = new mongoose.Schema(
  {
    nom: { type: String, required: true },
    prenom: { type: String, required: true },
    phoneNumber: { type: String, required: false },
    address: { type: String, required: false },
    email: {
      type: String,
      required: true,
      unique: true,
      validate: {
        validator: validator.isEmail,
        message: "Email is not valid",
      },
    },
    password: {
      type: String,
      required: true,
      validate: {
        validator: function (v) {
          return validator.isStrongPassword(v, {
            minLength: 8,
            minLowercase: 1,
            minUppercase: 1,
            minNumbers: 1,
            minSymbols: 1,
          });
        },
        message:
          "Password must contain at least one special character, one lowercase letter, one uppercase letter, one number, and be at least 8 characters long",
      },
    },
    profilePhoto: {
      data: Buffer,
      contentType: String,
    },
    isVerified: { type: Boolean, required: true, default: false },
    isBlocked: { type: Boolean, required: true, default: false },
    isArchived: { type: Boolean, required: true, default: false },
    otpVerification: {
      code: {
        type: String,
      },
      codeExpires: {
        type: Date,
      },
    },
    tokens: [
      {
        token: {
          type: String,
          required: true,
        },
      },
    ],
    securityQuestions: [
      {
        question: {
          type: String,
          required: false,
        },
        response: {
          type: String,
          required: false,
        },
      },
    ],
    forgotPassword: {
      code: {
        type: String,
      },
      codeAttempts: {
        type: Number,
        default: 0,
        min: 0,
        max: 3,
      },
      codeExpires: {
        type: Date,
      },
      lastWrongCodeTrialTime: {
        type: Date,
      },
    },
  },
  { timestamps: true }
);

patientSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 12);
  }
  next();
});

const secretKey = process.env.SECRETKEY;

patientSchema.methods.generateAuthToken = async function (rememberMe) {
  try {
    let expiresIn = rememberMe ? "5M" : "1d";
    let token23 = jwt.sign({ _id: this._id }, secretKey, {
      expiresIn: expiresIn,
    });
    this.tokens = this.tokens.concat({ token: token23 });
    await this.save();
    return token23;
  } catch (error) {
    throw new Error(error);
  }
};

patientSchema.methods.isLockedOut = function () {
  if (
    this.forgotPassword.codeAttempts >= 3 &&
    this.forgotPassword.lastWrongCodeTrialTime
  ) {
    const oneHourAgo = new Date();
    oneHourAgo.setHours(oneHourAgo.getHours() - 1);

    return this.forgotPassword.lastWrongCodeTrialTime > oneHourAgo;
  }

  return false;
};

patientSchema.methods.forgetPassword = async function (
  codeFromBody = "",
  // newPassword,
  questionsAndAnswers = []
) {
  try {
    let result = {
      status: null,
      message: ""
    };

    if (this.isLockedOut()) {
      if (!Array.isArray(questionsAndAnswers) || questionsAndAnswers.length === 0) {
        result.status = 403
        result.message = "Too many failed attempts. Please answer security questions.";
      } else {
        let correctCount = 0
        for (const { question, response } of questionsAndAnswers) {
          const matchingQuestion = this.securityQuestions.find((q) => q.question === question);
          if (matchingQuestion && matchingQuestion.response && matchingQuestion.response === response) {
            correctCount++;
          }
        }

        if (correctCount >= 3) {
          this.forgotPassword.code = undefined;
          this.forgotPassword.codeAttempts = 0;
          this.forgotPassword.codeExpires = undefined;
          await this.save();

          // this.password = newPassword;
          // console.log(newPassword, "forQuestion");
          await this.save();
          result.status = 200; 
          result.message = "You can change your password now.";
        } else {
          result.status = 403
          result.message = "Invalid answers.";
        }
      }
    }

    if (!result.status) {
      if (!this.forgotPassword.code || !this.forgotPassword.codeExpires) {
        result.status = 422
        result.message = "Incorrect code or expired. Please try again.";
      } else if (codeFromBody === this.forgotPassword.code && new Date() < this.forgotPassword.codeExpires) {
        this.forgotPassword.code = undefined;
        this.forgotPassword.codeAttempts = 0;
        this.forgotPassword.codeExpires = undefined;

        // console.log(newPassword, "thisssss");
        // this.password = newPassword;
        await this.save();

        result.status = 200
        result.message = "You can change your password now.";
      } else {
        this.forgotPassword.codeAttempts++;
        this.forgotPassword.lastWrongCodeTrialTime = new Date();

        if (this.forgotPassword.codeAttempts >= 3 && this.forgotPassword.lastWrongCodeTrialTime) {
          const oneHourAgo = new Date();
          oneHourAgo.setHours(oneHourAgo.getHours() - 1);
          if (this.forgotPassword.lastWrongCodeTrialTime <= oneHourAgo) {
            this.forgotPassword.codeAttempts = 0;
            this.forgotPassword.lastWrongCodeTrialTime = undefined;
          }
        }

        await this.save();

        result.status = 422
        result.message = "Incorrect code or expired. Please try again.";
      }
    }

    return result;
  } catch (error) {
    throw new Error(error);
  }
};


const Patient = new mongoose.model("Patient", patientSchema);

module.exports = Patient;
