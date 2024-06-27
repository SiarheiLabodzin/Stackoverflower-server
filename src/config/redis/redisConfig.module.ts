import { Module } from '@nestjs/common';
import { RedisModule } from '@nestjs-modules/ioredis';
import { RedisConfig } from 'src/config/redis.config';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    RedisModule.forRootAsync({
      imports: [ConfigModule],
      useClass: RedisConfig,
    }),
  ],
})
export class RedisConfigModule {}
