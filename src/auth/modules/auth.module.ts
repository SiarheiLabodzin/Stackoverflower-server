import { Module } from '@nestjs/common';
import { AuthController } from '../controllers/auth.controller';
import { AuthService } from '../services/auth.service';
import { CookieService } from '../../libs/auth/services/cookies/cookie.service';
import { PasswordService } from '../../libs/auth/services/password/password.service';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MailModule } from 'src/mail/modules/mail.module';
import { UsersModule } from 'src/users/modules/users.module';
import { User } from 'src/type-orm/entities/user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '1d' },
    }),
    UsersModule,
    MailModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, CookieService, PasswordService],
  exports: [AuthService, CookieService, PasswordService],
})
export class AuthModule {}
