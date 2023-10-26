import { Module } from '@nestjs/common';
import { ParseService } from './parse.service';
import { GptService } from './services/gpt.service';
import { ParseController } from './parse.controller';
import { ImagesService } from './services/images.service';
import { WikiService } from './services/wiki.service';
import { SearchService } from './services/search.service';

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
