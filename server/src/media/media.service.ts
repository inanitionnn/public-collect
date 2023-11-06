import { Inject, Injectable, Logger } from '@nestjs/common';
import { FilesService } from 'src/files';
import { FilmCreateDto, FilmUpdateDto, FilmsService } from 'src/films';
import { ComicCreateDto, ComicUpdateDto, ComicsService } from 'src/comics';
import {
  MediaCreateDto,
  MediaEmbeddingDto,
  MediaGenresDto,
  MediaGetDto,
  MediaGetGenresDto,
  MediaGetManyDto,
  MediaGetNearestDto,
  MediaGetRandomDto,
  MediaProgressDto,
  MediaResponseArrayDto,
  MediaResponseDto,
  MediaSearchDto,
  MediaUpdateDto,
} from './dto';
import { ParseService } from 'src/parse/parse.service';
import { BookCreateDto, BookUpdateDto, BooksService } from 'src/books';
import { SerieCreateDto, SerieUpdateDto, SeriesService } from 'src/series';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { validation } from 'src/utils/validation';
import { ErrorsService } from 'src/errors/errors.service';
import { ProgressService } from 'src/progress';

@Injectable()
export class MediaService {
  private readonly logger = new Logger(MediaService.name);
  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private readonly filesService: FilesService,
    private readonly parseService: ParseService,
    private readonly filmsService: FilmsService,
    private readonly seriesService: SeriesService,
    private readonly comicsService: ComicsService,
    private readonly booksService: BooksService,
    private readonly errorsService: ErrorsService,
    private readonly progressService: ProgressService,
  ) {}

  // TODO collections and Orders
  //  TODO add delete and update to Progress
  // TODO update image

  public async create(dto: MediaCreateDto): Promise<MediaProgressDto> {
    this.logger.log('create');

    const error = await validation(MediaCreateDto, dto);
    if (error) this.errorsService.badRequest(error);
    const { media, mediaType, progress } = dto;

    if (media.image) {
      media.image = await this.filesService.create(mediaType, media.image);
    }

    media.embedding = await this.parseService.getEmbedding(
      JSON.stringify(media),
    );

    try {
      const progressResult = await this.progressService.create(progress);
      switch (mediaType) {
        case 'film': {
          const film = media as FilmCreateDto;
          const mediaResult = await this.filmsService.create(film);
          return { media: { media: mediaResult, progress: progressResult } };
        }
        case 'serie': {
          const serie = media as SerieCreateDto;
          const mediaResult = await this.seriesService.create(serie);
          return { media: { media: mediaResult, progress: progressResult } };
        }
        case 'comic': {
          const comic = media as ComicCreateDto;
          const mediaResult = await this.comicsService.create(comic);
          return { media: { media: mediaResult, progress: progressResult } };
        }
        case 'book': {
          const book = media as BookCreateDto;
          const mediaResult = await this.booksService.create(book);
          return { media: { media: mediaResult, progress: progressResult } };
        }
      }
    } catch (error) {
      this.errorsService.internalServerError(error);
    }
  }

  public async search(dto: MediaSearchDto): Promise<MediaResponseArrayDto> {
    this.logger.log('search');
    const error = await validation(MediaSearchDto, dto);
    if (error) this.errorsService.badRequest(error);
    const { mediaType, query } = dto;
    let result: MediaResponseArrayDto['media'];

    const CACHE_KEY = `search:${mediaType}:${query}`;
    result = await this.cacheManager.get(CACHE_KEY);
    if (result) return { media: result };

    try {
      switch (mediaType) {
        case 'film': {
          result = await this.filmsService.search(query);
          break;
        }
        case 'serie': {
          result = await this.seriesService.search(query);
          break;
        }
        case 'comic': {
          result = await this.comicsService.search(query);
          break;
        }
        case 'book': {
          result = await this.booksService.search(query);
          break;
        }
      }
    } catch (error) {
      this.errorsService.internalServerError(error);
    }

    await this.cacheManager.set(CACHE_KEY, result);

    return { media: result };
  }

  public async getById(dto: MediaGetDto): Promise<MediaProgressDto> {
    this.logger.log('getByid');
    const error = await validation(MediaGetDto, dto);
    if (error) this.errorsService.badRequest(error);
    const { mediaType, id } = dto;

    let result: MediaProgressDto['media'];

    const CACHE_KEY = `getByid:${mediaType}:${id}`;
    result = await this.cacheManager.get(CACHE_KEY);
    if (result) return { media: result };

    try {
      switch (mediaType) {
        case 'film': {
          result = await this.filmsService.getByid(id);
          break;
        }
        case 'serie': {
          result = await this.seriesService.getByid(id);
          break;
        }
        case 'comic': {
          result = await this.comicsService.getByid(id);
          break;
        }
        case 'book': {
          result = await this.booksService.getByid(id);
          break;
        }
      }
    } catch (error) {
      this.errorsService.internalServerError(error);
    }
    if (!result) {
      this.errorsService.notFound('Media not found');
    }

    await this.cacheManager.set(CACHE_KEY, result);

    return { media: result };
  }

  public async getMany(dto: MediaGetManyDto): Promise<MediaResponseArrayDto> {
    this.logger.log('getMany');
    const error = await validation(MediaGetManyDto, dto);
    if (error) this.errorsService.badRequest(error);
    const {
      mediaType,
      limit,
      bookType,
      comicType,
      filmType,
      page,
      serieType,
      sortType,
      watched,
    } = dto;

    let result: MediaResponseArrayDto['media'];

    const CACHE_KEY = `getMany:${mediaType}:${limit}:${page}:${sortType}:${watched}:${filmType}:${serieType}:${comicType}:${bookType}`;
    result = await this.cacheManager.get(CACHE_KEY);
    if (result) return { media: result };

    try {
      switch (mediaType) {
        case 'film': {
          result = await this.filmsService.getMany(
            limit,
            page,
            filmType,
            sortType,
            watched,
          );
          break;
        }
        case 'serie': {
          result = await this.seriesService.getMany(
            limit,
            page,
            serieType,
            sortType,
            watched,
          );
          break;
        }
        case 'comic': {
          result = await this.comicsService.getMany(
            limit,
            page,
            comicType,
            sortType,
            watched,
          );
          break;
        }
        case 'book': {
          result = await this.booksService.getMany(
            limit,
            page,
            bookType,
            sortType,
            watched,
          );
          break;
        }
      }
    } catch (error) {
      this.errorsService.internalServerError(error);
    }

    await this.cacheManager.set(CACHE_KEY, result);

    return { media: result };
  }

  public async getRandom(
    dto: MediaGetRandomDto,
  ): Promise<MediaResponseArrayDto> {
    this.logger.log('getRandom');
    const error = await validation(MediaGetRandomDto, dto);
    if (error) this.errorsService.badRequest(error);
    const {
      mediaType,
      bookType,
      comicType,
      filmType,
      serieType,
      limit,
      fromYear,
      genres,
      toYear,
    } = dto;

    let result: MediaResponseArrayDto['media'];

    const CACHE_KEY = `getRandom:${mediaType}:${limit}:${fromYear}:${toYear}:${genres}:${filmType}:${serieType}:${comicType}:${bookType}`;
    result = await this.cacheManager.get(CACHE_KEY);
    if (result) return { media: result };

    try {
      switch (mediaType) {
        case 'film': {
          result = await this.filmsService.getRandom(
            limit,
            filmType,
            genres,
            fromYear,
            toYear,
          );
          break;
        }
        case 'serie': {
          result = await this.seriesService.getRandom(
            limit,
            serieType,
            genres,
            fromYear,
            toYear,
          );
          break;
        }
        case 'comic': {
          result = await this.comicsService.getRandom(
            limit,
            comicType,
            genres,
            fromYear,
            toYear,
          );
          break;
        }
        case 'book': {
          result = await this.booksService.getRandom(
            limit,
            bookType,
            genres,
            fromYear,
            toYear,
          );
          break;
        }
      }
    } catch (error) {
      this.errorsService.internalServerError(error);
    }

    await this.cacheManager.set(CACHE_KEY, result);

    return { media: result };
  }

  public async getGenres(dto: MediaGetGenresDto): Promise<MediaGenresDto> {
    this.logger.log('getGenres');
    const error = await validation(MediaGetGenresDto, dto);
    if (error) this.errorsService.badRequest(error);
    const { mediaType, bookType, comicType, filmType, serieType } = dto;

    let result: MediaGenresDto['genres'];

    const CACHE_KEY = `getGenres:${mediaType}:${filmType}:${serieType}:${comicType}:${bookType}`;
    result = await this.cacheManager.get(CACHE_KEY);
    if (result) return { genres: result };

    try {
      switch (mediaType) {
        case 'film': {
          result = await this.filmsService.getGenres(filmType);
          break;
        }
        case 'serie': {
          result = await this.seriesService.getGenres(serieType);
          break;
        }
        case 'comic': {
          result = await this.comicsService.getGenres(comicType);
          break;
        }
        case 'book': {
          result = await this.booksService.getGenres(bookType);
          break;
        }
      }
    } catch (error) {
      this.errorsService.internalServerError(error);
    }

    await this.cacheManager.set(CACHE_KEY, result);

    return { genres: result };
  }

  public async embeddingSearch(
    dto: MediaEmbeddingDto,
  ): Promise<MediaResponseArrayDto> {
    this.logger.log('embeddingSearch');
    const error = await validation(MediaEmbeddingDto, dto);
    if (error) this.errorsService.badRequest(error);
    const { mediaType, limit, query } = dto;

    let result: MediaResponseArrayDto['media'];

    const CACHE_KEY = `embeddingSearch:${mediaType}:${limit}:${query}`;
    result = await this.cacheManager.get(CACHE_KEY);
    if (result) return { media: result };

    const embedding = await this.parseService.getEmbedding(query);

    try {
      switch (mediaType) {
        case 'film': {
          result = await this.filmsService.embeddingSearch(embedding, limit);
          break;
        }
        case 'serie': {
          result = await this.seriesService.embeddingSearch(embedding, limit);
          break;
        }
        case 'comic': {
          result = await this.comicsService.embeddingSearch(embedding, limit);
          break;
        }
        case 'book': {
          result = await this.booksService.embeddingSearch(embedding, limit);
          break;
        }
      }
    } catch (error) {
      this.errorsService.internalServerError(error);
    }

    await this.cacheManager.set(CACHE_KEY, result);

    return { media: result };
  }

  public async getNearest(
    dto: MediaGetNearestDto,
  ): Promise<MediaResponseArrayDto> {
    this.logger.log('getNearest');
    const error = await validation(MediaGetNearestDto, dto);
    if (error) this.errorsService.badRequest(error);
    const { mediaType, limit, id } = dto;

    let result: MediaResponseArrayDto['media'];

    const CACHE_KEY = `getNearest:${mediaType}:${limit}:${id}`;
    result = await this.cacheManager.get(CACHE_KEY);
    if (result) return { media: result };

    try {
      switch (mediaType) {
        case 'film': {
          result = await this.filmsService.getNearest(id, limit);
          break;
        }
        case 'serie': {
          result = await this.seriesService.getNearest(id, limit);
          break;
        }
        case 'comic': {
          result = await this.comicsService.getNearest(id, limit);
          break;
        }
        case 'book': {
          result = await this.booksService.getNearest(id, limit);
          break;
        }
      }
    } catch (error) {
      this.errorsService.internalServerError(error);
    }

    await this.cacheManager.set(CACHE_KEY, result);

    return { media: result };
  }

  public async delete(dto: MediaGetDto): Promise<MediaResponseDto> {
    this.logger.log('delete');
    const error = await validation(MediaGetDto, dto);
    if (error) this.errorsService.badRequest(error);
    const { mediaType, id } = dto;

    let result: MediaResponseDto['media'];

    try {
      switch (mediaType) {
        case 'film': {
          result = await this.filmsService.delete(id);
          break;
        }
        case 'serie': {
          result = await this.seriesService.delete(id);
          break;
        }
        case 'comic': {
          result = await this.comicsService.delete(id);
          break;
        }
        case 'book': {
          result = await this.booksService.delete(id);
          break;
        }
      }
    } catch (error) {
      this.errorsService.internalServerError(error);
    }

    return { media: result };
  }

  public async update(dto: MediaUpdateDto): Promise<MediaResponseDto> {
    this.logger.log('update');
    const error = await validation(MediaUpdateDto, dto);
    if (error) this.errorsService.badRequest(error);
    const { mediaType, id, media } = dto;

    let result: MediaResponseDto['media'];

    // todo image update
    // todo embedding update

    try {
      switch (mediaType) {
        case 'film': {
          const film = media as FilmUpdateDto;
          result = await this.filmsService.update(id, film);
          break;
        }
        case 'serie': {
          const serie = media as SerieUpdateDto;
          result = await this.seriesService.update(id, serie);
          break;
        }
        case 'comic': {
          const comic = media as ComicUpdateDto;
          result = await this.comicsService.update(id, comic);
          break;
        }
        case 'book': {
          const book = media as BookUpdateDto;
          result = await this.booksService.update(id, book);
          break;
        }
      }
    } catch (error) {
      this.errorsService.internalServerError(error);
    }

    return { media: result };
  }
}
