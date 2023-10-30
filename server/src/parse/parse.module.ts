import { Module } from '@nestjs/common';
import { ParseService } from './parse.service';
import { ParseController } from './parse.controller';
import {
  GptService,
  ImagesService,
  SearchService,
  WikiService,
} from './services';
import { ErrorsModule } from 'src/errors/errors.module';

@Module({
  imports: [ErrorsModule],
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
