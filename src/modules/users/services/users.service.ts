import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UpdateBodyDto } from 'src/modules/auth/index.dto';
import { User } from '../entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private repo: Repository<User>) {}

  async createUser(email: string, hash: string, salt: string) {
    const user = this.repo.create({
      email,
      salt,
      hash,
    });

    return await this.repo.save(user);
  }

  findRelationUser() {
    return this.repo.find({ relations: ['questions'] });
  }

  async findByEmail(email: string) {
    return await this.repo.findOne({
      where: { email },
    });
  }

  async findAllUsers() {
    return await this.repo.find({});
  }

  async updateUser(id: number, bodyUser: UpdateBodyDto) {
    const user = await this.repo.findOne({
      where: {
        id: id,
      },
    });

    if (!user) {
      throw new NotFoundException('User not found!');
    }

    Object.assign(user, bodyUser);

    return await this.repo.save(user);
  }

  async deleteUser(id: number) {
    const user = await this.repo.findOne({
      where: {
        id: id,
      },
    });

    if (!user) {
      throw new NotFoundException('User not found!');
    }

    return await this.repo.remove(user);
  }
}
