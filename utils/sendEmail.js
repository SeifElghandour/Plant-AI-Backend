const nodemailer = require('nodemailer');

// Check for email credentials at module load time
if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
  console.error("CRITICAL: EMAIL_USER or EMAIL_PASS is not defined in the environment variables!");
  console.error("Email sending will fail. Please add EMAIL_USER and EMAIL_PASS to your environment variables.");
}

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

function buildOtpEmailHtml(name, otp) {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 520px; margin: 0 auto; color: #1a1a1a;">
      <h2 style="color: #2d8a6b; margin-bottom: 8px;">PlantCare</h2>
      <p>Hello ${name},</p>
      <p>Use the verification code below to complete your PlantCare account setup:</p>
      <div style="background: #f4faf7; border: 2px dashed #2d8a6b; border-radius: 12px; padding: 24px; text-align: center; margin: 24px 0;">
        <span style="font-size: 32px; font-weight: 700; letter-spacing: 8px; color: #2d8a6b;">${otp}</span>
      </div>
      <p style="color: #555;">This code expires in <strong>10 minutes</strong>.</p>
      <p style="color: #888; font-size: 13px;">If you did not create a PlantCare account, you can safely ignore this email.</p>
    </div>
  `;
}

const sendEmail = async (options) => {
  try {
    console.log(`[Email] Attempting to send email to: ${options.email}`);
    
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      throw new Error('EMAIL_USER or EMAIL_PASS is not set in environment variables');
    }

    // Send email using Nodemailer with Gmail SMTP
    console.log('[Email] Sending email via Gmail SMTP...');
    const info = await transporter.sendMail({
      from: `"PlantCare" <${process.env.EMAIL_USER}>`,
      to: options.email,
      subject: options.subject,
      html: options.message,
    });

    console.log(`[Email] ✅ Email sent successfully! Message ID: ${info.messageId}`);
    return info;

  } catch (error) {
    console.error('\n❌ [Email] FAILED to send email:');
    console.error(`- Message: ${error.message}`);
    
    if (error.response) {
      console.error(`- SMTP Response: ${error.response}`);
    }
    
    throw error;
  }
};

module.exports = sendEmail;
module.exports.buildOtpEmailHtml = buildOtpEmailHtml;