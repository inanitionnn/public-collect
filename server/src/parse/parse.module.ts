import { Module } from '@nestjs/common';
import { ParseService } from './parse.service';
import { ParseController } from './parse.controller';
import {
  GptService,
  ImagesService,
  SearchService,
  WikiService,
} from './services';

@Module({
  exports: [ParseService],
  providers: [
    ParseService,
    GptService,
    ImagesService,
    WikiService,
    SearchService,
  ],
  controllers: [ParseController],
})
export class ParseModule {}
