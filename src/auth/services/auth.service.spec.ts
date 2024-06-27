import { MailsType } from './../../mail/mocks/mockMailer';
import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../../users/entities/user.entity';
import { MockAuthRepository } from '../mocks/mockAuthRepository';
import { MailService } from '../../mail/services/mail.service';
import { UsersService } from '../../users/services/users.service';
import { MockUsersRepository } from '../../users/mocks/mockUsersRepository';
import { PasswordService } from '../../libs/auth/services/password/password.service';
import { JwtService } from '@nestjs/jwt';
import { getRedisConnectionToken } from '@nestjs-modules/ioredis';

describe('AuthService', () => {
  let service: AuthService;

  let mails: MailsType[] = [];

  const mockMailerService = {
    sendMail: jest.fn().mockImplementation((email, subject, text) => {
      const mail: MailsType = {
        to: email,
        from: 'author',
        subject: subject,
        text: text,
        html: `<b>text</b>`,
      };
      mails.push(mail);
      return mail;
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: MockUsersRepository,
        },
        {
          provide: MailService,
          useValue: mockMailerService,
        },

        {
          provide: PasswordService,
          useValue: MockAuthRepository,
        },

        {
          provide: JwtService,
          useValue: MockAuthRepository,
        },
        {
          provide: getRedisConnectionToken(),
          useValue: MockAuthRepository,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should sign up a user and return him', async () => {
    expect(await service.signUp('example2@gmail.com', '1234')).toEqual({
      email: 'example2@gmail.com',
      hash: 'ahaha',
      id: expect.any(Number),
      isVerified: false,
      role: 'user',
      salt: '1234',
    });
  });

  it('should sign in a user and send an OTP mail', async () => {
    const spy = jest.spyOn(mockMailerService, 'sendMail');

    await service.signIn('example3@gmail.com', '1234');

    expect(spy).toHaveBeenCalled();
  });

  it('should confirm a mail and generate token for user and return it', async () => {
    expect(await service.confirmationEmail(123)).toEqual({
      token: {
        email: 'example@gmail.com',
        id: 1,
      },
    });
  });

  it('should confirm an OTP and generate token for user and return it', async () => {
    expect(await service.confirmationSignIn('example@gmail.com')).toEqual({
      token: {
        email: 'example@gmail.com',
        id: 1,
      },
    });
  });
});
