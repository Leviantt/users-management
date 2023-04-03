import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
} from '@nestjs/common';
import { Request } from 'express';

import { ProfilesService } from './profiles.service';
import { CreateProfileDto } from './dto/create-profile.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { UsersService } from 'src/users/users.service';
import { CreateUserDto } from 'src/users/dto/create-user.dto';

@Controller('profiles')
export class ProfilesController {
  constructor(
    private readonly profilesService: ProfilesService,
    private readonly usersService: UsersService,
  ) {}

  @Post('register')
  register(@Body() createProfileDto: CreateProfileDto) {
    return this.profilesService.create(createProfileDto);
  }

  @Post('login')
  login(@Body() userDto: CreateUserDto) {
    return this.profilesService.login(userDto);
  }

  @Post('logout') // Get could be okay too
  logout(@Req() request: Request) {
    return this.profilesService.logout(request.cookies);
  }

  @Get('refresh')
  refreshToken(@Req() request: Request) {
    return this.profilesService.refreshToken(request.cookies);
  }

  @Get()
  getAll() {
    return this.profilesService.findAll();
  }

  @Get(':id')
  getOne(@Param('id') id: string) {
    return this.profilesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateProfileDto: UpdateProfileDto) {
    return this.profilesService.update(+id, updateProfileDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.profilesService.remove(+id);
  }
}
