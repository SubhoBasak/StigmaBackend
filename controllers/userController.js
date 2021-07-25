import userModel from "../models/userModel.js";
import nodemailer from "nodemailer";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

var transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: "subhoapi@gmail.com",
    pass: process.env.EMAIL_PSWD,
  },
});

/**
 * @api /user/register
 * @method POST
 * @param {Content-Type} req headers
 * @param {name, email, password} req body
 * @returns 200, 409, 500
 */
export const registerUser = async (req, res) => {
  try {
    var user = await userModel.findOne({ email: req.body.email });
    if (user) {
      return res.sendStatus(409);
    }

    req.body.verified = false;
    req.body.otp = Math.floor(Math.random() * (999999 - 100000) + 100000);
    req.body.expire = new Date();
    req.body.expire.setMinutes(req.body.expire.getMinutes() + 10);

    try {
      await transporter.sendMail({
        from: "subhoapi@gmail.com",
        to: req.body.email,
        subject: "Verify Email",
        text: "Thank you for sign up with us. Your OTP is " + req.body.otp,
      });
    } catch (error) {
      return res.sendStatus(500);
    }

    user = new userModel(req.body);
    await user.save();

    return res.sendStatus(200);
  } catch (error) {
    return res.sendStatus(500);
  }
};

/**
 * @api /user/verify
 * @method POST
 * @param {Content-Type} req headers
 * @param {email, otp} res body
 * @returns 200, 401, 404, 500
 */
export const verifyEmail = async (req, res) => {
  try {
    var user = await userModel.findOne({
      email: req.body.email,
      verified: false,
    });

    // user not found
    if (!user) {
      return res.sendStatus(404);
    }

    // check otp
    if (user.otp === req.body.otp && user.expire > new Date()) {
      user.otp = null;
      user.expire = null;
      user.verified = true;
      await user.save();

      const token = jwt.sign(
        { payLoad: { user: user._id } },
        process.env.AUTH_KEY
      );
      return res.status(200).json({ token });
    }

    // invalid otp
    return res.sendStatus(401);
  } catch (error) {
    return res.sendStatus(500);
  }
};

/**
 * @api /user/login
 * @method POST
 * @param {Content-Type} req headers
 * @param {email, password} req body
 * @returns 200, 401, 500
 */
export const loginUser = async (req, res) => {
  try {
    const user = await userModel.findOne({ email: req.body.email });
    // user doesn't exist
    if (!user || !user.verified) {
      return res.sendStatus(401);
    }

    // password checking
    if (user.password === req.body.password) {
      const token = jwt.sign(
        { payLoad: { user: user._id } },
        process.env.AUTH_KEY
      );
      return res.status(200).json({ token });
    }

    // incorrect password
    return res.sendStatus(401);
  } catch (error) {
    return res.sendStatus(500);
  }
};

/**
 * @api /user/forgot
 * @method POST
 * @param {Content-Type} req headers
 * @param {email} req body
 * @returns 200, 404, 500
 */
export const forgotPassword = async (req, res) => {
  try {
    var user = await userModel.findOne({
      email: req.body.email,
      verified: true,
    });

    // user not found
    if (!user) {
      return res.sendStatus(404);
    }

    user.otp = Math.floor(Math.random() * (999999 - 100000) + 100000);
    user.expire = new Date();
    user.expire.setMinutes(user.expire.getMinutes() + 10);

    try {
      await transporter.sendMail({
        from: "subhoapi@gmail.com",
        to: user.email,
        subject: "Forgot Password",
        text: "Your OTP is " + user.otp,
      });
    } catch (error) {
      return res.sendStatus(500);
    }

    await user.save();

    return res.sendStatus(200);
  } catch (error) {
    res.sendStatus(500);
  }
};

/**
 * @api /user/reset
 * @method POST
 * @param {Content-Type} req headers
 * @param {email, otp, password} req body
 * @returns 200, 401, 404, 500
 */
export const resetPassword = async (req, res) => {
  try {
    var user = await userModel.findOne({
      email: req.body.email,
      otp: req.body.otp,
    });

    if (!user) {
      return res.sendStatus(404);
    }

    // validate informations
    if (user.expire > new Date()) {
      user.otp = null;
      user.expire = null;
      user.password = req.body.password;
      await user.save();

      return res.sendStatus(200);
    }

    // invalid informations
    return res.sendStatus(401);
  } catch (error) {
    return res.sendStatus(500);
  }
};
