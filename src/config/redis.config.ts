import { ConfigService } from '@nestjs/config';
import { Injectable } from '@nestjs/common';
import { RedisModuleOptionsFactory } from '@nestjs-modules/ioredis';

@Injectable()
export class RedisConfig implements RedisModuleOptionsFactory {
  constructor(private configService: ConfigService) {}

  async createRedisModuleOptions() {
    const redis = await this.configService.get('redis');
    console.log(redis);
    return await redis;
  }
}
