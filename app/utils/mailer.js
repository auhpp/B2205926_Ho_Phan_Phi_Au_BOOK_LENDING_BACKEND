import nodemailer from 'nodemailer'

const sendEmail = async (to, subject, htmlContent) => {
    try {
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.MAIL_USERNAME,
                pass: process.env.MAIL_PASSWORD,
            }
        })
        const mailOptions = {
            from: '"Thư viện Phi Âu" <no-reply@thuvien.com>',
            to: to,
            subject: subject,
            html: htmlContent,
        };
        await transporter.sendMail(mailOptions);
        console.log(`Email sent successfully to ${to}`);
    } catch (error) {
        console.error("Email send failed:", error);
    }
}

export default sendEmail;