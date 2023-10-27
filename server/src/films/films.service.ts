import { Inject, Injectable, Logger } from '@nestjs/common';
import { FilmType, films } from './film.entity';
import {
  FilmCreateDto,
  FilmProgressDto,
  FilmProgressObject,
  FilmResponseDto,
  FilmResponseObject,
  FilmUpdateDto,
} from './dto';
import MyError from 'src/utils/errors';
import { WatchedType, progress } from 'src/progress';
import {
  eq,
  sql,
  isNotNull,
  asc,
  desc,
  between,
  gte,
  lte,
  not,
  SQL,
} from 'drizzle-orm';
import { SortType } from 'src/media';
import { l2Distance } from 'pgvector/drizzle-orm';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import { DrizzleAsyncProvider, DrizzleSchema } from 'src/drizzle';

@Injectable()
export class FilmsService {
  private readonly logger = new Logger(FilmsService.name);
  private readonly error = new MyError();

  constructor(
    @Inject(DrizzleAsyncProvider)
    private readonly db: PostgresJsDatabase<typeof DrizzleSchema>,
  ) {}

  public async create(film: FilmCreateDto): Promise<FilmResponseDto> {
    this.logger.log('create');
    try {
      const result = await this.db
        .insert(films)
        .values(film)
        .returning(FilmResponseObject);
      return result[0];
    } catch (error) {
      this.error.internalServerError(error);
    }
  }

  public async search(query: string): Promise<FilmResponseDto[]> {
    this.logger.log('search');

    try {
      const result = await this.db
        .select(FilmResponseObject)
        .from(films)
        .where(
          sql`to_tsvector('english', ${films.title.name}) @@ to_tsquery('english', ${query})`,
        );
      return result;
    } catch (error) {
      throw this.error.internalServerError(error);
    }
  }

  public async getByid(id: string): Promise<FilmProgressDto> {
    this.logger.log('getByid');

    try {
      const result = await this.db
        .select(FilmProgressObject)
        .from(films)
        .where(eq(films.id, id))
        .innerJoin(progress, eq(progress.filmId, films.id));
      return result[0];
    } catch (error) {
      throw this.error.internalServerError(error);
    }
  }

  public async getMany(
    limit: number,
    page?: number,
    filmType?: FilmType,
    sortType?: SortType,
    watched?: WatchedType | 'rated',
  ): Promise<FilmResponseDto[]> {
    this.logger.log('getMany');

    const query = this.db
      .select(FilmResponseObject)
      .from(films)
      .innerJoin(progress, eq(progress.filmId, films.id));

    if (filmType) query.where(eq(films.type, filmType));

    if (watched === 'rated') {
      query.where(isNotNull(progress.rate));
    } else if (watched) {
      query.where(eq(progress.watched, watched));
    }

    const sortConditions: Record<SortType, SQL<unknown>> = {
      dateAsc: asc(progress.createdAt),
      dateDesc: desc(progress.createdAt),
      rateAsc: asc(progress.rate),
      rateDesc: desc(progress.rate),
      titleAsc: asc(films.title),
      titleDesc: desc(films.title),
      yearAsc: asc(films.year),
      yearDesc: desc(films.year),
    };

    if (sortType && sortConditions[sortType]) {
      query.orderBy(sortConditions[sortType]);
    }

    query.limit(limit);

    if (page) query.offset(page * limit);

    try {
      const result = await query;
      return result;
    } catch (error) {
      throw this.error.internalServerError(error);
    }
  }

  public async getRandom(
    limit: number,
    filmType?: FilmType,
    genres?: string[],
    fromYear?: number,
    toYear?: number,
  ): Promise<FilmResponseDto[]> {
    this.logger.log('getRandom');

    const query = this.db.select(FilmResponseObject).from(films);

    if (filmType) query.where(eq(films.type, filmType));

    // toYear >= year >= fromYear
    if (fromYear && toYear) query.where(between(films.year, fromYear, toYear));
    // year >= fromYear
    else if (fromYear) query.where(gte(films.year, fromYear));
    // toYear >= year
    else query.where(lte(films.year, toYear));

    if (genres && genres.length !== 0) {
      const genreSql = sql`ARRAY['${genres.join(`', '`)}']::varchar[]`;
      query.where(
        sql`${genreSql} <@ ${films.genres.name} OR ${genreSql} && ${films.genres.name}`,
      );
    }
    query.orderBy(sql`RANDOM()`).limit(limit);

    try {
      const result = await query;
      return result;
    } catch (error) {
      throw this.error.internalServerError(error);
    }
  }

  public async getGenres(filmType: FilmType): Promise<string[]> {
    this.logger.log('getGenres');

    try {
      const result = await this.db
        .select({ genres: films.genres })
        .from(films)
        .where(eq(films.type, filmType));
      return result[0].genres;
    } catch (error) {
      throw this.error.internalServerError(error);
    }
  }

  public async update(
    filmId: string,
    film: FilmUpdateDto,
  ): Promise<FilmResponseDto> {
    this.logger.log('update');
    try {
      const result = await this.db
        .update(films)
        .set({ ...film })
        .where(eq(films.id, filmId))
        .returning(FilmResponseObject);
      return result[0];
    } catch (error) {
      throw this.error.internalServerError(error);
    }
  }

  public async embeddingSearch(
    embedding: number[],
    limit: number,
  ): Promise<FilmResponseDto[]> {
    this.logger.log('embeddingSearch');
    try {
      const result = await this.db
        .select(FilmResponseObject)
        .from(films)
        .orderBy(l2Distance(films.embedding, embedding))
        .limit(limit);
      return result;
    } catch (error) {
      throw this.error.internalServerError(error);
    }
  }

  public async getNearest(
    filmId: string,
    limit: number,
  ): Promise<FilmResponseDto[]> {
    this.logger.log('getNearest');
    try {
      const embedding = await this.db
        .select()
        .from(films)
        .where(eq(films.id, filmId));
      const result = await this.db
        .select(FilmResponseObject)
        .from(films)
        .where(not(eq(films.id, filmId)))
        .orderBy(l2Distance(films.embedding, embedding))
        .limit(limit);
      return result;
    } catch (error) {
      throw this.error.internalServerError(error);
    }
  }

  public async delete(filmId: string): Promise<FilmResponseDto> {
    this.logger.log('delete');

    try {
      const result = await this.db
        .delete(films)
        .where(eq(films.id, filmId))
        .returning(FilmResponseObject);
      return result[0];
    } catch (error) {
      throw this.error.internalServerError(error);
    }
  }
}
