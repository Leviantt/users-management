import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User } from './users.model';
import { CreateUserDto } from './dto/create-user.dto';
import { RolesService } from 'src/roles/roles.service';
import { AddRoleDto } from './dto/add-role.dto';
import { hash, compare } from 'bcrypt';
import { GenerateUserTokenDto } from './dto/generate-user-token.dto';
import { TokensService } from 'src/tokens/tokens.service';
import { Transaction } from 'sequelize';

export type CreateUserOptions = { transaction?: Transaction };

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User) private user: typeof User,
    private roleService: RolesService,
    private tokenService: TokensService,
  ) {}

  async getUserByEmail(email: string) {
    return this.user.findOne({ where: { email }, include: { all: true } });
  }

  // private async validateUser(userDto: CreateUserDto) {
  //   const user = await this.getUserByEmail(userDto.email);
  //   const passwordsEqual = await compare(userDto.password, user.password);
  //   if (!passwordsEqual) {
  //     throw new HttpException(
  //       {
  //         message: 'Invalid email or password',
  //       },
  //       HttpStatus.UNAUTHORIZED,
  //     );
  //   }
  //   return user;
  // }

  async addRole(dto: AddRoleDto) {
    const user = await this.user.findByPk(dto.userId);
    const role = await this.roleService.getRoleByValue(dto.value);
    if (user && role) {
      await user.$add('role', role.id);
      return dto;
    }
    throw new HttpException('User or role is not found', HttpStatus.NOT_FOUND);
  }

  async register(userDto: CreateUserDto, options: CreateUserOptions = {}) {
    const exists = await this.user.findOne({
      where: { email: userDto.email },
    });

    if (exists) {
      throw new HttpException(
        `User with email ${userDto.email} already exists`,
        HttpStatus.BAD_REQUEST,
      );
    }

    const hashedPassword = await hash(userDto.password, 3);

    const user = await this.user.create(
      {
        email: userDto.email,
        password: hashedPassword,
      },
      options,
    );

    const role = await this.roleService.getRoleByValue('USER');
    await user.$set('roles', [role.id]);
    user.roles = [role];

    const generateUserDto = new GenerateUserTokenDto(user);
    const tokens = await this.tokenService.generateTokens({
      ...generateUserDto,
    });
    await this.tokenService.saveRefreshToken(
      generateUserDto.id,
      tokens.refreshToken,
    );

    return { ...tokens, user: generateUserDto };
  }

  async login(userDto: CreateUserDto) {
    const user = await this.user.findOne({
      where: { email: userDto.email },
    });

    if (!user) {
      throw new HttpException(
        `User with email ${userDto.email} doesn't exist`,
        HttpStatus.NOT_FOUND,
      );
    }

    const isPasswordsEqual = await compare(userDto.password, user.password);
    if (!isPasswordsEqual) {
      throw new HttpException('Wrong password', HttpStatus.BAD_REQUEST);
    }

    const generateUserDto = new GenerateUserTokenDto(user);
    const tokens = await this.tokenService.generateTokens({
      ...generateUserDto,
    });
    await this.tokenService.saveRefreshToken(
      generateUserDto.id,
      tokens.refreshToken,
    );

    return { ...tokens, user: generateUserDto };
  }

  async logout(refreshToken: string) {
    const tokenData = await this.tokenService.removeToken(refreshToken);
    return tokenData;
  }

  async refreshToken(refreshToken: string) {
    if (!refreshToken) {
      throw new HttpException('Token is undefined', HttpStatus.UNAUTHORIZED);
    }

    const userData = this.tokenService.validateRefreshToken(refreshToken);
    const tokenFromDB = this.tokenService.findRefreshToken(refreshToken);
    if (!userData || !tokenFromDB) {
      throw new HttpException('Invalid token', HttpStatus.UNAUTHORIZED);
    }

    const user = await this.user.findByPk(userData.id);
    const userDto = new GenerateUserTokenDto(user);
    const tokens = await this.tokenService.generateTokens({ ...userDto });
    await this.tokenService.saveRefreshToken(userDto.id, tokens.refreshToken);

    return { ...tokens, user: userDto };
  }
}
