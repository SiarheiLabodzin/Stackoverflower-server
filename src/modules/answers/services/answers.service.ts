import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Answer } from 'src/config/type-orm/entities/answer.entity';
import { Question } from 'src/config/type-orm/entities/question.entity';
import { User } from 'src/modules/users/entities/user.entity';
import { DeepPartial, Repository } from 'typeorm';

import {
  CreateAnswerInterface,
  DeleteUserAnswerInterface,
  UpdateAnswerInterface,
  UpdateUserAnswerInterface,
} from './types/types';
import { UsersService } from 'src/modules/users/services/users.service';

@Injectable()
export class AnswersService {
  constructor(
    @InjectRepository(Question) private questionRepo: Repository<Question>,
    private userRepo: UsersService,
    @InjectRepository(Answer) private answerRepo: Repository<Answer>,
  ) {}

  async getAllAnswers() {
    return await this.answerRepo.find({});
  }

  async findById(id: number) {
    return await this.answerRepo.findOne({
      where: {
        id: id,
      },
    });
  }

  async createAnswer({ email, text, id }: CreateAnswerInterface) {
    const user = await this.userRepo.findByEmail(email);

    const question = await this.questionRepo.findOne({
      where: {
        id: id,
      },
      relations: ['user', 'answers'],
    });

    const answer = this.answerRepo.create({
      author: email,
      text: text,
      user: user as DeepPartial<User>,
      question: question as DeepPartial<Question>,
    });

    return await this.answerRepo.save(answer);
  }

  async updateAnswer({ id, text }: UpdateAnswerInterface) {
    const answer = await this.answerRepo.findOne({
      where: {
        id: id,
      },
    });

    if (!answer) {
      throw new NotFoundException('Answer not found!');
    }

    Object.assign(answer, text);

    return await this.answerRepo.update(id, answer);
  }

  async updateUserAnswer({ email, id, text }: UpdateUserAnswerInterface) {
    const user = await this.userRepo.findByEmail(email);

    if (!user) {
      throw new NotFoundException('User not found!');
    }

    const userAnswer = await this.answerRepo.findOne({
      where: {
        id: id,
      },
    });

    if (!userAnswer) {
      throw new NotFoundException('Answer not found!');
    }

    Object.assign(userAnswer, text);

    return await this.answerRepo.update(id, userAnswer);
  }

  async upvoteAnswer(id: number) {
    const answer = await this.answerRepo.findOne({
      where: {
        id: id,
      },
    });

    if (!answer) {
      throw new NotFoundException('Answer not found!');
    }

    answer.rating++;

    return await this.answerRepo.save(answer);
  }

  async downvoteAnswer(id: number) {
    const answer = await this.answerRepo.findOne({
      where: {
        id: id,
      },
    });

    if (!answer) {
      throw new NotFoundException('Answer not found!');
    }

    answer.rating--;

    return await this.answerRepo.save(answer);
  }

  async deleteAnswer(id: number) {
    const answer = await this.answerRepo.findOne({
      where: {
        id: id,
      },
    });

    if (!answer) {
      throw new NotFoundException('Answer not found!');
    }

    return await this.answerRepo.delete(id);
  }

  async deleteUserAnswer({ id, email }: DeleteUserAnswerInterface) {
    const user = await this.userRepo.findByEmail(email);

    if (!user) {
      throw new NotFoundException('User not found!');
    }

    const userAnswer = await this.answerRepo.findOne({
      where: {
        id: id,
      },
    });

    if (!userAnswer) {
      throw new NotFoundException('Answer not found!');
    }

    return await this.answerRepo.delete(id);
  }
}
