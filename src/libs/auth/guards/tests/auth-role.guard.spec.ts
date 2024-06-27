import { AuthRoleGuard } from '../auth-role.guard';
import { Test, TestingModule } from '@nestjs/testing';
import { Reflector } from '@nestjs/core';
import { UsersService } from '../../../../users/services/users.service';
import { mockRoleGuard } from '../mocks/mockGuards';

describe('AuthRoleGuard', () => {
  let authRoleGuard: AuthRoleGuard;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthRoleGuard,
        UsersService,
        {
          provide: Reflector,
          useValue: mockRoleGuard,
        },
      ],
    })
      .overrideProvider(UsersService)
      .useValue(mockRoleGuard)
      .compile();

    authRoleGuard = module.get<AuthRoleGuard>(AuthRoleGuard);
  });

  it('should check role of the user and return true', async () => {
    expect(
      //@ts-ignore
      await authRoleGuard.canActivate(mockRoleGuard.contextMethod),
    ).toEqual(true);
  });
});
