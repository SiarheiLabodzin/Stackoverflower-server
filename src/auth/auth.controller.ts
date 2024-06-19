import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  Query,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CookieService } from './cookie.service';
import { ApiCreatedResponse, ApiOkResponse } from '@nestjs/swagger';
import {
  GetSessionInfoDto,
  OtpSignInBodyDto,
  SignInBodyDto,
  SignUpBodyDto,
} from './index.dto';
import { Response } from 'express';
import { SessionInfo } from './sessionInfo.decorator';
import { AuthGuard } from './authToken.guard';

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
    @Param('id', ParseIntPipe) id: string,
    @Query('email') email: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { Token } = await this.authService.confirmationEmail(id, email);

    this.cookieService.setToken(res, Token);
  }

  @Post('sign-in/otp')
  @ApiOkResponse()
  async confirmationSignIn(
    @Body() body: OtpSignInBodyDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { Token } = await this.authService.confirmationSignIn(body.otp);

    this.cookieService.setToken(res, Token);
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
