import { Inject, Injectable, Logger } from '@nestjs/common';
import MyError from 'src/utils/errors';
import { FilesService } from 'src/files';
import { FilmCreateDto, FilmsService } from 'src/films';
import { ComicCreateDto, ComicsService } from 'src/comics';
import { MediaCreateDto, MediaResponseDto } from './dto';
import { ParseService } from 'src/parse/parse.service';
import { BookCreateDto, BooksService } from 'src/books';
import { SerieCreateDto, SeriesService } from 'src/series';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

@Injectable()
export class MediaService {
  private readonly logger = new Logger(MediaService.name);
  private readonly error = new MyError();
  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private readonly filesService: FilesService,
    private readonly parseService: ParseService,
    private readonly filmsService: FilmsService,
    private readonly seriesService: SeriesService,
    private readonly comicsService: ComicsService,
    private readonly booksService: BooksService,
  ) {}

  public async create(dto: MediaCreateDto): Promise<MediaResponseDto> {
    this.logger.log('create');
    const { media, mediaType } = dto;

    if (media.image) {
      media.image = await this.filesService.create(mediaType, media.image);
    }

    media.embedding = await this.parseService.getEmbedding(
      JSON.stringify(media),
    );

    try {
      switch (mediaType) {
        case 'film': {
          const film: FilmCreateDto = media;
          const result = await this.filmsService.create(film);
          return { media: result };
        }
        case 'serie': {
          const serie: SerieCreateDto = media;
          const result = await this.seriesService.create(serie);
          return { media: result };
        }
        case 'comic': {
          const comic: ComicCreateDto = media;
          const result = await this.comicsService.create(comic);
          return { media: result };
        }
        case 'book': {
          const book: BookCreateDto = media;
          const result = await this.booksService.create(book);
          return { media: result };
        }
      }
    } catch (error) {
      this.error.internalServerError(error);
    }
  }
}
