import { Injectable } from '@nestjs/common';
import { Response } from 'express';

@Injectable()
export class CookieService {
  static tokenAccessKey = 'access_token';
  static tokenRefreshKey = 'refresh_token';

  setToken(res: Response, token: string) {
    res.cookie(CookieService.tokenAccessKey, token, {
      httpOnly: true,
      maxAge: 30 * 60 * 1000,
    });
    res.cookie(CookieService.tokenRefreshKey, token, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000,
    });
  }

  removeToken(res: Response) {
    res.clearCookie(CookieService.tokenAccessKey);
    res.clearCookie(CookieService.tokenRefreshKey);
  }
}
