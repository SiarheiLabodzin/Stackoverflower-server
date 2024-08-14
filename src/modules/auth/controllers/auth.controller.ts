import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseFilePipe,
  Post,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { CookieService } from '../services/cookies/cookie.service';
import { ApiCreatedResponse, ApiOkResponse } from '@nestjs/swagger';
import {
  GetSessionInfoDto,
  OtpSignInBodyDto,
  SignInBodyDto,
  SignUpBodyDto,
} from '../index.dto';
import { Response } from 'express';
import { SessionInfo } from '../../../libs/auth/decorators/sessionInfo.decorator';
import { AuthGuard } from '../../../libs/auth/guards/authToken.guard';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private cookieService: CookieService,
  ) {}

  @Post('sign-up')
  @ApiCreatedResponse()
  async signUp(@Body() body: SignUpBodyDto) {
    return this.authService.signUp(body.email, body.password);
  }

  @Post('sign-in')
  @ApiCreatedResponse()
  async signIn(@Body() body: SignInBodyDto) {
    return this.authService.signIn(body.email, body.password);
  }

  @Post('sign-out')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse()
  @UseGuards(AuthGuard)
  signOut(@Res({ passthrough: true }) res: Response) {
    this.cookieService.removeToken(res);
  }

  @Get('email/confirm/:id')
  @ApiOkResponse()
  async confirmationEmail(
    @Param('id', ParseFilePipe) id: number,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { token } = await this.authService.confirmationEmail(id);

    this.cookieService.setToken(res, token);
  }

  @Post('sign-in/otp')
  @ApiOkResponse()
  async confirmationSignIn(
    @Body() body: OtpSignInBodyDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { token } = await this.authService.confirmationSignIn(body.otp);

    this.cookieService.setToken(res, token);
  }

  @Get('session-info')
  @ApiOkResponse({
    type: GetSessionInfoDto,
  })
  @UseGuards(AuthGuard)
  getSessionInfo(@SessionInfo() session: GetSessionInfoDto) {
    return session;
  }
}
