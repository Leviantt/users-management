import { hash, compare } from 'bcrypt';
import {
  Injectable,
  HttpException,
  HttpStatus,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt/dist';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { UsersService } from 'src/users/users.service';
import { User } from 'src/users/users.model';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async login(userDto: CreateUserDto) {
    const user = await this.validateUser(userDto);
    return this.generateToken(user);
  }

  async register(userDto: CreateUserDto) {
    const exists = await this.usersService.getUserByEmail(userDto.email);
    if (exists) {
      throw new HttpException(
        `Пользователь с почтой ${userDto.email} уже существует`,
        HttpStatus.BAD_REQUEST,
      );
    }

    const hashedPassword = await hash(userDto.password, 5);
    const user = await this.usersService.createUser({
      ...userDto,
      password: hashedPassword,
    });
    return this.generateToken(user);
  }

  private async generateToken(user: User) {
    const payload = { email: user.email, id: user.id, roles: user.roles };
    return {
      token: this.jwtService.sign(payload),
    };
  }

  // private async validateUser(userDto: CreateUserDto) {
  //   const user = await this.usersService.getUserByEmail(userDto.email);
  //   const passwordsEqual = await compare(userDto.password, user.password);
  //   if (!passwordsEqual) {
  //     throw new UnauthorizedException({
  //       message: 'Некорректная почта или пароль',
  //     });
  //   }
  //   return user;
  // }
}
