import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Question } from 'src/config/type-orm/entities/question.entity';
import { User } from 'src/modules/users/entities/user.entity';
import { DeepPartial, Repository } from 'typeorm';
import { UpdateQuestionDto } from '../dtos/updateQuestion.dto';
import { QuestionQueryDto } from '../dtos/questionQuery.dto';
import { UsersService } from 'src/modules/users/services/users.service';

@Injectable()
export class QuestionsService {
  constructor(
    @InjectRepository(Question) private repoQuestion: Repository<Question>,
    private repoUser: UsersService,
  ) {}

  async getAllQuestions() {
    return await this.repoQuestion.find({});
  }

  async findById(id: number) {
    return await this.repoQuestion.findOne({
      where: {
        id: id,
      },
    });
  }

  async filterQuestionsByTag(query?: QuestionQueryDto) {
    const tags = query?.q;
    const questions = this.repoQuestion.createQueryBuilder('question');

    if (tags) {
      questions.andWhere('LOWER(question.tags) LIKE LOWER(:tags)', {
        tags: `%${tags}%`,
      });
    }

    questions
      .leftJoinAndSelect('question.user', 'user')
      .leftJoinAndSelect('question.answers', 'answer')
      .orderBy('question.id', 'DESC');

    return await questions.getMany();
  }

  async createQuestion(
    author: string,
    title: string,
    description: string,
    tags: string,
  ) {
    const user = await this.repoUser.findByEmail(author);
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

    return await this.repoQuestion.update(id, question);
  }

  async updateUserQuestion(
    email: string,
    id: number,
    bodyQuestion: UpdateQuestionDto,
  ) {
    const user = await this.repoUser.findByEmail(email);

    if (!user) {
      throw new NotFoundException('User not found!');
    }

    const userQuestion = await this.repoQuestion.findOne({
      where: {
        id: id,
      },
    });

    if (!userQuestion) {
      throw new NotFoundException('Question not found!');
    }

    Object.assign(userQuestion, bodyQuestion);

    return await this.repoQuestion.update(id, userQuestion);
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

    return await this.repoQuestion.delete(id);
  }

  async deleteUserQuestion(id: number, email: string) {
    const user = await this.repoUser.findByEmail(email);

    if (!user) {
      throw new NotFoundException('User not found!');
    }

    const userQuestion = await this.repoQuestion.findOne({
      where: {
        id: id,
      },
    });

    if (!userQuestion) {
      throw new NotFoundException('Question not found!');
    }

    return await this.repoQuestion.delete(id);
  }
}
