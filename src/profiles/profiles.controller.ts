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
} from '@nestjs/common';
import { Request } from 'express';

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
  register(@Body() createProfileDto: CreateProfileDto) {
    return this.profilesService.create(createProfileDto);
  }

  @Post('login')
  login(@Body() userDto: CreateUserDto) {
    return this.profilesService.login(userDto);
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
