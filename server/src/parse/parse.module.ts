import { Module } from '@nestjs/common';
import { ParseService } from './parse.service';
import { GptService } from './services/gpt.service';
import { ParseController } from './parse.controller';

@Module({
  providers: [ParseService, GptService],
  controllers: [ParseController],
})
export class ParseModule {}
