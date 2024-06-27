import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from '../services/auth.service';
import { MockAuthController } from '../mocks/mockAuthRepository';
import { JwtService } from '@nestjs/jwt';
import { response } from 'express';
import { CookieService } from '../services/cookies/cookie.service';

describe('AuthController', () => {
  let controller: AuthController;
  let authService: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: MockAuthController,
        },
        {
          provide: JwtService,
          useValue: MockAuthController,
        },
        {
          provide: CookieService,
          useValue: MockAuthController,
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  it('should sign up a user and return him', async () => {
    expect(
      await controller.signUp({
        email: 'example2@gmail.com',
        password: '1234',
      }),
    ).toEqual({
      email: 'example2@gmail.com',
      hash: 'ahaha',
      id: expect.any(Number),
      isVerified: false,
      role: 'user',
      salt: '1234',
    });
    expect(authService.signUp).toHaveBeenCalledWith(
      'example2@gmail.com',
      '1234',
    );
  });

  it('should sign in a user and and send an OTP mail', async () => {
    await controller.signIn({
      email: 'example@gmail.com',
      password: '1234',
    });

    expect(authService.signIn).toHaveBeenCalledWith(
      'example@gmail.com',
      '1234',
    );
  });

  it('should sign out and remove token', async () => {
    const spy = jest.spyOn(MockAuthController, 'removeToken');

    controller.signOut(response);

    expect(spy).toHaveBeenCalled();
  });

  it('should confirm email of user and set token', async () => {
    const spy = jest.spyOn(MockAuthController, 'setToken');

    await controller.confirmationEmail(1, response);

    expect(authService.confirmationEmail).toHaveBeenCalledWith(1);

    expect(spy).toHaveBeenCalled();
  });

  it('should confirm otp of user and set token', async () => {
    const spy = jest.spyOn(MockAuthController, 'setToken');

    await controller.confirmationSignIn({ otp: '1234' }, response);

    expect(authService.confirmationSignIn).toHaveBeenCalledWith('1234');

    expect(spy).toHaveBeenCalled();
  });

  it('should return session', async () => {
    expect(
      controller.getSessionInfo({
        id: 1,
        email: 'example@gmail.com',
        iat: 123,
        exp: 123,
      }),
    ).toEqual({
      id: 1,
      email: 'example@gmail.com',
      iat: 123,
      exp: 123,
    });
  });
});
