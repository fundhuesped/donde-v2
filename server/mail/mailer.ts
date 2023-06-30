import { createTransport } from 'nodemailer';

export type SendMailProperties = {
  to: string;
  subject: string;
  text: string;
  html: string;
};

export const sendMail = async ({ to, subject, text, html }: SendMailProperties) => {
  const defaultTransport = process.env.MAILER_HOST?.includes('gmail.com')
    ? {
        service: 'gmail',
      }
    : {
        port: 465,
        secure: true,
        tls: {
          // do not fail on invalid certs
          rejectUnauthorized: false,
        },
      };
  try {
    const transporter = createTransport({
      host: process.env.MAILER_HOST,
      auth: {
        user: process.env.MAILER_USER_EMAIL,
        pass: process.env.MAILER_USER_PASSWORD,
      },
      ...defaultTransport,
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
    console.log(error);
    return error;
  }
};
