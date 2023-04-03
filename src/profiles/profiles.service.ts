import { Injectable } from '@nestjs/common';
import { CreateProfileDto } from './dto/create-profile.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { UsersService } from 'src/users/users.service';
import { InjectModel } from '@nestjs/sequelize';
import { Profile } from './profiles.model';
import { CreateUserDto } from 'src/users/dto/create-user.dto';

@Injectable()
export class ProfilesService {
  constructor(
    @InjectModel(Profile) private profile: typeof Profile,
    private usersService: UsersService,
  ) {}

  async create(createProfileDto: CreateProfileDto) {
    const userInfo = await this.usersService.register({
      email: createProfileDto.email,
      password: createProfileDto.password,
    });

    const profile = await this.profile.create({
      firstName: createProfileDto.firstName,
      lastName: createProfileDto.lastName,
      phone: createProfileDto.phone,
      userId: userInfo.user.id,
    });
    return profile;
  }

  login(userDto: CreateUserDto) {
    return this.usersService.login(userDto);
  }

  logout(cookies) {
    const { refreshToken } = cookies;
    return this.usersService.logout(refreshToken);
  }

  refreshToken(cookies) {
    const { refreshToken } = cookies;
    return this.usersService.refreshToken(refreshToken);
  }

  findAll() {
    return this.profile.findAll();
  }

  findOne(id: number) {
    return this.profile.findByPk(id);
  }

  async update(id: number, updateProfileDto: UpdateProfileDto) {
    const profile = await this.profile.findByPk(id);
    const { firstName, lastName, phone } = updateProfileDto;

    if (firstName.trim()) {
      profile.firstName = firstName;
    }

    if (lastName.trim()) {
      profile.lastName = lastName;
    }

    if (phone.trim()) {
      profile.phone = phone;
    }
    await profile.save();
    return profile;
  }

  remove(id: number) {
    return this.profile.destroy({ where: { id } });
  }
}
