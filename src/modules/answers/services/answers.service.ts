import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Answer } from 'src/config/type-orm/entities/answer.entity';
import { Question } from 'src/config/type-orm/entities/question.entity';
import { User } from 'src/modules/users/entities/user.entity';
import { DeepPartial, Repository } from 'typeorm';
import { UpdateAnswerDto } from '../dtos/updateAnswer.dto';

@Injectable()
export class AnswersService {
  constructor(
    @InjectRepository(Question) private repoQuestion: Repository<Question>,
    @InjectRepository(User) private repoUser: Repository<User>,
    @InjectRepository(Answer) private repoAnswer: Repository<Answer>,
  ) {}

  async getAllAnswers() {
    return await this.repoAnswer.find({
      relations: ['user', 'question'],
    });
  }

  async findById(id: number) {
    return await this.repoAnswer.findOne({
      where: {
        id: id,
      },
      relations: ['user', 'question'],
    });
  }

  async createAnswer(author: string, text: string, id: number) {
    const user = await this.repoUser.findOne({
      where: { email: author },
    });

    const question = await this.repoQuestion.findOne({
      where: {
        id: id,
      },
      relations: ['user', 'answers'],
    });

    const answer = this.repoAnswer.create({
      author: author,
      text: text,
      user: user as DeepPartial<User>,
      question: question as DeepPartial<Question>,
    });

    return await this.repoAnswer.save(answer);
  }

  async updateAnswer(id: number, bodyAnswer: UpdateAnswerDto) {
    const answer = await this.repoAnswer.findOne({
      where: {
        id: id,
      },
    });

    if (!answer) {
      throw new NotFoundException('Answer not found!');
    }

    Object.assign(answer, bodyAnswer);

    return await this.repoAnswer.save(answer);
  }

  async updateUserAnswer(
    email: string,
    id: number,
    bodyAnswer: UpdateAnswerDto,
  ) {
    const user = await this.repoUser.findOne({
      relations: ['questions', 'answers'],
      where: {
        email: email,
      },
    });

    const [userAnswer] = user?.answers.filter((el) => el.id === id) as Answer[];

    if (!userAnswer) {
      throw new NotFoundException('Answer not found!');
    }

    Object.assign(userAnswer, bodyAnswer);

    return await this.repoAnswer.save(userAnswer);
  }

  async upvoteAnswer(id: number) {
    const answer = await this.repoAnswer.findOne({
      where: {
        id: id,
      },
    });

    if (!answer) {
      throw new NotFoundException('Answer not found!');
    }

    answer.rating++;

    return await this.repoAnswer.save(answer);
  }

  async downvoteAnswer(id: number) {
    const answer = await this.repoAnswer.findOne({
      where: {
        id: id,
      },
    });

    if (!answer) {
      throw new NotFoundException('Answer not found!');
    }

    answer.rating--;

    return await this.repoAnswer.save(answer);
  }

  async deleteAnswer(id: number) {
    const answer = await this.repoAnswer.findOne({
      where: {
        id: id,
      },
    });

    if (!answer) {
      throw new NotFoundException('Answer not found!');
    }

    return await this.repoAnswer.remove(answer);
  }

  async deleteUserAnswer(id: number, email: string) {
    const user = await this.repoUser.findOne({
      relations: ['questions', 'answers'],
      where: {
        email: email,
      },
    });

    const [userAnswer] = user?.answers.filter((el) => el.id === id) as Answer[];

    if (!userAnswer) {
      throw new NotFoundException('Answer not found!');
    }

    return await this.repoAnswer.remove(userAnswer);
  }
}
