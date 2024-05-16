import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { RoleEnum } from './roles.enum';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const roles = this.reflector.getAllAndOverride<number[]>('roles', [
      context.getClass(),
      context.getHandler(),
    ]);

    if (!roles.length) {
      return true;
    }
    const request = context.switchToHttp().getRequest();

    let currentRole = request.user?.role?.id;

    if (currentRole === 0) {
      currentRole = RoleEnum.user;
    }

    return roles.includes(currentRole);
  }
}
