import {
  Body,
  Controller,
  Delete,
  Get,
  Logger,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { MediaService } from './media.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import {
  MediaCreateDto,
  MediaGenresDto,
  MediaProgressDto,
  MediaResponseArrayDto,
  MediaResponseDto,
  MediaUpdateDto,
} from './dto';
import { MediaType, SortType } from './types';
import { FilmType } from 'src/films';
import { SerieType } from 'src/series';
import { ComicType } from 'src/comics';
import { BookType } from 'src/books';
import { WatchedType } from 'src/progress';

@ApiTags('media')
@Controller('media')
export class MediaController {
  private readonly logger = new Logger(MediaController.name);
  constructor(private readonly mediaService: MediaService) {}

  //#region  Get
  @Get('/:mediaType/:id')
  @ApiOperation({
    summary: 'Get by id (one)',
  })
  async getById(
    @Param('id') id: string,
    @Param('mediaType') mediaType: MediaType,
  ): Promise<MediaProgressDto> {
    this.logger.verbose(
      `Get (/:mediaType/:id) | media type: (${mediaType}), id: (${id})`,
    );
    const result = await this.mediaService.getById({ id, mediaType });
    return result;
  }

  @Get('/embedding/:mediaType/:id')
  @ApiOperation({
    summary: 'Embedding search (many)',
  })
  async embeddingSearch(
    @Query('query') query: string,
    @Param('limit') limit: string,
    @Param('mediaType') mediaType: MediaType,
  ): Promise<MediaResponseArrayDto> {
    this.logger.verbose(
      `Get (/embedding/:mediaType/:id) | media type: (${mediaType}), limit: (${limit}), query: (${query})`,
    );
    const result = await this.mediaService.embeddingSearch({
      query,
      limit: Number(limit),
      mediaType,
    });
    return result;
  }

  @Get('/genres/:mediaType')
  @ApiOperation({
    summary: 'Get genres',
  })
  async getGenres(
    @Query('filmType') filmType: FilmType,
    @Query('serieType') serieType: SerieType,
    @Query('comicType') comicType: ComicType,
    @Query('bookType') bookType: BookType,
    @Param('mediaType') mediaType: MediaType,
  ): Promise<MediaGenresDto> {
    this.logger.verbose(
      `Get (/genres/:mediaType) | media type: (${mediaType}), type: (${
        filmType ?? serieType ?? comicType ?? bookType
      })`,
    );

    const result = await this.mediaService.getGenres({
      mediaType,
      filmType,
      bookType,
      comicType,
      serieType,
    });
    return result;
  }

  @Get('/collection/:mediaType/:limit/:page')
  @ApiOperation({
    summary: 'Get collection (many)',
  })
  async getMany(
    @Query('filmType') filmType: FilmType,
    @Query('serieType') serieType: SerieType,
    @Query('comicType') comicType: ComicType,
    @Query('bookType') bookType: BookType,
    @Query('sortType') sortType: SortType,
    @Query('watched') watched: WatchedType,
    @Param('limit') limit: string,
    @Param('page') page: string,
    @Param('mediaType') mediaType: MediaType,
  ): Promise<MediaResponseArrayDto> {
    this.logger.verbose(
      `Get (/collection/:mediaType/:limit/:page) | media type: (${mediaType}), limit: (${limit}), page: (${page}), type: (${
        filmType ?? serieType ?? comicType ?? bookType
      }), watched: (${watched}), sorted: (${serieType})`,
    );

    const result = await this.mediaService.getMany({
      limit: Number(limit),
      mediaType,
      bookType,
      comicType,
      filmType,
      page: Number(page),
      serieType,
      sortType,
      watched,
    });
    return result;
  }

  @Get('/nearest/:mediaType/:limit/:id')
  @ApiOperation({
    summary: 'Get nearest (many)',
  })
  async getNearest(
    @Param('limit') limit: string,
    @Param('id') id: string,
    @Param('mediaType') mediaType: MediaType,
  ): Promise<MediaResponseArrayDto> {
    this.logger.verbose(
      `Get (/nearest/:mediaType/:limit/:id) | media type: (${mediaType}), limit: (${limit}), id: (${id})`,
    );

    const result = await this.mediaService.getNearest({
      id,
      limit: Number(limit),
      mediaType,
    });
    return result;
  }

  @Get('/random/:mediaType/:limit')
  @ApiOperation({
    summary: 'Get random (many)',
  })
  async getRandom(
    @Query('filmType') filmType: FilmType,
    @Query('serieType') serieType: SerieType,
    @Query('comicType') comicType: ComicType,
    @Query('bookType') bookType: BookType,
    @Query('genres') genres: string,
    @Query('fromYear') fromYear: string,
    @Query('toYear') toYear: string,
    @Param('limit') limit: string,
    @Param('mediaType') mediaType: MediaType,
  ): Promise<MediaResponseArrayDto> {
    this.logger.verbose(
      `Get (/random/:mediaType/:limit) | media type: (${mediaType}), limit: (${limit}), type: (${
        filmType ?? serieType ?? comicType ?? bookType
      }), from year: (${fromYear}), to year: (${toYear}), genres: (${genres})`,
    );
    const result = await this.mediaService.getRandom({
      limit: Number(limit),
      mediaType,
      fromYear: Number(fromYear),
      toYear: Number(toYear),
      genres: genres.split(',').map((str) => str.trim()),
      bookType,
      comicType,
      filmType,
      serieType,
    });
    return result;
  }

  @Get('/search/:mediaType/:limit')
  @ApiOperation({
    summary: 'Search (many)',
  })
  async search(
    @Query('query') query: string,
    @Param('mediaType') mediaType: MediaType,
  ): Promise<MediaResponseArrayDto> {
    this.logger.verbose(
      `Get (/search/:mediaType/:limit) | media type: (${mediaType}), query: (${query})`,
    );
    const result = await this.mediaService.search({
      mediaType,
      query,
    });
    return result;
  }
  //#endregion Get

  //#region Put
  @Put('/')
  @ApiOperation({
    summary: 'Update',
  })
  async update(
    @Body() mediaUpdateDto: MediaUpdateDto,
  ): Promise<MediaResponseDto> {
    this.logger.verbose(
      `Get (/) | media type: (${mediaUpdateDto.mediaType}), id: (${mediaUpdateDto.id})`,
    );
    const result = await this.mediaService.update(mediaUpdateDto);
    return result;
  }
  //#endregion Put

  //#region Post
  @Post('/')
  @ApiOperation({
    summary: 'Create',
  })
  async create(
    @Body() mediaCreateDto: MediaCreateDto,
  ): Promise<MediaProgressDto> {
    this.logger.verbose(
      `Post (/) | media type: (${mediaCreateDto.mediaType}), media title: (${mediaCreateDto.media.title})`,
    );
    const result = await this.mediaService.create(mediaCreateDto);
    return result;
  }
  //#endregion Post

  //#region Delete
  @Delete('/:mediaType/:id')
  @ApiOperation({
    summary: 'Delete',
  })
  async delete(
    @Param('id') id: string,
    @Param('mediaType') mediaType: MediaType,
  ): Promise<MediaResponseDto> {
    this.logger.verbose(
      `Delete (/:mediaType/:id) | media type: (${mediaType}), id: (${id})`,
    );
    const result = await this.mediaService.delete({ id, mediaType });
    return result;
  }
  //#endregion Delete
}
