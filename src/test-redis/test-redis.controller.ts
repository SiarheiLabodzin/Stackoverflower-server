import { InjectRedis } from '@nestjs-modules/ioredis';
import { Controller, Get } from '@nestjs/common';
import { Redis } from 'ioredis';

@Controller('test-redis')
export class TestRedisController {
  constructor(@InjectRedis() private readonly redis: Redis) {}

  @Get()
  async getHello() {
    await this.redis.set('key2', 'Redis wow2 data!');
    const redisData = await this.redis.get('key');
    return { redisData };
  }
}
