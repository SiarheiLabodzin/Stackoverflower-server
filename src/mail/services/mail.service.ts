import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';

@Injectable()
export class MailService {
  constructor(private readonly mailerService: MailerService) {}

  sendMail(mail: string, subject: string, text: string): void {
    this.mailerService.sendMail({
      to: mail,
      from: process.env.MAILER_AUTHOR,
      subject: subject,
      text: text,
      html: `<b>${text}</b>`,
    });
  }
}
