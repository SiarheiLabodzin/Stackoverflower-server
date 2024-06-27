import { Module } from '@nestjs/common';
import { TestRedisController } from './test-redis.controller';

@Module({
  controllers: [TestRedisController]
})
export class TestRedisModule {}
