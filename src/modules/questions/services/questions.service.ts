import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Question } from 'src/config/type-orm/entities/question.entity';
import { User } from 'src/modules/users/entities/user.entity';
import { DeepPartial, Repository } from 'typeorm';
import { UpdateQuestionDto } from '../dtos/updateQuestion.dto';
import { QuestionQueryDto } from '../dtos/questionQuery.dto';

@Injectable()
export class QuestionsService {
  constructor(
    @InjectRepository(Question) private repoQuestion: Repository<Question>,
    @InjectRepository(User) private repoUser: Repository<User>,
  ) {}

  async getAllQuestions() {
    return await this.repoQuestion.find({
      relations: ['user', 'answers'],
    });
  }

  async findById(id: number) {
    return await this.repoQuestion.findOne({
      where: {
        id: id,
      },
      relations: ['user', 'answers'],
    });
  }

  async filterQuestionsByTag(query?: QuestionQueryDto) {
    const tags = query?.q;
    const questions = this.repoQuestion.createQueryBuilder('question');

    if (tags) {
      questions
        .andWhere('LOWER(question.tags) LIKE LOWER(:tags)', {
          tags: `%${tags}%`,
        })
        .leftJoinAndSelect('question.user', 'user')
        .leftJoinAndSelect('question.answers', 'answer')
        .orderBy('question.id', 'DESC');
    } else {
      questions
        .leftJoinAndSelect('question.user', 'user')
        .leftJoinAndSelect('question.answers', 'answer')
        .orderBy('question.id', 'DESC');
    }

    return await questions.getMany();
  }

  async createQuestion(
    author: string,
    title: string,
    description: string,
    tags: string,
  ) {
    const user = await this.repoUser.findOne({
      where: { email: author },
    });
    const question = this.repoQuestion.create({
      author: author,
      title: title,
      description: description,
      tags: tags,
      user: user as DeepPartial<User>,
    });

    return await this.repoQuestion.save(question);
  }

  async updateQuestion(id: number, bodyQuestion: UpdateQuestionDto) {
    const question = await this.repoQuestion.findOne({
      where: {
        id: id,
      },
    });

    if (!question) {
      throw new NotFoundException('Question not found!');
    }

    Object.assign(question, bodyQuestion);

    return await this.repoQuestion.save(question);
  }

  async updateUserQuestion(
    email: string,
    id: number,
    bodyQuestion: UpdateQuestionDto,
  ) {
    const user = await this.repoUser.findOne({
      relations: ['questions', 'answers'],
      where: {
        email: email,
      },
    });

    const [userQuestion] = user?.questions.filter(
      (el) => el.id === id,
    ) as Question[];

    if (!userQuestion) {
      throw new NotFoundException('Question not found!');
    }

    Object.assign(userQuestion, bodyQuestion);

    return await this.repoQuestion.save(userQuestion);
  }

  async upvoteQuestion(id: number) {
    const question = await this.repoQuestion.findOne({
      where: {
        id: id,
      },
    });

    if (!question) {
      throw new NotFoundException('Question not found!');
    }

    question.rating++;

    return await this.repoQuestion.save(question);
  }

  async downvoteQuestion(id: number) {
    const question = await this.repoQuestion.findOne({
      where: {
        id: id,
      },
    });

    if (!question) {
      throw new NotFoundException('Question not found!');
    }

    question.rating--;

    return await this.repoQuestion.save(question);
  }

  async deleteQuestion(id: number) {
    const question = await this.repoQuestion.findOne({
      where: {
        id: id,
      },
    });

    if (!question) {
      throw new NotFoundException('Question not found!');
    }

    return await this.repoQuestion.remove(question);
  }

  async deleteUserQuestion(id: number, email: string) {
    const user = await this.repoUser.findOne({
      relations: ['questions', 'answers'],
      where: {
        email: email,
      },
    });

    const [userQuestion] = user?.questions.filter(
      (el) => el.id === id,
    ) as Question[];

    if (!userQuestion) {
      throw new NotFoundException('Question not found!');
    }

    return await this.repoQuestion.remove(userQuestion);
  }
}
