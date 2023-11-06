import { Controller, Get, Logger, Param, Query } from '@nestjs/common';
import { ParseService } from './parse.service';
import { MediaType } from 'src/media/types';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import {
  ImagesResponseDto,
  SearchResponseDto,
  TitleResponseDto,
  WikiResponseDto,
} from './dto';

@ApiTags('parse')
@Controller('parse')
export class ParseController {
  private readonly logger = new Logger(ParseController.name);
  constructor(private readonly parseService: ParseService) {}

  //#region Gpt
  @Get('title')
  @ApiOperation({
    summary: 'Gpt Title Parse',
    description: 'Remember title and year in English',
  })
  async getTitle(@Query('query') query: string): Promise<TitleResponseDto> {
    this.logger.verbose(`Get (/title) |  query: (${query})`);
    const result = await this.parseService.getTitle({ query });
    return result;
  }

  @Get('fields/:mediaType')
  @ApiOperation({
    summary: 'Gpt Fields parse ',
    description:
      'Gets all the fields of media you want to overwrite. In our case, the empty fields are. (Tag, genre and plot fields are always included).',
  })
  async fieldsParse(
    @Query('title') title: string,
    @Query('keys') keys: string,
    @Param('mediaType') mediaType: MediaType,
  ): Promise<unknown> {
    this.logger.verbose(
      `Get (/fields/:mediaType/:gptModel) | media type: (${mediaType}), title: (${title}), keys: (${keys})`,
    );
    const keyArr = keys.split(',').map((key) => key.trim());
    const result = await this.parseService.fieldsParse({
      title,
      mediaType,
      keys: keyArr,
    });
    return result;
  }
  //#endregion Gpt

  //#region Images
  @Get('images/:mediaType/:count')
  @ApiOperation({
    summary: 'Google Image Search',
    description: 'Get posters/covers by query',
  })
  async getImages(
    @Query('query') query: string,
    @Param('count') count: number,
    @Param('mediaType') mediaType: MediaType,
  ): Promise<ImagesResponseDto> {
    this.logger.verbose(
      `Get (/images/:mediaType/:count) | media type: (${mediaType}), query: (${query}), count: (${count})`,
    );
    const result = await this.parseService.getImages({
      query,
      mediaType,
      count: Number(count),
    });
    return result;
  }
  //#endregion Images

  //#region Wiki
  @Get('wiki/:mediaType')
  @ApiOperation({
    summary: 'Wiki parse',
    description: 'Parse media info by url',
  })
  async wikiParse(
    @Query('link') link: string,
    @Param('mediaType') mediaType: MediaType,
  ): Promise<WikiResponseDto> {
    this.logger.verbose(
      `Get (/wiki/:mediaType) | media type: (${mediaType}), link: (${link})`,
    );
    const result = await this.parseService.wikiParse({
      link,
      mediaType,
    });
    return result;
  }

  @Get('wiki/search/:mediaType/:count')
  @ApiOperation({
    summary: 'Wiki Search',
    description: 'Search wiki pages by query',
  })
  async wikiSearch(
    @Query('query') query: string,
    @Param('count') count: string,
    @Param('mediaType') mediaType: MediaType,
  ): Promise<SearchResponseDto[]> {
    this.logger.verbose(
      `Get (/wiki/search/:mediaType/:count) | query: (${query}), media type: (${mediaType}) ,count: (${count})`,
    );
    const result = await this.parseService.wikiSearch({
      query,
      mediaType,
      count: Number(count),
    });
    return result;
  }
  //#endregion Wiki
}
