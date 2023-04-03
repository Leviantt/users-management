import { IsArray, IsNumber } from 'class-validator';
import { User } from '../users.model';

export class GenerateUserTokenDto {
  constructor(user: User) {
    this.roles = user.roles.map((role) => role.value);
    this.id = user.id;
  }

  @IsArray({ message: 'Should be array' })
  readonly roles: string[];
  @IsNumber({}, { message: 'Should be number' })
  readonly id: number;
}
