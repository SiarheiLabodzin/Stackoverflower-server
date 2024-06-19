import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TestRedisModule } from './test-redis/test-redis.module';
import { ConfigModule } from '@nestjs/config';
import { config } from './config/config';
import { RedisConfigModule } from './redis/redisConfig.module';
import { TypeOrmConfigModule } from './type-orm/type-ormConfig.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { MailModule } from './mail/mail.module';

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
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
