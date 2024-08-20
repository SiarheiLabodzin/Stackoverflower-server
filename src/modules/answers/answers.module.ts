import { Module } from '@nestjs/common';
import { AnswersController } from './controllers/answers.controller';
import { AnswersService } from './services/answers.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Question } from '@src/config/type-orm/entities/question.entity';
import { User } from '../users/entities/user.entity';
import { Answer } from '@src/config/type-orm/entities/answer.entity';
import { UsersService } from '../users/services/users.service';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  imports: [
    TypeOrmModule.forFeature([Question, User, Answer]),
    ClientsModule.register([
      {
        name: 'MICROSERVICE_CLIENT',
        transport: Transport.RMQ,
        options: {
          urls: [process.env.RABBITMQ_URLS],
          queue: process.env.RABBITMQ_QUEUE,
          queueOptions: {
            durable: false,
          },
          socketOptions: {
            heartbeatIntervalInSeconds: 60,
          },
        },
      },
    ]),
  ],
  controllers: [AnswersController],
  providers: [AnswersService, UsersService],
})
export class AnswersModule {}
