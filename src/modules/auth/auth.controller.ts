import { Request, Response, NextFunction } from "express";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { User } from "../../DB/models/user.model.js";
import jwt from "jsonwebtoken";
import { sendEmail } from "../../utils/sendEmails.js";
import { signUpTemplate } from "../../utils/htmlTemplets.js";
import { resetPassTemplate } from "../../utils/htmlTemplets.js";
import nodemailer from "nodemailer";
import bcrypt from "bcryptjs";
import { Token } from "../../DB/models/token.model.js";
import Randomstring from "randomstring";

export const register = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { userName, email, password } = req.body;
    //check if user exists
    const userr = await User.findOne({ email });
    if (userr) return next(new Error("User already exists", { cause: 409 }));
    //generate token
    const accessToken = jwt.sign({ email }, process.env.ACCESS_TOKEN_SECRET!, {
      expiresIn: "1h",
    });
    //generate refresh token
    const refreshToken = jwt.sign(
      { email },
      process.env.REFRESH_TOKEN_SECRET!,
      {
        expiresIn: "7d",
      }
    );
    //create user
    const user = await User.create({ userName, email, password });
    // store refresh token in DB
    await Token.create({ token: refreshToken, user: user._id });

    // send email
    const message = await sendEmail({
      to: email,
      subject: `🎉 Welcome to Our Hotel,`,
      html: signUpTemplate(userName),
    });
    if (!message)
      return next(new Error("something went wrong ", { cause: 400 }));

    return res.json({
      success: true,
      message: "check your email",
      accessToken,
    });
  }
);
//login
export const login = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body;
    //check if user exists
    const user = await User.findOne({ email });
    if (!user)
      return next(new Error("In-valid email or password", { cause: 404 }));
    //check if password is correct
    const match = bcrypt.compareSync(password, user.password);
    if (!match) return next(new Error("In-valid password", { cause: 404 }));
    //generate token
    const accessToken = jwt.sign({ email }, process.env.ACCESS_TOKEN_SECRET!, {
      expiresIn: "1h",
    });
    const refreshToken = jwt.sign(
      { email },
      process.env.REFRESH_TOKEN_SECRET!,
      {
        expiresIn: "7d",
      }
    );

    //const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

    await Token.create({
      token: refreshToken,
      user: user._id,
    });
    // send refresh token in cookie
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      sameSite: "strict",
      //secure: true,
      //path: "/api/auth/refresh", // الكوكي ده يتبعت بس مع الروت ده
    });
    return res.json({
      success: true,
      message: "login successfully",
      accessToken,
    });
  }
);
//send forget code
export const forgetCode = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { email } = req.body;
    //check if user exists
    const user = await User.findOne({ email });
    if (!user) return next(new Error("In-valid email", { cause: 404 }));
    //generate forget code
    const forgetCode = Randomstring.generate({ length: 5, charset: "numeric" });
    //assign forget code to user
    user.forgetCode = forgetCode;
    await user.save();
    //send email
    const message = await sendEmail({
      to: email,
      subject: "Reset Your Password",
      html: resetPassTemplate(forgetCode),
    });
    if (!message)
      return next(new Error("something went wrong ", { cause: 400 }));

    // send response

    return res.json({ success: true, message: "check your email" });
  }
);
//reset password
export const resetPassword = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { email, forgetCode, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return next(new Error("In-valid email", { cause: 404 }));
    const match = user.forgetCode === forgetCode;
    if (!match) return next(new Error("In-valid forget code", { cause: 400 }));
    user.password = password;
    await user.save();
    //find all tokens and invalidate them
    const tokens = await Token.find({ user: user._id });
    await Token.deleteMany({ user: user._id });
    tokens.forEach(async (token) => {
      token.isValid = false;
      await token.save();
    });
    return res.json({ success: true, message: "reset password successfully" });
  }
);
//logout
export const logout = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const refreshToken = req.cookies?.refreshToken;
    if (refreshToken) await Token.findOneAndDelete({ token: refreshToken });
    res.clearCookie("refreshToken", {
      httpOnly: true,
      sameSite: "strict",
      //secure: true,
    });
    return res.json({ success: true, message: "logout successfully" });
  }
);
//refresh token
export const refreshToken = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const refreshToken = req.cookies?.refreshToken;
    if (!refreshToken)
      return next(new Error("In-valid refresh token", { cause: 401 }));

    //check if refresh token is valid
    const token = await Token.findOne({ token: refreshToken, isValid: true });
    if (!token)
      return next(new Error("In-valid refresh token", { cause: 401 }));
    //decode refresh token
    const payload = jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET!
    ) as { email: string };
    // check if user exists
    const user = await User.findOne({ email: payload.email });
    if (!user) return next(new Error("In-valid refresh token", { cause: 401 }));
    //generate new access token
    const accessToken = jwt.sign(
      { email: user.email },
      process.env.ACCESS_TOKEN_SECRET!,
      {
        expiresIn: "30m",
      }
    );
    return res.json({ success: true, accessToken });
  }
);
