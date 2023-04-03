import { Module } from '@nestjs/common';
import { TokensService } from './tokens.service';
import { JwtModule } from '@nestjs/jwt';
import { SequelizeModule } from '@nestjs/sequelize';
import { Token } from './tokens.model';
import { User } from 'src/users/users.model';

@Module({
  providers: [TokensService],
  imports: [JwtModule, SequelizeModule.forFeature([Token, User])],
  exports: [TokensService],
})
export class TokensModule {}
