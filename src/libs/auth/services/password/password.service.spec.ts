import { Test, TestingModule } from '@nestjs/testing';
import { PasswordService } from './password.service';

describe('PasswordService', () => {
  let service: PasswordService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PasswordService],
    }).compile();

    service = module.get<PasswordService>(PasswordService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should generate salt and return that', () => {
    jest.spyOn(service, 'getSalt').mockReturnValue('1234qwer');
    expect(service.getSalt()).toEqual('1234qwer');
  });

  it('should generate hash and return that', () => {
    jest.spyOn(service, 'getHash').mockReturnValue('111qwer');
    expect(service.getHash('123', '1234qwer')).toEqual('111qwer');
  });
});
