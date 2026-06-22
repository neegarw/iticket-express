import jwt from "jsonwebtoken";

const SECRET = process.env.JWT_SECRET as string;
const EXPIRES = process.env.JWT_EXPIRES_IN || "7d";

export interface JwtPayload {
  id: number;
  email: string;
}

export const signToken = (payload: JwtPayload): string => {
  return jwt.sign(payload, SECRET, { expiresIn: EXPIRES } as jwt.SignOptions);
};

export const verifyToken = (token: string): JwtPayload => {
  return jwt.verify(token, SECRET) as JwtPayload;
};
