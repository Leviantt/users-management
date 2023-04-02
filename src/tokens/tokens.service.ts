import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class TokensService {
  constructor(private jwtService: JwtService) {}

  async generateTokens(payload) {
    const accessToken = this.jwtService.sign(payload);
    const refreshToken = this.jwtService.sign(payload, {
      secret: process.env.JWT_REFRESH_TOKEN_SECRET,
      expiresIn: '30d',
    });
    return {
      accessToken,
      refreshToken,
    };
  }

  async saveRefreshToken(userId, refreshToken) {
    const token = await Token.findOne({ user: userId });
    if (token) {
      token.refreshToken = refreshToken;
      return token.save();
    }

    const newToken = await Token.create({ user: userId, refreshToken });
    return newToken;
  }

  async removeToken(refreshToken) {
    const tokenData = await Token.deleteOne({ refreshToken });
    return tokenData;
  }

  validateAccessToken(accessToken) {
    try {
      const userData = this.jwtService.verify(accessToken);
      return userData;
    } catch (err) {
      return null;
    }
  }

  validateRefreshToken(refreshToken) {
    try {
      const userData = this.jwtService.verify(refreshToken, {
        secret: process.env.JWT_REFRESH_TOKEN_SECRET,
      });
      return userData;
    } catch (err) {
      return null;
    }
  }

  async findToken(refreshToken) {
    const token = await Token.findOne({ refreshToken });
    return token;
  }
}
