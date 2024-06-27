import { ConfigService } from '@nestjs/config';
import { Injectable } from '@nestjs/common';
import { MailerOptionsFactory } from '@nestjs-modules/mailer';

@Injectable()
export class MailerConfig implements MailerOptionsFactory {
  constructor(private configService: ConfigService) {}

  createMailerOptions() {
    const mailer = this.configService.get('mailer');
    return mailer;
  }
}
