import { ApiProperty } from '@nestjs/swagger';
import { Column, DataType, Model, Table, HasOne } from 'sequelize-typescript';
import { User } from 'src/users/users.model';

interface ProfileCreationAttributes {
  firstName: string;
  lastName: string;
  user: User;
}

@Table({ tableName: 'profiles' })
export class Profile extends Model<Profile, ProfileCreationAttributes> {
  @ApiProperty({ example: '1', description: 'Primary key' })
  @Column({
    type: DataType.INTEGER,
    unique: true,
    autoIncrement: true,
    primaryKey: true,
  })
  id: number;

  @ApiProperty({ example: 'John', description: 'first name' })
  @Column({ type: DataType.STRING, allowNull: false })
  firstName: string;

  @ApiProperty({ example: 'Doe', description: 'last name' })
  @Column({ type: DataType.STRING, allowNull: false })
  lastName: string;

  @ApiProperty({ example: '79274326412', description: 'phone number' })
  @Column({ type: DataType.STRING, unique: true })
  phone: string;

  @HasOne(() => User)
  user: User;
}
