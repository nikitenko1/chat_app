// using Twilio SendGrid's v3 Node.js Library
// https://github.com/sendgrid/sendgrid-nodejs

const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendEmail = async (to, url, text) => {
  // The error exists as the email address in the "from" field in the message(in your nodejs code,,
  // to be sent using sendgrid) is not verified by sendgrid.
  const options = {
    from: process.env.SENDGRID_VERIFY_SINGLE_SENDER, // Change to your verified sender
    to,
    subject: `Let's work | Kyiv - ${text}`,
    html: `
        <div style="border: 5px solid #ccc; padding: 15px;">
          <h1 style="text-align: center;">Let&apos;s work | Kyiv ${text}</h1>
          <p>Please click below button to proceed the chosen action</p>
          <a style="display: block; text-decoration: none; background: orange; color: #fff; width: 130px; height: 35px; text-align: center; line-height: 35px; margin-top: 15px" href=${url}>Click Me</a>
          <div style="margin-top: 20px;">
            <p>Thank you for using <strong>Let&apos;s work | Kyiv</strong> for LMS application"
            <p>Warm Regards,</p>
            <p>- Let&apos;s work | Kyiv Team -</p>
          </div>
        </div>
      `,
  };
  try {
    await sgMail.send(options);
    console.log('Email sent');
  } catch (err) {
    console.log(err.message);
  }
};

module.exports = sendEmail;
