import { ApiProperty } from '@nestjs/swagger/dist';
import { IsEmail, IsString, Length } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({ example: 'user@mail.ru', description: 'Почта' })
  @IsString({ message: 'Should be string' })
  @IsEmail({}, { message: 'Invalid email' })
  readonly email: string;

  @ApiProperty({ example: '1324513', description: 'Пароль' })
  @IsString({ message: 'Should be string' })
  @Length(4, 16, { message: 'Length should be between 4 and 16' })
  readonly password: string;
}
