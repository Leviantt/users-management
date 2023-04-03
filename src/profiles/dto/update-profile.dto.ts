import { ApiProperty } from '@nestjs/swagger';

export class UpdateProfileDto {
  @ApiProperty({ example: 'John', description: 'First name' })
  readonly firstName?: string;

  @ApiProperty({ example: 'Doe', description: 'Last name' })
  readonly lastName?: string;

  @ApiProperty({ example: '79274326412', description: 'Phone number' })
  readonly phone?: string;
}
