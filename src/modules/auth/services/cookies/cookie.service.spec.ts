import { Test, TestingModule } from '@nestjs/testing';
import { CookieService } from './cookie.service';
import { CookieType } from '../../mocks/mockCookie';
import { response } from 'express';

describe('CookieService', () => {
  let service: CookieService;

  let cookies: CookieType[] = [];

  const mockCookieService = {
    cookie: jest.fn().mockImplementation((tokenKey, token, tokenOpt) => {
      const cookieToken = {
        [tokenKey]: token,
        ...tokenOpt,
      };

      cookies.push(cookieToken);
      return cookies;
    }),
    clearCookie: jest.fn().mockImplementation((tokenKey) => {
      return cookies.filter((el) => el.token !== tokenKey);
    }),
    setToken: jest.fn().mockImplementation((token) => {
      mockCookieService.cookie('access_key', token);
      return mockCookieService.cookie('access_key', token);
    }),
    removeToken: jest.fn().mockImplementation(() => {
      mockCookieService.clearCookie('access_key');
      return mockCookieService.clearCookie('access_key');
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CookieService],
    })
      .overrideProvider(CookieService)
      .useValue(mockCookieService)
      .compile();

    service = module.get<CookieService>(CookieService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should set tokens and return them', () => {
    expect(service.setToken(response, '23e23fe3')).toEqual(cookies);
  });

  it('should remove tokens and return them', () => {
    expect(service.removeToken(response)).toEqual(cookies);
  });
});
