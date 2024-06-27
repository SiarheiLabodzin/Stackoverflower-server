import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { CookieService } from '../../../modules/auth/services/cookies/cookie.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest() as Request;
    const token = req.cookies[CookieService.tokenAccessKey];

    if (!token) throw new UnauthorizedException();

    try {
      const sessionInformation = this.jwtService.verifyAsync(token, {
        secret: process.env.JWT_SECRET,
      });
      req['session'] = sessionInformation;
    } catch {
      throw new UnauthorizedException();
    }

    return true;
  }
}
