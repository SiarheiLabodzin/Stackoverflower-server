import { Test, TestingModule } from '@nestjs/testing';
import { MailService } from './mail.service';
import { MailsType } from '../mocks/mockMailer';

describe('MailService', () => {
  let service: MailService;

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
      providers: [MailService],
    })
      .overrideProvider(MailService)
      .useValue(mockMailerService)
      .compile();

    service = module.get<MailService>(MailService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should send a mail', () => {
    expect(
      service.sendMail('hello@gmail.com', 'wow', 'this is message'),
    ).toEqual(mails[mails.length - 1]);
  });
});
