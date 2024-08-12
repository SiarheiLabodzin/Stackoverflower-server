import { Test, TestingModule } from '@nestjs/testing';
import { mockAuthTokenGuard, mockRoleGuard } from '../mocks/mockGuards';
import { AuthGuard } from '../authToken.guard';
import { JwtService } from '@nestjs/jwt';

describe('AuthTokenGuard', () => {
  let authTokenGuard: AuthGuard;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AuthGuard, JwtService],
    })
      .overrideProvider(JwtService)
      .useValue(mockAuthTokenGuard)
      .compile();

    authTokenGuard = module.get<AuthGuard>(AuthGuard);
  });

  it('should check JWT token and return true', async () => {
    expect(
      //@ts-ignore
      authTokenGuard.canActivate(mockAuthTokenGuard.contextMethod),
    ).toEqual(true);
  });
});
