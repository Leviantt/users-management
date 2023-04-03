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

interface TokenCreationAttributes {
  userId: number;
  refreshToken: string;
}

@Table({ tableName: 'tokens' })
export class Token extends Model<Token, TokenCreationAttributes> {
  @ApiProperty({ example: '1', description: 'Уникальный идентификатор' })
  @Column({
    type: DataType.INTEGER,
    unique: true,
    autoIncrement: true,
    primaryKey: true,
  })
  id: number;

  @ApiProperty({ example: '1', description: 'Внешний идентификатор' })
  @ForeignKey(() => User)
  @Column({
    type: DataType.INTEGER,
    unique: true,
  })
  userId: number;

  @BelongsTo(() => User)
  user: User;

  @ApiProperty({
    example:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibWVzc2FnZSI6ImhpIiwiaWF0IjoxNTE2MjM5MDIyfQ.79JlqZ-5nYuee17aerR4oFblsie79qSUhtYiGKJT1v0',
    description: 'Токен доступа',
  })
  @Column({ type: DataType.STRING, allowNull: false })
  refreshToken: string;
}
