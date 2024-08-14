import { Test, TestingModule } from '@nestjs/testing';
import { MailController } from './mail.controller';
import { MailService } from '../services/mail.service';
import { MailsType } from '../mocks/mockMailer';

describe('MailController', () => {
  let controller: MailController;

  let mails: MailsType[] = [];

  const mockMailServive = {
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
      controllers: [MailController],
      providers: [MailService],
    })
      .overrideProvider(MailService)
      .useValue(mockMailServive)
      .compile();

    controller = module.get<MailController>(MailController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should send a mail', () => {
    expect(
      controller.sendMail('hello@gmail.com', 'wow', 'this is message'),
    ).toEqual(mails[mails.length - 1]);
  });
});
