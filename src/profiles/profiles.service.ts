import { Injectable } from '@nestjs/common';
import { CreateProfileDto } from './dto/create-profile.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { UsersService } from 'src/users/users.service';
import { InjectModel } from '@nestjs/sequelize';
import { Profile } from './profiles.model';

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

    const user = await this.usersService.getUserByEmail(createProfileDto.email);

    const profile = await this.profile.create({
      firstName: createProfileDto.firstName,
      lastName: createProfileDto.lastName,
      user,
    });
    return profile;
  }

  findAll() {
    return `This action returns all profiles`;
  }

  findOne(id: number) {
    return `This action returns a #${id} profile`;
  }

  update(id: number, updateProfileDto: UpdateProfileDto) {
    return `This action updates a #${id} profile`;
  }

  remove(id: number) {
    return `This action removes a #${id} profile`;
  }
}
