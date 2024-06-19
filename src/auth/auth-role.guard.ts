import { JwtService } from '@nestjs/jwt';
import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Roles } from './roles.decorator';
import { Request } from 'express';
import { CookieService } from './cookie.service';
import { GetSessionInfoDto } from './index.dto';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthRoleGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private jwtService: JwtService,
    private usersService: UsersService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const roles = this.reflector.get(Roles, context.getHandler());
    const request = context.switchToHttp().getRequest() as Request;

    if (request?.cookies) {
      const token = request.cookies[CookieService.tokenAccessKey];
      const decodedJwtAccessToken: GetSessionInfoDto =
        this.jwtService.decode(token);
      const email = decodedJwtAccessToken.email;
      const user = await this.usersService.findByEmail(email);
      return roles.includes(user?.role || '');
    }

    return false;
  }
}
