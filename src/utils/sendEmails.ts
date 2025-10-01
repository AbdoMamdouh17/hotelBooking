import nodemailer from "nodemailer";

type EmailOptions = {
  to: string;
  subject: string;
  html: string;
};

export const sendEmail = async ({ to, subject, html }: EmailOptions) => {
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

  if (info.rejected.length > 0) return false;
  return true;
};
