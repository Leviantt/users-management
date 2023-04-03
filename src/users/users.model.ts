import { ApiProperty } from '@nestjs/swagger';
import {
  Column,
  DataType,
  Model,
  Table,
  BelongsToMany,
  HasOne,
} from 'sequelize-typescript';
import { Profile } from 'src/profiles/profiles.model';
import { Role } from 'src/roles/roles.model';
import { UserRoles } from 'src/roles/user-roles.model';
import { Token } from 'src/tokens/tokens.model';

// специфицируем поля, которых достаточно для создания пользователя
interface UserCreationAttributes {
  email: string;
  password: string;
}

// модель пользователя
@Table({ tableName: 'users' })
export class User extends Model<User, UserCreationAttributes> {
  @ApiProperty({ example: '1', description: 'Primary key' })
  @Column({
    type: DataType.INTEGER,
    unique: true,
    autoIncrement: true,
    primaryKey: true,
  })
  id: number;

  @ApiProperty({ example: 'user@mail.ru', description: 'Email' })
  @Column({ type: DataType.STRING, unique: true, allowNull: false })
  email: string;

  @ApiProperty({ example: '1324513', description: 'Password' })
  @Column({ type: DataType.STRING, allowNull: false })
  password: string;

  @BelongsToMany(() => Role, () => UserRoles)
  roles: Role[];

  @HasOne(() => Token)
  refreshToken: Token;

  @HasOne(() => Profile)
  profile: Profile;
}
