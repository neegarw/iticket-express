import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: Number(process.env.EMAIL_PORT) || 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// ─── Send OTP for email verification ───────────────────────────────────────────
export const sendVerificationOTP = async (to: string, otp: string): Promise<void> => {
  await transporter.sendMail({
    from: `"Auth API" <${process.env.EMAIL_USER}>`,
    to,
    subject: "Email Verification - OTP",
    html: `
      <div style="font-family:Arial,sans-serif;max-width:480px;margin:auto">
        <h2>Email Verification</h2>
        <p>Your one-time password (OTP) is:</p>
        <h1 style="letter-spacing:8px;color:#4f46e5">${otp}</h1>
        <p>This code expires in <strong>${process.env.OTP_EXPIRES_MINUTES || 10} minutes</strong>.</p>
        <p style="color:#888;font-size:12px">If you didn't request this, please ignore this email.</p>
      </div>
    `,
  });
};

// ─── Send OTP for password reset ───────────────────────────────────────────────
export const sendPasswordResetOTP = async (to: string, otp: string): Promise<void> => {
  await transporter.sendMail({
    from: `"Auth API" <${process.env.EMAIL_USER}>`,
    to,
    subject: "Password Reset - OTP",
    html: `
      <div style="font-family:Arial,sans-serif;max-width:480px;margin:auto">
        <h2>Password Reset</h2>
        <p>Your password reset OTP is:</p>
        <h1 style="letter-spacing:8px;color:#ef4444">${otp}</h1>
        <p>This code expires in <strong>${process.env.OTP_EXPIRES_MINUTES || 10} minutes</strong>.</p>
        <p style="color:#888;font-size:12px">If you didn't request this, please ignore this email.</p>
      </div>
    `,
  });
};
