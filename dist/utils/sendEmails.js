import nodemailer from "nodemailer";
export const sendEmail = async ({ to, subject, html }) => {
    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.EMAIL,
            pass: process.env.PASSWORD,
        },
    });
    const info = await transporter.sendMail({
        from: process.env.EMAIL,
        to,
        subject,
        html,
    });
    if (info.rejected.length > 0)
        return false;
    return true;
};
//# sourceMappingURL=sendEmails.js.map