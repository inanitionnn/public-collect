import { Injectable, Logger } from '@nestjs/common';
import { FilesService } from 'src/files';
import { FilmsService, ZodFilmInsert } from 'src/films';
import MyError from 'src/utils/errors';
import { CreateMediaInput } from './types';
import { ZodSerieInsert } from 'src/series';
import { ZodComicInsert } from 'src/comics';
import { ZodBookInsert } from 'src/books';

@Injectable()
export class MediaService {
  private readonly logger = new Logger(MediaService.name);
  private readonly error = new MyError();
  constructor(
    private readonly filesService: FilesService,
    private readonly filmsService: FilmsService,
  ) {}

  public async create(dto: CreateMediaInput) {
    const { media, mediaType } = dto;

    try {
      switch (mediaType) {
        case 'film': {
          ZodFilmInsert.parse(media);
          break;
        }
        case 'serie': {
          ZodSerieInsert.parse(media);
          break;
        }
        case 'comic': {
          ZodComicInsert.parse(media);
          break;
        }
        case 'book': {
          ZodBookInsert.parse(media);
          break;
        }
      }
    } catch (error) {
      this.error.badRequest(error);
    }

    if (media.image) {
      media.image = await this.filesService.create(mediaType, media.image);
    }

    // media.embedding = await this.parse.embedding(JSON.stringify(media));

    try {
      switch (mediaType) {
        case 'film': {
          await this.filmsService.create(media);
          break;
        }
      }
    } catch (error) {
      this.error.internalServerError(error);
    }
  }
}
