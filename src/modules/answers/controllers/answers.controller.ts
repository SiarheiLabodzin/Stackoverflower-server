import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiCreatedResponse, ApiOkResponse } from '@nestjs/swagger';
import { AuthGuard } from '@src/libs/auth/guards/authToken.guard';
import { GetSessionInfoDto } from '@src/modules/auth/index.dto';
import { SessionInfo } from '@src/libs/auth/decorators/sessionInfo.decorator';
import { AuthRoleGuard } from '@src/libs/auth/guards/auth-role.guard';
import { Roles } from '@src/libs/auth/decorators/roles.decorator';
import { AnswersService } from '../services/answers.service';
import { CreateAnswerDto } from '../dtos/createAnswer.dto';
import { UpdateAnswerDto } from '../dtos/updateAnswer.dto';
import { Observable } from 'rxjs';
import { ClientProxy } from '@nestjs/microservices';

@Controller('answers')
export class AnswersController {
  constructor(
    private answersService: AnswersService,
    @Inject('MICROSERVICE_CLIENT') private client: ClientProxy,
  ) {}

  @Get('get-all-answers')
  @ApiOkResponse()
  @UseGuards(AuthGuard)
  async getAllAnswers() {
    return this.answersService.getAllAnswers();
  }

  @Get('get-answer/:id')
  @ApiOkResponse()
  @UseGuards(AuthGuard)
  async findById(@Param('id', ParseIntPipe) id: number) {
    return this.answersService.findById(id);
  }

  @Get('sum')
  sum(): Observable<number> {
    const pattern = { cmd: 'sum' };
    const payload = [1, 2, 3, 4, 5];
    return this.client.send<number>(pattern, payload);
  }

  @Post('create-answer/:id')
  @ApiCreatedResponse()
  @UseGuards(AuthGuard)
  async createAnswer(
    @Body() body: CreateAnswerDto,
    @SessionInfo() session: GetSessionInfoDto,
    @Param('id', ParseIntPipe) id: number,
  ) {
    const { text } = body;
    const { email } = session;
    return this.answersService.createAnswer({ email, text, id });
  }

  @Patch('update-answer/:id')
  @ApiOkResponse()
  @Roles(['admin'])
  @UseGuards(AuthGuard, AuthRoleGuard)
  async updateAnswer(
    @Body() body: UpdateAnswerDto,
    @Param('id', ParseIntPipe) id: number,
  ) {
    const { text } = body;

    return await this.answersService.updateAnswer({ id, text });
  }

  @Patch('update-user-answer/:id')
  @ApiOkResponse()
  @Roles(['user', 'admin'])
  @UseGuards(AuthGuard, AuthRoleGuard)
  async updateUserAnswer(
    @Body() body: UpdateAnswerDto,
    @Param('id', ParseIntPipe) id: number,
    @SessionInfo() session: GetSessionInfoDto,
  ) {
    const { text } = body;
    const { email } = session;

    return await this.answersService.updateUserAnswer({ email, id, text });
  }

  @Patch('upvote-answer/:id')
  @ApiOkResponse()
  async upvoteAnswer(@Param('id', ParseIntPipe) id: number) {
    return await this.answersService.upvoteAnswer(id);
  }

  @Patch('downvote-answer/:id')
  @ApiOkResponse()
  async downvoteAnswer(@Param('id', ParseIntPipe) id: number) {
    return await this.answersService.downvoteAnswer(id);
  }

  @Delete('delete-answer/:id')
  @ApiOkResponse()
  @Roles(['admin'])
  @UseGuards(AuthGuard, AuthRoleGuard)
  async deleteAnswer(@Param('id', ParseIntPipe) id: number) {
    return await this.answersService.deleteAnswer(id);
  }

  @Delete('delete-user-answer/:id')
  @ApiOkResponse()
  @Roles(['user', 'admin'])
  @UseGuards(AuthGuard, AuthRoleGuard)
  async deleteUserAnswer(
    @Param('id', ParseIntPipe) id: number,
    @SessionInfo() session: GetSessionInfoDto,
  ) {
    const { email } = session;
    await this.answersService.deleteUserAnswer({ id, email });
  }
}
