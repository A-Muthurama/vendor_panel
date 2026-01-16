import SibApiV3Sdk from 'sib-api-v3-sdk';
import dotenv from 'dotenv';
dotenv.config();

const defaultClient = SibApiV3Sdk.ApiClient.instance;
const apiKey = defaultClient.authentications['api-key'];
apiKey.apiKey = process.env.EMAIL_PASS; // Using the same key from .env

const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();

export const sendEmail = async ({ to, subject, html }) => {
    const sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();

    sendSmtpEmail.subject = subject;
    sendSmtpEmail.htmlContent = html;
    sendSmtpEmail.sender = {
        name: "Project J Support",
        email: process.env.EMAIL_USER || "muthuramaa1@gmail.com"
    };
    sendSmtpEmail.to = [{ email: to }];

    try {
        const data = await apiInstance.sendTransacEmail(sendSmtpEmail);
        console.log('Brevo API called successfully. Returned data: ', data);
        return data;
    } catch (error) {
        console.error("Brevo API Error:", error.response?.text || error.message);
        throw error;
    }
};
