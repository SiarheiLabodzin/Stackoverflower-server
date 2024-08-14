import { Module } from '@nestjs/common';
import { AnswersController } from './controllers/answers.controller';
import { AnswersService } from './services/answers.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Question } from 'src/config/type-orm/entities/question.entity';
import { User } from '../users/entities/user.entity';
import { Answer } from 'src/config/type-orm/entities/answer.entity';
import { UsersService } from '../users/services/users.service';

@Module({
  imports: [TypeOrmModule.forFeature([Question, User, Answer])],
  controllers: [AnswersController],
  providers: [AnswersService, UsersService],
})
export class AnswersModule {}
