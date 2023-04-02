import { IsString, IsNumber } from 'class-validator';

export class AddRoleDto {
  @IsString({ message: 'Should be string' })
  readonly value: string;
  @IsNumber({}, { message: 'Should be number' })
  readonly userId: number;
}
