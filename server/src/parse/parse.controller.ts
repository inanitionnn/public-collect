import { Controller, Get, Logger, Param, Query } from '@nestjs/common';
import { ParseService } from './parse.service';
import { TitleParseResponse } from './dto';
import { MediaType } from 'src/media/types';

@Controller('parse')
export class ParseController {
  private readonly logger = new Logger(ParseController.name);
  constructor(private readonly parseService: ParseService) {}

  @Get('title/:mediaType')
  async getTitle(
    @Query('query') query: string,
    @Param('mediaType') mediaType: MediaType,
  ): Promise<TitleParseResponse> {
    this.logger.verbose(
      `/title | mediaType: (${mediaType}), query: (${query})`,
    );
    const result = await this.parseService.getTitle({ query, mediaType });
    return result;
  }
}
