import { Answer } from 'src/config/type-orm/entities/answer.entity';
import { Question } from 'src/config/type-orm/entities/question.entity';
import { User } from '../modules/users/entities/user.entity';

export const config = () => ({
  redis: {
    type: 'single',
    options: {
      password: process.env.REDIS_PASSWORD,
      port: Number(process.env.REDIS_PORT),
    },
  },
  postgres: {
    type: 'postgres',
    host: process.env.POSTGRES_HOST,
    port: process.env.POSTGRES_PORT,
    username: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    database: process.env.POSTGRES_DB,
    entities: [User, Question, Answer],
    synchronize: true,
  },
  mailer: {
    transport: {
      host: process.env.MAILER_HOST,
      auth: {
        user: process.env.MAILER_USER,
        pass: process.env.MAILER_PASS,
      },
      tls: {
        rejectUnauthorized: false,
      },
    },
  },
});
