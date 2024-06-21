import { Reflector } from '@nestjs/core';
import { AuthRoleGuard } from '../auth-role.guard';

describe('AuthRoleGuard', () => {
  it('should be defined', () => {
    expect(new AuthRoleGuard()).toBeDefined();
  });
});
