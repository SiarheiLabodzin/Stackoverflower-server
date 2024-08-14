import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { User } from '../entities/user.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { NotFoundException } from '@nestjs/common';
import {
  MockUsersRepository,
  updateBody,
  userDto,
  users,
} from '../mocks/mockUsersRepository';

describe('UsersService', () => {
  let usersService: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: MockUsersRepository,
        },
      ],
    }).compile();

    usersService = module.get<UsersService>(UsersService);
  });

  it('should create a new record and return that', async () => {
    expect(
      await usersService.createUser('lll@mail.ru', 'dddd21', '2222qwe'),
    ).toEqual({
      id: expect.any(Number),
      email: 'lll@mail.ru',
      salt: '2222qwe',
      hash: 'dddd21',
      isVerified: false,
      role: 'user',
    });
  });

  it('should find a record and return that', async () => {
    expect(await usersService.findByEmail(userDto.email)).toEqual(userDto);
  });

  it('should find all records and return that', async () => {
    expect(await usersService.findAllUsers()).toEqual(users);
  });

  describe('updateUser', () => {
    it('should update a record and return that', async () => {
      expect(await usersService.updateUser(1, updateBody)).toEqual(
        Object.assign(users[0], updateBody),
      );
    });

    it('should prevent updating a record if record does not exists', async () => {
      await expect(
        usersService.updateUser(200, updateBody),
      ).rejects.toBeInstanceOf(NotFoundException);
    });
  });

  describe('deleteUser', () => {
    it('should delete a record and return that', async () => {
      expect(await usersService.deleteUser(1)).toEqual(
        users.filter((el) => el.id !== 1),
      );
    });

    it('should prevent deleting a record if record does not exists', async () => {
      await expect(usersService.deleteUser(200)).rejects.toBeInstanceOf(
        NotFoundException,
      );
    });
  });
});
