import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from '../services/users.service';
import { JwtService } from '@nestjs/jwt';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';
import {
  MockUsersRepository,
  updateBody,
  users,
} from '../mocks/mockUsersRepository';

describe('UsersController', () => {
  let usersController: UsersController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        UsersService,
        JwtService,
        {
          provide: getRepositoryToken(User),
          useValue: MockUsersRepository,
        },
      ],
    })
      .overrideProvider([UsersService, JwtService])
      .useValue(MockUsersRepository)
      .compile();

    usersController = module.get<UsersController>(UsersController);
  });

  it('should be defined', () => {
    expect(usersController).toBeDefined();
  });

  it('should return all users', async () => {
    expect(await usersController.getAllUsers()).toEqual(users);
    expect(MockUsersRepository.find).toHaveBeenCalled();
  });

  it('should update an one user', async () => {
    expect(await usersController.updateUser(updateBody, 1)).toEqual(
      Object.assign(users[0], updateBody),
    );
  });

  it('should delete an one user', async () => {
    expect(await usersController.deleteUser(1)).toEqual(
      users.filter((el) => el.id !== 1),
    );
  });
});
