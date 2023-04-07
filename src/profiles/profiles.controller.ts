import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  UseGuards,
  Res,
} from '@nestjs/common';
import { Request, Response } from 'express';

import { ProfilesService } from './profiles.service';
import { CreateProfileDto } from './dto/create-profile.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import { Roles } from 'src/auth/roles.decorator';
import { UserOwnerGuard } from 'src/auth/user-owner.guard';
import { RolesGuard } from 'src/auth/roles.guard';

@Controller('profiles')
export class ProfilesController {
  constructor(private readonly profilesService: ProfilesService) {}

  @Post('register')
  async register(
    @Body() createProfileDto: CreateProfileDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    const profileData = await this.profilesService.create(createProfileDto);
    response.cookie('refreshToken', profileData.refreshToken);
    return profileData;
  }

  @Post('login')
  async login(
    @Body() userDto: CreateUserDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    const userData = await this.profilesService.login(userDto);
    response.cookie('refreshToken', userData.refreshToken);
    return userData;
  }

  @UseGuards(AuthGuard)
  @Post('logout')
  logout(@Req() request: Request) {
    return this.profilesService.logout(request.cookies);
  }

  @UseGuards(AuthGuard)
  @Get('refresh')
  refreshToken(@Req() request: Request) {
    return this.profilesService.refreshToken(request.cookies);
  }

  @UseGuards(AuthGuard)
  @Get()
  getAll() {
    return this.profilesService.findAll();
  }

  @UseGuards(AuthGuard)
  @Get(':id')
  getOne(@Param('id') id: string) {
    return this.profilesService.findOne(+id);
  }

  @Roles('ADMIN')
  @UseGuards(AuthGuard, UserOwnerGuard, RolesGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateProfileDto: UpdateProfileDto) {
    return this.profilesService.update(+id, updateProfileDto);
  }

  @Roles('ADMIN')
  @UseGuards(AuthGuard, UserOwnerGuard, RolesGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.profilesService.remove(+id);
  }
}
