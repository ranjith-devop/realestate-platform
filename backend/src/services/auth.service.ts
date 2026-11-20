import bcrypt from "bcryptjs";
import { prisma } from "../config/prisma";
import { JwtUtils } from "../utils/jwt.utils";
import { RegisterDto, LoginDto } from "../validators/auth.validator";
import { Role } from "@prisma/client";

export class AuthService {
  static async register(dto: RegisterDto) {
    const existing = await prisma.user.findUnique({
      where: { email: dto.email.toLowerCase() },
    });

    if (existing) {
      throw new Error("A user with this email already exists");
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(dto.password, salt);

    const user = await prisma.user.create({
      data: {
        name: dto.name,
        email: dto.email.toLowerCase(),
        password: hashedPassword,
        phone: dto.phone,
        role: dto.role as Role,
      },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        role: true,
        createdAt: true,
      },
    });

    const accessToken = JwtUtils.generateAccessToken({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    const { token: refreshToken, expiresAt } = JwtUtils.generateRefreshToken(user.id);

    await prisma.refreshToken.create({
      data: {
        token: refreshToken,
        userId: user.id,
        expiresAt,
      },
    });

    return { user, accessToken, refreshToken };
  }

  static async login(dto: LoginDto) {
    const user = await prisma.user.findUnique({
      where: { email: dto.email.toLowerCase() },
    });

    if (!user) {
      throw new Error("Invalid email or password");
    }

    const isMatch = await bcrypt.compare(dto.password, user.password);
    if (!isMatch) {
      throw new Error("Invalid email or password");
    }

    const accessToken = JwtUtils.generateAccessToken({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    const { token: refreshToken, expiresAt } = JwtUtils.generateRefreshToken(user.id);

    // Save refresh token to database for token revocation and device tracking
    await prisma.refreshToken.create({
      data: {
        token: refreshToken,
        userId: user.id,
        expiresAt,
      },
    });

    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        avatar: user.avatar,
        createdAt: user.createdAt,
      },
      accessToken,
      refreshToken,
    };
  }

  static async refreshTokens(incomingRefreshToken: string) {
    // 1. Verify token signature
    let decoded: { userId: string };
    try {
      decoded = JwtUtils.verifyRefreshToken(incomingRefreshToken);
    } catch {
      throw new Error("Invalid or expired refresh token");
    }

    // 2. Verify token exists in database and is not revoked
    const storedToken = await prisma.refreshToken.findUnique({
      where: { token: incomingRefreshToken },
      include: { user: true },
    });

    if (!storedToken || storedToken.revoked || storedToken.expiresAt < new Date()) {
      throw new Error("Refresh token is invalid, expired, or revoked");
    }

    // 3. Token rotation: Revoke used refresh token
    await prisma.refreshToken.update({
      where: { id: storedToken.id },
      data: { revoked: true },
    });

    // 4. Issue new token pair
    const accessToken = JwtUtils.generateAccessToken({
      userId: storedToken.user.id,
      email: storedToken.user.email,
      role: storedToken.user.role,
    });

    const { token: newRefreshToken, expiresAt } = JwtUtils.generateRefreshToken(storedToken.user.id);

    await prisma.refreshToken.create({
      data: {
        token: newRefreshToken,
        userId: storedToken.user.id,
        expiresAt,
      },
    });

    return {
      accessToken,
      refreshToken: newRefreshToken,
    };
  }

  static async logout(refreshToken: string) {
    if (!refreshToken) return;
    await prisma.refreshToken.updateMany({
      where: { token: refreshToken },
      data: { revoked: true },
    });
  }

  static async getCurrentUser(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        role: true,
        avatar: true,
        createdAt: true,
        _count: {
          select: { properties: true },
        },
      },
    });

    if (!user) {
      throw new Error("User not found");
    }

    return user;
  }
}
