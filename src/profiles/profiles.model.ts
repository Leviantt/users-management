import { ApiProperty } from '@nestjs/swagger';
import {
  Column,
  DataType,
  Model,
  Table,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';
import { User } from 'src/users/users.model';

interface ProfileCreationAttributes {
  firstName: string;
  lastName: string;
  phone: string;
  userId: number;
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

  @ApiProperty({ example: 'John', description: 'First name' })
  @Column({ type: DataType.STRING, allowNull: false })
  firstName: string;

  @ApiProperty({ example: 'Doe', description: 'Last name' })
  @Column({ type: DataType.STRING, allowNull: false })
  lastName: string;

  @ApiProperty({ example: '79274326412', description: 'Phone number' })
  @Column({ type: DataType.STRING, unique: true, allowNull: false })
  phone: string;

  @ApiProperty({ example: '1', description: 'Foreign key' })
  @ForeignKey(() => User)
  @Column({
    type: DataType.INTEGER,
    unique: true,
  })
  userId: number;

  @BelongsTo(() => User)
  user: User;
}
