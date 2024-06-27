import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { PasswordService } from '../../libs/auth/services/password/password.service';
import { JwtService } from '@nestjs/jwt';
import { InjectRedis } from '@nestjs-modules/ioredis';
import { Redis } from 'ioredis';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MailService } from '../../mail/services/mail.service';
import { UsersService } from '../../users/services/users.service';
import { User } from '../../users/entities/user.entity';

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

    const urlCode = (Math.random() * 9999).toFixed();

    const urlToken = await this.jwtService.signAsync({
      otp: urlCode,
      email: email,
    });

    await this.redis.set(`${urlCode}`, urlCode, 'EX', 600);

    this.mailService.sendMail(
      email,
      'Confirmation email',
      `${process.env.EMAIL_CONFIRMATION_URL}${urlToken}`,
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

    await this.redis.set(`${OTP.code}`, email, 'EX', 600);

    this.mailService.sendMail(
      email,
      '2FA Sign in',
      `Your confirmation code is - ${OTP.code}`,
    );
  }

  async confirmationEmail(id: number) {
    const { email, otp } = this.jwtService.decode(id.toString());

    const user = await this.usersService.findByEmail(email);
    if (!user) throw new BadRequestException({ type: 'User does not exists' });

    const code = await this.redis.get(`${otp}`);
    if (!code)
      throw new BadRequestException({ type: 'One time code is expired' });

    const token = await this.jwtService.signAsync({
      id: user.id,
      email: user.email,
    });

    const verifiedUser = {
      isVerified: true,
    };

    Object.assign(user, verifiedUser);

    await this.repo.save(user);

    return { token };
  }

  async confirmationSignIn(otp: string) {
    const email = await this.redis.get(`${otp}`);
    if (!email)
      throw new BadRequestException({ type: 'Email does not exists' });

    const code = await this.redis.keys(`${otp}`);
    if (!code)
      throw new BadRequestException({ type: 'One time password is expired' });

    const user = await this.usersService.findByEmail(email);
    if (!user) throw new BadRequestException({ type: 'User does not exists' });

    const token = await this.jwtService.signAsync({
      id: user.id,
      email: user.email,
    });

    return { token };
  }
}
