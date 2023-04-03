import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  SetMetadata,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { ROLES_KEY } from './roles.decorator';

export const SKIP_ADMIN_CHECK = 'SKIP_ADMIN_CHECK';

@Injectable()
export class UserOwnerGuard implements CanActivate {
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

      const req = context.switchToHttp().getRequest();

      if (req.user.id == req.params.id) {
        SetMetadata(SKIP_ADMIN_CHECK, true);
      }

      return true;
    } catch (err) {
      throw new ForbiddenException({
        message: 'Access denied',
      });
    }
  }
}
