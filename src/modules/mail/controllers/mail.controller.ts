import { Controller, Post } from '@nestjs/common';
import { MailService } from '../services/mail.service';

@Controller('mail')
export class MailController {
  constructor(private readonly mailService: MailService) {}

  @Post('send-mail')
  sendMail(mail: string, subject: string, text: string): void {
    return this.mailService.sendMail(mail, subject, text);
  }
}
