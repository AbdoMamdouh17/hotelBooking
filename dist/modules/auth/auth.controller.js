import { asyncHandler } from "../../utils/asyncHandler";
import { User } from "../../DB/models/user.model";
import jwt from "jsonwebtoken";
import { sendEmail } from "../../utils/sendEmails";
import { signUpTemplate } from "../../utils/htmlTemplets";
export const register = asyncHandler(async (req, res, next) => {
    const { userName, email, password } = req.body;
    //check if user exists
    const user = await User.findOne({ email });
    if (user)
        return next(new Error("User already exists", { cause: 409 }));
    //generate token
    const accessToken = jwt.sign({ email }, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: "1h",
    });
    //generate refresh token
    const refreshToken = jwt.sign({ email }, process.env.REFRESH_TOKEN_SECRET, {
        expiresIn: "7d",
    });
    //create user
    await User.create({ userName, email, password });
    // send email
    const message = await sendEmail({
        to: email,
        subject: `🎉 Welcome to Our Hotel,`,
        html: signUpTemplate(userName),
    });
    if (!message)
        return next(new Error("something went wrong ", { cause: 400 }));
    return res.json({ success: true, message: "check your email" });
});
//# sourceMappingURL=auth.controller.js.map