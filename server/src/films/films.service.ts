import { Injectable, Logger } from '@nestjs/common';
import MyError from 'src/utils/errors';
import { FilmInsert, FilmSelect, films } from './film.entity';
import db from 'src/utils/db';

@Injectable()
export class FilmsService {
  private readonly logger = new Logger(FilmsService.name);
  private readonly error = new MyError();

  public async create(
    film: FilmInsert,
  ): Promise<Omit<FilmSelect, 'embedding'>> {
    this.logger.log('create');

    try {
      const result = await db.insert(films).values(film).returning({
        id: films.id,
        type: films.type,
        title: films.title,
        year: films.year,
        country: films.country,
        description: films.description,
        directedBy: films.directedBy,
        starring: films.starring,
        language: films.language,
        runTime: films.runTime,
        boxOffice: films.boxOffice,
        budget: films.budget,
        genres: films.genres,
        tags: films.tags,
        image: films.image,
      });
      return result[0];
    } catch (error) {
      this.error.internalServerError(error);
    }
  }
}
