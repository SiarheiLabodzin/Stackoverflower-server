import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Roles } from '../decorators/roles.decorator';
import { Request } from 'express';
import { UsersService } from '../../../modules/users/services/users.service';

@Injectable()
export class AuthRoleGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private usersService: UsersService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const roles = this.reflector.get(Roles, context.getHandler());
    const request = context.switchToHttp().getRequest() as Request;
    const session = await request['session'];

    if (request['session']) {
      const { email } = session;
      const user = await this.usersService.findByEmail(email);
      return roles.includes(user?.role || '');
    }
    return false;
  }
}
