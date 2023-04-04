import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/sequelize';
import { Token } from './tokens.model';

@Injectable()
export class TokensService {
  constructor(
    private jwtService: JwtService,
    @InjectModel(Token) private token: typeof Token,
  ) {}

  async generateTokens(payload) {
    const accessToken = this.jwtService.sign(payload, {
      secret: process.env.JWT_ACCESS_TOKEN_SECRET,
      expiresIn: '30m',
    });
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
    const token = await this.token.findOne({ where: { userId } });
    if (token) {
      token.refreshToken = refreshToken;
      return token.save();
    }

    const newToken = await this.token.create({ userId, refreshToken });
    return newToken;
  }

  async removeToken(refreshToken) {
    const tokenData = await this.token.destroy({ where: { refreshToken } });
    return tokenData;
  }

  validateAccessToken(accessToken) {
    try {
      const userData = this.jwtService.verify(accessToken, {
        secret: process.env.JWT_ACCESS_TOKEN_SECRET,
      });
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

  async findRefreshToken(refreshToken) {
    const token = await this.token.findOne({ where: { refreshToken } });
    return token;
  }
}
