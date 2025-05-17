const nodemailer = require('nodemailer');

// Create transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// Send verification email
exports.sendVerificationEmail = async (email, token, userId) => {
  const verificationUrl = `${process.env.CLIENT_URL}/verify-email?token=${token}&id=${userId}`;
  
  const mailOptions = {
    from: `"Auth System" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: 'Email Verification',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e9e9e9; border-radius: 5px;">
        <h2 style="color: #333; text-align: center;">Verify Your Email Address</h2>
        <p style="color: #555; font-size: 16px;">Thank you for signing up! Please verify your email address by clicking the button below:</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${verificationUrl}" style="background-color: #4CAF50; color: white; padding: 12px 30px; text-decoration: none; border-radius: 4px; font-weight: bold; display: inline-block;">Verify Email</a>
        </div>
        <p style="color: #555; font-size: 14px;">If the button doesn't work, you can also click on the link below or copy it to your browser:</p>
        <p style="word-break: break-all; color: #3498db; font-size: 14px;"><a href="${verificationUrl}">${verificationUrl}</a></p>
        <p style="color: #777; font-size: 14px; margin-top: 30px; text-align: center;">This link will expire in 24 hours.</p>
      </div>
    `
  };

  return await transporter.sendMail(mailOptions);
};

// Send password reset email
exports.sendPasswordResetEmail = async (email, token, userId) => {
  const resetUrl = `${process.env.CLIENT_URL}/reset-password?token=${token}&id=${userId}`;
  
  const mailOptions = {
    from: `"Auth System" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: 'Password Reset Request',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e9e9e9; border-radius: 5px;">
        <h2 style="color: #333; text-align: center;">Reset Your Password</h2>
        <p style="color: #555; font-size: 16px;">You requested a password reset. Please click the button below to create a new password:</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${resetUrl}" style="background-color: #3498db; color: white; padding: 12px 30px; text-decoration: none; border-radius: 4px; font-weight: bold; display: inline-block;">Reset Password</a>
        </div>
        <p style="color: #555; font-size: 14px;">If the button doesn't work, you can also click on the link below or copy it to your browser:</p>
        <p style="word-break: break-all; color: #3498db; font-size: 14px;"><a href="${resetUrl}">${resetUrl}</a></p>
        <p style="color: #777; font-size: 14px; margin-top: 30px; text-align: center;">This link will expire in 1 hour. If you did not request this reset, please ignore this email.</p>
      </div>
    `
  };

  return await transporter.sendMail(mailOptions);
}; 