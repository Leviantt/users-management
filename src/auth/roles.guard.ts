import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { ROLES_KEY } from './roles.decorator';
import { SKIP_ADMIN_CHECK } from './user-owner.guard';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    try {
      const requiredRoles = this.reflector.getAllAndOverride<string[]>(
        ROLES_KEY,
        [context.getHandler(), context.getClass()],
      );

      if (!requiredRoles) {
        return true;
      }

      // если единственная требуемая роль ADMIN и до этого установили пропустить
      // проверку на админа, возвращаем true
      if (requiredRoles.length === 1 && requiredRoles[0] === 'ADMIN') {
        const skipAdminCheck = this.reflector.getAllAndOverride<boolean>(
          SKIP_ADMIN_CHECK,
          [context.getHandler(), context.getClass()],
        );
        if (skipAdminCheck) {
          return true;
        }
      }

      const user = context.switchToHttp().getRequest().user;

      return user.roles.some((role) => requiredRoles.includes(role.value));
    } catch (err) {
      throw new ForbiddenException({
        message: 'Access denied',
      });
    }
  }
}
