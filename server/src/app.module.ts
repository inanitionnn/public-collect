import { Module } from '@nestjs/common';
import { CacheModule } from '@nestjs/cache-manager';
import { ConfigModule } from '@nestjs/config';
import config from './utils/config/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
      validate: config,
    }),
    CacheModule.register({
      isGlobal: true,
      ttl: +process.env.CACHE_SECONDS * 1000,
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
