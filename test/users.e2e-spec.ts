import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../src/modules/users/entities/user.entity';
import { Question } from '../src/config/type-orm/entities/question.entity';
import { AuthGuard } from '@src/libs/auth/guards/authToken.guard';
import { AuthRoleGuard } from '@src/libs/auth/guards/auth-role.guard';
import { MockAuthGuard } from './guards/authRole.guard';
import { MockAuthRoleGuard } from './guards/authToken.guard';

describe('UsersController (e2e)', () => {
  let app: INestApplication;
  let userRepository: Repository<User>;
  let questionRepository: Repository<Question>;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideGuard(AuthGuard)
      .useClass(MockAuthGuard)
      .overrideGuard(AuthRoleGuard)
      .useClass(MockAuthRoleGuard)
      .compile();

    app = moduleFixture.createNestApplication();
    userRepository = moduleFixture.get<Repository<User>>(
      getRepositoryToken(User),
    );
    questionRepository = moduleFixture.get<Repository<Question>>(
      getRepositoryToken(Question),
    );
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  beforeEach(async () => {
    await questionRepository.delete({});
    await userRepository.delete({});
  });

  it('/users/get-all-users (GET)', async () => {
    // Arrange
    const user = userRepository.create({
      email: 'test@example.com',
      hash: 'hashedpassword',
      salt: 'somesalt',
    });
    await userRepository.save(user);

    // Act
    const response = await request(app.getHttpServer()).get(
      '/users/get-all-users',
    );

    // Assert
    expect(response.status).toBe(200);
    expect(response.body).toHaveLength(1);
    expect(response.body[0].email).toBe('test@example.com');
  });

  it('/users/get-user-with-relation (GET)', async () => {
    // Arrange
    const user = userRepository.create({
      email: 'test@example.com',
      hash: 'hashedpassword',
      salt: 'somesalt',
    });
    const savedUser = await userRepository.save(user);

    const question = questionRepository.create({
      title: 'Sample Question',
      description: 'Sample Content',
      user: savedUser,
      author: savedUser.email,
      tags: 'tags',
    });
    await questionRepository.save(question);

    // Act
    const response = await request(app.getHttpServer()).get(
      '/users/get-user-with-relation',
    );

    // Assert
    expect(response.status).toBe(200);
    expect(response.body).toHaveLength(1);
    expect(response.body[0].email).toBe('test@example.com');
    expect(response.body[0].questions).toHaveLength(1);
    expect(response.body[0].questions[0].title).toBe('Sample Question');
  });

  it('/users/update-user/:id (PATCH)', async () => {
    // Arrange
    const user = userRepository.create({
      email: 'test@example.com',
      hash: 'hashedpassword',
      salt: 'somesalt',
    });
    await userRepository.save(user);

    const updateData = { email: 'updated@example.com' };

    // Act
    const response = await request(app.getHttpServer())
      .patch(`/users/update-user/${user.id}`)
      .send(updateData);

    // Assert
    expect(response.status).toBe(200);
    expect(response.body.email).toBe('updated@example.com');

    const updatedUser = await userRepository.findOne({
      where: { email: 'test@example.com' },
    });
    expect(updatedUser).toBeNull();

    const newUser = await userRepository.findOne({
      where: { email: 'updated@example.com' },
    });
    expect(newUser).not.toBeNull();
    expect(newUser?.email).toBe('updated@example.com');
  });

  it('/users/delete-user/:id (DELETE)', async () => {
    // Arrange
    const user = userRepository.create({
      email: 'test@example.com',
      hash: 'hashedpassword',
      salt: 'somesalt',
    });
    await userRepository.save(user);

    // Act
    const response = await request(app.getHttpServer()).delete(
      `/users/delete-user/${user.id}`,
    );

    // Assert
    expect(response.status).toBe(200);

    const deletedUser = await userRepository.findOne({
      where: { id: user.id },
    });
    expect(deletedUser).toBeNull();
  });
});
