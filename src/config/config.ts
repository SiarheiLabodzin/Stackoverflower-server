import { Answer } from 'src/type-orm/answer.entity';
import { Question } from 'src/type-orm/question.entity';
import { User } from 'src/type-orm/user.entity';

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
});
