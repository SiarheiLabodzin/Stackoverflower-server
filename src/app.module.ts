import { Module } from '@nestjs/common';
import { TestRedisModule } from './modules/test-redis/test-redis.module';
import { ConfigModule } from '@nestjs/config';
import { config } from './config/config';
import { RedisConfigModule } from './config/redis/redisConfig.module';
import { TypeOrmConfigModule } from './config/type-orm/type-ormConfig.module';
import { AuthModule } from './modules/auth/auth.module';
import { MailModule } from './modules/mail/mail.module';
import { UsersModule } from './modules/users/users.module';
import { QuestionsModule } from './modules/questions/questions.module';
import { AnswersModule } from './modules/answers/answers.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
      load: [config],
    }),
    RedisConfigModule,
    TypeOrmConfigModule,
    TestRedisModule,
    AuthModule,
    UsersModule,
    MailModule,
    QuestionsModule,
    AnswersModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
