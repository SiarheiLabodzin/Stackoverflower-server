import { Module } from '@nestjs/common';
import { QuestionsController } from './controllers/questions.controller';
import { QuestionsService } from './services/questions.service';
import { Question } from 'src/config/type-orm/entities/question.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity';
import { UsersService } from '../users/services/users.service';

@Module({
  imports: [TypeOrmModule.forFeature([Question, User])],
  controllers: [QuestionsController],
  providers: [QuestionsService, UsersService],
  exports: [QuestionsService],
})
export class QuestionsModule {}
