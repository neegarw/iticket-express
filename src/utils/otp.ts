import crypto from "crypto";

/**
 * Generates a 6-digit numeric OTP
 */
export const generateOTP = (): string => {
  return crypto.randomInt(100000, 999999).toString();
};

/**
 * Returns the expiry Date object (default: 10 minutes from now)
 */
export const otpExpiry = (minutes = Number(process.env.OTP_EXPIRES_MINUTES) || 10): Date => {
  return new Date(Date.now() + minutes * 60 * 1000);
};

/**
 * Checks whether an OTP has expired
 */
export const isOtpExpired = (expiresAt: Date): boolean => {
  return new Date() > expiresAt;
};
