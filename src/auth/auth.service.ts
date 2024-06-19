import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { PasswordService } from './password.service';
import { JwtService } from '@nestjs/jwt';
import { MailService } from 'src/mail/mail.service';
import { InjectRedis } from '@nestjs-modules/ioredis';
import { Redis } from 'ioredis';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/type-orm/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private passwordService: PasswordService,
    private jwtService: JwtService,
    private mailService: MailService,
    @InjectRedis() private readonly redis: Redis,
    @InjectRepository(User) private repo: Repository<User>,
  ) {}

  async signUp(email: string, password: string) {
    const user = await this.usersService.findByEmail(email);
    if (user) throw new BadRequestException({ type: 'Email already exists' });

    const salt = this.passwordService.getSalt();
    const hash = this.passwordService.getHash(password, salt);

    const urlCode = {
      code: (Math.random() * 9999).toFixed(),
    };

    await this.redis.set(`url${urlCode.code}`, urlCode.code, 'EX', 600);

    this.mailService.sendMail(
      email,
      'Confirmation email',
      `${process.env.EMAIL_CONFIRMATION_URL}${urlCode.code}?email=${email}`,
    );

    return await this.usersService.createUser(email, hash, salt);
  }

  async signIn(email: string, password: string) {
    const user = await this.usersService.findByEmail(email);
    if (!user) throw new BadRequestException({ type: 'Email does not exists' });

    const hash = this.passwordService.getHash(password, user.salt);
    if (hash !== user.hash)
      throw new UnauthorizedException({
        type: 'Wrong password. Please try again ',
      });

    const OTP = {
      code: (Math.random() * 9999).toFixed(),
    };

    await this.redis.set(`OTP-${OTP.code}`, OTP.code, 'EX', 600);
    await this.redis.set(`Email-${OTP.code}`, email, 'EX', 600);

    this.mailService.sendMail(
      email,
      '2FA Sign in',
      `Your confirmation code is - ${OTP.code}`,
    );
  }

  async confirmationEmail(id: string, userEmail: string) {
    const user = await this.usersService.findByEmail(userEmail);
    if (!user) throw new BadRequestException({ type: 'User does not exists' });

    const code = await this.redis.get(`url${id}`);
    if (!code)
      throw new BadRequestException({ type: 'Url code does not exists' });

    const Token = await this.jwtService.signAsync({
      id: user.id,
      email: user.email,
    });

    const verifiedUser = {
      isVerified: true,
    };

    Object.assign(user, verifiedUser);

    await this.repo.save(user);

    return { Token };
  }

  async confirmationSignIn(otp: string) {
    const email = await this.redis.get(`Email-${otp}`);
    if (!email)
      throw new BadRequestException({ type: 'Email does not exists' });

    const code = await this.redis.get(`OTP-${otp}`);
    if (!code)
      throw new BadRequestException({ type: 'OTP code does not exists' });

    const user = await this.usersService.findByEmail(email);
    if (!user) throw new BadRequestException({ type: 'User does not exists' });

    const Token = await this.jwtService.signAsync({
      id: user.id,
      email: user.email,
    });

    return { Token };
  }
}
