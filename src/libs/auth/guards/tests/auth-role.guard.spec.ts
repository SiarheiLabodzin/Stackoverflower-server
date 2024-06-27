import { AuthRoleGuard } from '../auth-role.guard';
import { Test, TestingModule } from '@nestjs/testing';
import { Reflector } from '@nestjs/core';
import { mockRoleGuard } from '../mocks/mockGuards';
import { UsersService } from '../../../../modules/users/services/users.service';

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
