import { Injectable } from '@nestjs/common';
import { CreateRoleDto } from './dto/create-role';
import { InjectModel } from '@nestjs/sequelize';
import { Role } from './roles.model';

@Injectable()
export class RolesService {
  constructor(@InjectModel(Role) private role: typeof Role) {}

  async createRole(dto: CreateRoleDto) {
    return this.role.create(dto);
  }

  async getRoleByValue(value: string) {
    return this.role.findOne({ where: { value } });
  }
}
