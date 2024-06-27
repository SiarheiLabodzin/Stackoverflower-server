import { Module } from '@nestjs/common';
import { RedisModule } from '@nestjs-modules/ioredis';
import { ConfigModule } from '@nestjs/config';
import { RedisConfig } from './redis.config';

@Module({
  imports: [
    RedisModule.forRootAsync({
      imports: [ConfigModule],
      useClass: RedisConfig,
    }),
  ],
})
export class RedisConfigModule {}
