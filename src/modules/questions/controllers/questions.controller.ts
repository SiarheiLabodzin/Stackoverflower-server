import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiCreatedResponse, ApiOkResponse } from '@nestjs/swagger';
import { AuthGuard } from 'src/libs/auth/guards/authToken.guard';
import { QuestionsService } from '../services/questions.service';
import { GetSessionInfoDto, QusetionItemDto } from 'src/modules/auth/index.dto';
import { SessionInfo } from 'src/libs/auth/decorators/sessionInfo.decorator';
import { CreateQuestionDto } from '../dtos/createQuestion.dto';
import { UpdateQuestionDto } from '../dtos/updateQuestion.dto';
import { QuestionQueryDto } from '../dtos/questionQuery.dto';
import { AuthRoleGuard } from 'src/libs/auth/guards/auth-role.guard';
import { Roles } from 'src/libs/auth/decorators/roles.decorator';

@Controller('questions')
export class QuestionsController {
  constructor(private questionService: QuestionsService) {}

  @Get('get-all-questions')
  @ApiOkResponse()
  @UseGuards(AuthGuard)
  async getAllQuestions() {
    return this.questionService.getAllQuestions();
  }

  @Get('get-question/:id')
  @ApiOkResponse()
  @UseGuards(AuthGuard)
  async findById(@Param('id', ParseIntPipe) id: number) {
    return this.questionService.findById(id);
  }

  @Get('get-filtered-question')
  @ApiOkResponse()
  @UseGuards(AuthGuard)
  async filterQuestionsByTag(@Query() query: QuestionQueryDto) {
    return this.questionService.filterQuestionsByTag(query);
  }

  @Post('create-question')
  @ApiCreatedResponse()
  @UseGuards(AuthGuard)
  async createQuestion(
    @Body() body: CreateQuestionDto,
    @SessionInfo() session: GetSessionInfoDto,
  ) {
    const userMail = session.email;
    return this.questionService.createQuestion(
      userMail,
      body.title,
      body.description,
      body.tags,
    );
  }

  @Patch('update-question/:id')
  @ApiOkResponse()
  @Roles(['admin'])
  @UseGuards(AuthGuard, AuthRoleGuard)
  async updateQuestion(
    @Body() body: UpdateQuestionDto,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return await this.questionService.updateQuestion(id, body);
  }

  @Patch('update-user-question/:id')
  @ApiOkResponse()
  @Roles(['user', 'admin'])
  @UseGuards(AuthGuard, AuthRoleGuard)
  async updateUserQuestion(
    @Body() body: UpdateQuestionDto,
    @Param('id', ParseIntPipe) id: number,
    @SessionInfo() session: GetSessionInfoDto,
  ) {
    return await this.questionService.updateUserQuestion(
      session.email,
      id,
      body,
    );
  }

  @Patch('upvote-question/:id')
  @ApiOkResponse()
  async upvoteQuestion(@Param('id', ParseIntPipe) id: number) {
    return await this.questionService.upvoteQuestion(id);
  }

  @Patch('downvote-question/:id')
  @ApiOkResponse()
  async downvoteQuestion(@Param('id', ParseIntPipe) id: number) {
    return await this.questionService.downvoteQuestion(id);
  }

  @Delete('delete-question/:id')
  @ApiOkResponse()
  @Roles(['admin'])
  @UseGuards(AuthGuard, AuthRoleGuard)
  async deleteQuestion(@Param('id', ParseIntPipe) id: number) {
    return await this.questionService.deleteQuestion(id);
  }

  @Delete('delete-user-question/:id')
  @ApiOkResponse()
  @Roles(['user', 'admin'])
  @UseGuards(AuthGuard, AuthRoleGuard)
  async deleteUserQuestion(
    @Param('id', ParseIntPipe) id: number,
    @SessionInfo() session: GetSessionInfoDto,
  ) {
    return await this.questionService.deleteUserQuestion(id, session.email);
  }
}
