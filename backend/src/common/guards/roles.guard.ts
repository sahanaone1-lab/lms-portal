import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role } from '@prisma/client';
import { ROLES_KEY } from '../decorators/roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    
    const req = context.switchToHttp().getRequest();
    const { user } = req;
    const path = req.path || req.url || '';
    
    if (user && user.mustChangePassword && !path.includes('/users/change-password') && !path.includes('/auth/logout')) {
      return false;
    }

    if (!requiredRoles) {
      return true;
    }
    if (!user) {
      return false;
    }
    return requiredRoles.includes(user.role);
  }
}
