import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User } from './users.model';
import { CreateUserDto } from './dto/create-user.dto';
import { RolesService } from 'src/roles/roles.service';
import { AddRoleDto } from './dto/add-role.dto';
import { hash, compare } from 'bcrypt';
import { GenerateUserTokenDto } from './dto/generate-user-token.dto';
import { TokensService } from 'src/tokens/tokens.service';

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

  async register(createUserDto: CreateUserDto) {
    const exists = await this.user.findOne({
      where: { email: createUserDto.email },
    });

    if (exists) {
      throw new HttpException(
        `User with email ${createUserDto.email} already exists`,
        HttpStatus.BAD_REQUEST,
      );
    }

    const hashedPassword = await hash(createUserDto.password, 3);
    const user = await this.user.create({
      email: createUserDto.email,
      password: hashedPassword,
    });

    const userDto = new GenerateUserTokenDto(user);
    const tokens = await this.tokenService.generateTokens({ ...userDto });
    await this.tokenService.saveRefreshToken(userDto.id, tokens.refreshToken);

    return { ...tokens, user: userDto };
  }

  async login(email, password) {
    const user = await this.user.findOne({ where: { email } });

    if (!user) {
      throw new HttpException(
        `User with email ${email} doesn't exist`,
        HttpStatus.NOT_FOUND,
      );
    }

    const isPasswordsEqual = await compare(password, user.password);
    if (!isPasswordsEqual) {
      throw new HttpException('Wrong password', HttpStatus.BAD_REQUEST);
    }

    const userDto = new GenerateUserTokenDto(user);
    const tokens = await this.tokenService.generateTokens({ ...userDto });
    await this.tokenService.saveRefreshToken(userDto.id, tokens.refreshToken);

    return { ...tokens, user: userDto };
  }

  async logout(refreshToken) {
    const tokenData = await this.tokenService.removeToken(refreshToken);
    return tokenData;
  }

  async refresh(refreshToken) {
    if (!refreshToken) {
      throw new HttpException('Token is undefined', HttpStatus.UNAUTHORIZED);
    }

    const userData = this.tokenService.validateRefreshToken(refreshToken);
    const tokenFromDB = this.tokenService.findRefreshToken(refreshToken);
    if (!userData || !tokenFromDB) {
      throw new HttpException('Token is undefined', HttpStatus.UNAUTHORIZED);
    }

    const user = await this.user.findByPk(userData.id);
    const userDto = new GenerateUserTokenDto(user);
    const tokens = await this.tokenService.generateTokens({ ...userDto });
    await this.tokenService.saveRefreshToken(userDto.id, tokens.refreshToken);

    return { ...tokens, user: userDto };
  }
}
