import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from './users.model';
import { Role } from 'src/roles/roles.model';
import { UserRoles } from 'src/roles/user-roles.model';
import { RolesModule } from 'src/roles/roles.module';
import { TokensModule } from 'src/tokens/tokens.module';
import { Profile } from 'src/profiles/profiles.model';

@Module({
  controllers: [],
  providers: [UsersService],
  imports: [
    SequelizeModule.forFeature([User, Role, UserRoles, Profile]),
    RolesModule,
    TokensModule,
    // forwardRef(() => AuthModule),
  ],
  exports: [UsersService],
})
export class UsersModule {}
