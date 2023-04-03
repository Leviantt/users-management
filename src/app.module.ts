import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { ConfigModule } from '@nestjs/config';

import { UsersModule } from './users/users.module';
import { RolesModule } from './roles/roles.module';
import { UserRoles } from './roles/user-roles.model';
import { Role } from './roles/roles.model';
import { User } from './users/users.model';
import { TokensModule } from './tokens/tokens.module';
import { ProfilesModule } from './profiles/profiles.module';
import { Token } from './tokens/tokens.model';
import { Profile } from './profiles/profiles.model';

@Module({
  imports: [
    // подгружаем environment variables из разных файлов в зависимости от мода
    ConfigModule.forRoot({
      envFilePath: `.${process.env.NODE_ENV}.env`,
    }),
    // подключаем postgres
    SequelizeModule.forRoot({
      dialect: 'postgres',
      host: 'localhost',
      port: +process.env.POSTGRES_PORT,
      username: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PASSWORD,
      database: process.env.POSTGRES_DB,
      models: [User, Role, UserRoles, Token, Profile],
      autoLoadModels: true,
    }),
    UsersModule,
    RolesModule,
    TokensModule,
    ProfilesModule,
  ],
})
export class AppModule {}
