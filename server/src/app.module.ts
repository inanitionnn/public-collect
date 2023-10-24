import { Module } from '@nestjs/common';
import { CacheModule } from '@nestjs/cache-manager';
import { ConfigModule } from '@nestjs/config';
import { FilmsModule } from './films/films.module';
import { OrdersModule } from './orders/orders.module';
import { CollectionsModule } from './collections/collections.module';
import { ProgressModule } from './progress/progress.module';
import { SeriesModule } from './series/series.module';
import { ComicsModule } from './comics/comics.module';
import { BooksModule } from './books/books.module';
import { MediaModule } from './media/media.module';
import { FilesModule } from './files/files.module';
import { SeasonsModule } from './seasons/seasons.module';
import { ParseModule } from './parse/parse.module';
import config from './utils/config';
import type { RedisClientOptions } from 'redis';
import * as redisStore from 'cache-manager-redis-store';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
      validate: config,
    }),
    CacheModule.register<RedisClientOptions>({
      store: redisStore,
      isGlobal: true,
      ttl: +process.env.CACHE_SECONDS * 1000,
    }),
    FilmsModule,
    OrdersModule,
    CollectionsModule,
    ProgressModule,
    SeriesModule,
    ComicsModule,
    BooksModule,
    MediaModule,
    FilesModule,
    SeasonsModule,
    ParseModule,
  ],
  controllers: [],
})
export class AppModule {}
