import jwt, { SignOptions } from "jsonwebtoken";
import { ENV } from "../config/env";
import { AuthUserPayload } from "../types/express";

export class JwtUtils {
  static generateAccessToken(payload: AuthUserPayload): string {
    const options: SignOptions = {
      expiresIn: ENV.JWT_EXPIRES_IN as jwt.SignOptions["expiresIn"],
    };
    return jwt.sign(payload, ENV.JWT_SECRET, options);
  }

  static generateRefreshToken(userId: string): { token: string; expiresAt: Date } {
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7); // 7 days

    const options: SignOptions = {
      expiresIn: ENV.REFRESH_TOKEN_EXPIRES_IN as jwt.SignOptions["expiresIn"],
    };
    const token = jwt.sign({ userId }, ENV.REFRESH_TOKEN_SECRET, options);

    return { token, expiresAt };
  }

  static verifyAccessToken(token: string): AuthUserPayload {
    return jwt.verify(token, ENV.JWT_SECRET) as AuthUserPayload;
  }

  static verifyRefreshToken(token: string): { userId: string } {
    return jwt.verify(token, ENV.REFRESH_TOKEN_SECRET) as { userId: string };
  }
}
