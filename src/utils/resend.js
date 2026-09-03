import { Resend } from "resend";
import { RESEND_API_KEY } from "../config/envConfig.js";
import { EMAIL_FROM } from "../config/envConfig.js";
const resend = new Resend(RESEND_API_KEY);

export const sendEmail = async (to, subject, html) => {
    try {
        await resend.emails.send({
            from: EMAIL_FROM,
            to,
            subject,
            html
        });
    } catch (error) {
        console.error("Email sending failed:", error.message);
    }
};