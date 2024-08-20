import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';

@Injectable()
export class MockAuthRoleGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    return true; // Allow all requests
  }
}
