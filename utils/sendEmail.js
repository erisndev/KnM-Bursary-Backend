const nodemailer = require("nodemailer");

// Email templates
const emailTemplates = {
  passwordReset: (code, firstName = "") => ({
    subject: "Password Reset Request - KnM Bursary",
    html: `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Password Reset - KnM Bursary</title>
        <style>
          body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f4f4f4;
          }
          .container {
            background: white;
            padding: 30px;
            border-radius: 10px;
            box-shadow: 0 0 20px rgba(0,0,0,0.1);
          }
          .header {
            text-align: center;
            border-bottom: 3px solid #007bff;
            padding-bottom: 20px;
            margin-bottom: 30px;
          }
          .logo {
            font-size: 28px;
            font-weight: bold;
            color: #007bff;
            margin-bottom: 10px;
          }
          .code-container {
            background: #f8f9fa;
            border: 2px dashed #007bff;
            border-radius: 8px;
            padding: 20px;
            text-align: center;
            margin: 25px 0;
          }
          .reset-code {
            font-size: 32px;
            font-weight: bold;
            color: #007bff;
            letter-spacing: 3px;
            font-family: 'Courier New', monospace;
          }
          .warning {
            background: #fff3cd;
            border-left: 4px solid #ffc107;
            padding: 15px;
            margin: 20px 0;
            border-radius: 4px;
          }
          .footer {
            margin-top: 30px;
            padding-top: 20px;
            border-top: 1px solid #eee;
            font-size: 12px;
            color: #666;
            text-align: center;
          }
          .button {
            display: inline-block;
            padding: 12px 24px;
            background-color: #007bff;
            color: white;
            text-decoration: none;
            border-radius: 5px;
            font-weight: bold;
            margin: 10px 0;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div class="logo">KnM Bursary</div>
            <p style="margin: 0; color: #666;">Secure Password Reset</p>
          </div>
          
          <h2 style="color: #333;">Password Reset Request</h2>
          
          <p>Hello${firstName ? ` ${firstName}` : ""},</p>
          
          <p>We received a request to reset your password for your KnM Bursary account. To proceed with resetting your password, please use the verification code below:</p>
          
          <div class="code-container">
            <p style="margin: 0 0 10px 0; font-weight: bold;">Your Verification Code:</p>
            <div class="reset-code">${code}</div>
          </div>
          
          <div class="warning">
            <p style="margin: 0;"><strong>⚠️ Important Security Information:</strong></p>
            <ul style="margin: 10px 0 0 20px;">
              <li>This code will expire in <strong>10 minutes</strong></li>
              <li>Never share this code with anyone</li>
              <li>If you didn't request this reset, please ignore this email</li>
            </ul>
          </div>
          
          <p>If you're having trouble with the reset process, please contact our support team for assistance.</p>
          
          <p>Best regards,<br>
          <strong>The KnM Bursary Team</strong></p>
          
          <div class="footer">
            <p>This is an automated message from KnM Bursary. Please do not reply to this email.</p>
            <p>If you did not request a password reset, you can safely ignore this email.</p>
            <p>&copy; ${new Date().getFullYear()} KnM Bursary. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `,
    text: `
Password Reset Request - KnM Bursary

Hello${firstName ? ` ${firstName}` : ""},

We received a request to reset your password for your KnM Bursary account.

Your verification code is: ${code}

IMPORTANT:
- This code will expire in 10 minutes
- Never share this code with anyone
- If you didn't request this reset, please ignore this email

If you're having trouble, please contact our support team.

Best regards,
The KnM Bursary Team

---
This is an automated message. Please do not reply to this email.
If you did not request a password reset, you can safely ignore this email.
© ${new Date().getFullYear()} KnM Bursary. All rights reserved.
    `,
  }),
};

const sendEmail = async ({ to, subject, text, html }) => {
  const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: {
      name: "KnM Bursary",
      address: process.env.EMAIL_USER,
    },
    to,
    subject,
    text,
    html,
  };

  await transporter.sendMail(mailOptions);
};

module.exports = { sendEmail, emailTemplates };
