import { ApiProperty } from '@nestjs/swagger/dist';
import { IsEmail, IsString, Length } from 'class-validator';

export class CreateProfileDto {
  @ApiProperty({ example: 'user@mail.ru', description: 'Email' })
  @IsString({ message: 'Should be string' })
  @IsEmail({}, { message: 'Invalid email' })
  readonly email: string;

  @ApiProperty({ example: '1324513', description: 'Password' })
  @IsString({ message: 'Should be string' })
  @Length(4, 16, { message: 'Length should be between 4 and 16' })
  readonly password: string;

  @ApiProperty({ example: 'John', description: 'First name' })
  @IsString({ message: 'Should be string' })
  readonly firstName: string;

  @ApiProperty({ example: 'Doe', description: 'Last name' })
  @IsString({ message: 'Should be string' })
  readonly lastName: string;

  @ApiProperty({ example: '79274326412', description: 'Phone number' })
  @IsString({ message: 'Should be string' })
  readonly phone: string;
}
