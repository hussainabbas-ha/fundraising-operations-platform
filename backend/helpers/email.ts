import sgMail from "@sendgrid/mail";
import config from "../config/config";
import nodemailer from "nodemailer";
export class EmailHelper {
  sendEmailUsingSendGrid = async (mailOptions) => {
    sgMail.setApiKey(config.SENDGRID_API_KEY);
    const msg = {
      to: mailOptions.to,
      from: mailOptions.from,
      subject: mailOptions.subject,
      html: mailOptions.text,
    };

    if (config.sendEmails) {
      await sgMail.send(msg);
    }

    return { success: true };
  };

  sendEmailUsingSMTP = async () => {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      host: "smtp.example.com",
      port: 587,
      secure: false, // true for 465, false for other ports
      auth: { user: "", pass: "" },
    });
    if (config.sendEmails) {
      await transporter.sendMail({
        from: '"Sender Name" <from@example.net>',
        to: "to@example.com",
        subject: "Hello from node",
        text: "Hello world?",
        html: "<strong>Hello world?</strong>",
        headers: { "x-myheader": "test header" },
      });
    }
    return { success: true };
  };
}
