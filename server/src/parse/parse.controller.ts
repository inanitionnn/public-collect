import { Controller, Get, Logger, Param, Query } from '@nestjs/common';
import { ParseService } from './parse.service';
import { MediaType } from 'src/media/types';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { WikiResponseDto } from './dto';

@ApiTags('parse')
@Controller('parse')
export class ParseController {
  private readonly logger = new Logger(ParseController.name);
  constructor(private readonly parseService: ParseService) {}

  // //#region Gpt
  // @Get('title/:mediaType')
  // @ApiOperation({
  //   summary: 'Remember title and year in English',
  //   description: 'Using GPT',
  // })
  // @ApiResponse({
  //   type: GetTitleResponse,
  //   description: 'Returns the name and year in English',
  // })
  // async getTitle(
  //   @Query('query') query: string,
  //   @Param('mediaType') mediaType: MediaType,
  // ): Promise<GetTitleResponse> {
  //   this.logger.verbose(
  //     `/title | mediaType: (${mediaType}), query: (${query})`,
  //   );
  //   const result = await this.parseService.getTitle({ query, mediaType });
  //   return result;
  // }

  // @Get('fields/:mediaType')
  // @ApiOperation({
  //   summary: 'Fills in empty fields ',
  //   description:
  //     'Using Gpt. At the input, it gets all the fields you want to overwrite. In our case, the empty fields are (Tag, genre and plot fields are always included).',
  // })
  // async getFields(
  //   @Query('title') title: string,
  //   @Query('keys') keys: string,
  //   @Param('mediaType') mediaType: MediaType,
  // ): Promise<unknown> {
  //   this.logger.verbose(
  //     `/title | mediaType: (${mediaType}), title: (${title}), keys: (${keys})`,
  //   );
  //   const keyArr = keys.split(',').map((key) => key.trim());
  //   const result = await this.parseService.getFields({
  //     title,
  //     mediaType,
  //     keys: keyArr,
  //   });
  //   return result;
  // }
  // //#endregion Gpt

  // //#region Images
  // @Get('images/:count/:mediaType')
  // @ApiOperation({
  //   summary: 'Get posters/covers by query',
  //   description: 'Using Google API',
  // })
  // @ApiResponse({
  //   type: GetTitleResponse,
  //   description: 'Returns the list of image urls.',
  // })
  // async getImages(
  //   @Query('title') title: string,
  //   @Param('count') count: number,
  //   @Param('mediaType') mediaType: MediaType,
  // ): Promise<string[]> {
  //   this.logger.verbose(
  //     `/title | mediaType: (${mediaType}), query: (${title}), count: (${count})`,
  //   );
  //   const result = await this.parseService.getImages({
  //     title,
  //     mediaType,
  //     count: Number(count),
  //   });
  //   return result;
  // }
  // //#endregion Images

  //#region Wiki
  @Get('wiki/:mediaType')
  @ApiOperation({
    summary: 'Get media info',
    description: 'Using wiki parser',
  })
  @ApiResponse({
    type: WikiResponseDto,
    description: 'Returns parsed media',
  })
  async wikiParse(
    @Query('link') link: string,
    @Param('mediaType') mediaType: MediaType,
  ): Promise<WikiResponseDto> {
    this.logger.verbose(
      `/wiki/:mediaType | mediaType: (${mediaType}), link: (${link})`,
    );
    const result = await this.parseService.wikiParse({
      link,
      mediaType,
    });
    return result;
  }
  //#endregion Wiki
}
