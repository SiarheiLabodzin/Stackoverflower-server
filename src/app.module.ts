import { Module } from '@nestjs/common';
import { TestRedisModule } from './test-redis/test-redis.module';
import { ConfigModule } from '@nestjs/config';
import { config } from './config/config';
import { RedisConfigModule } from './redis/redisConfig.module';
import { TypeOrmConfigModule } from './type-orm/type-ormConfig.module';
import { AuthModule } from './auth/modules/auth.module';
import { UsersModule } from './users/modules/users.module';
import { MailModule } from './mail/modules/mail.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [config],
    }),
    RedisConfigModule,
    TypeOrmConfigModule,
    TestRedisModule,
    AuthModule,
    UsersModule,
    MailModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
