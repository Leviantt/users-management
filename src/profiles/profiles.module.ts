import { Module } from '@nestjs/common';
import { ProfilesService } from './profiles.service';
import { ProfilesController } from './profiles.controller';
import { UsersModule } from 'src/users/users.module';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from 'src/users/users.model';
import { Profile } from './profiles.model';

@Module({
  controllers: [ProfilesController],
  providers: [ProfilesService],
  imports: [SequelizeModule.forFeature([Profile, User]), UsersModule],
})
export class ProfilesModule {}
