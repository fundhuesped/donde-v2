import { createTransport } from 'nodemailer'


export type SendMailProperties = {
  to: string;
  subject: string;
  text: string;
  html: string;
};

export const sendMail = async ({ to, subject, text, html }: SendMailProperties) => {
  try {
    const transporter = createTransport({
      service: 'gmail',
      host: process.env.MAILER_HOST,
      auth: {
        user: process.env.MAILER_USER_EMAIL,
        pass: process.env.MAILER_USER_PASSWORD,
      },
    });

    await transporter.sendMail({
      from: process.env.MAILER_EMAIL,
      to,
      subject,
      text,
      html,
    });

    return true;
  } catch (error) {
    return error;
  }
}
