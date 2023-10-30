import { Inject, Injectable, Logger } from '@nestjs/common';
import { FilmType } from './types';
import {
  FilmCreateDto,
  FilmProgressDto,
  FilmResponseDto,
  FilmUpdateDto,
} from './dto';
import { WatchedType } from 'src/progress';
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
import * as schema from 'src/drizzle/schema';
import { PG_CONNECTION } from 'src/drizzle/drizzle.module';
import { ErrorsService } from 'src/errors/errors.service';

@Injectable()
export class FilmsService {
  private readonly logger = new Logger(FilmsService.name);
  constructor(
    @Inject(PG_CONNECTION)
    private db: PostgresJsDatabase<typeof schema>,
    private errorsService: ErrorsService,
  ) {}

  public async create(film: FilmCreateDto): Promise<FilmResponseDto> {
    this.logger.log('create');
    try {
      const result = await this.db
        .insert(schema.films)
        .values(film)
        .returning(schema.FilmResponseObject);
      return result[0];
    } catch (error) {
      this.errorsService.internalServerError(error);
    }
  }

  public async search(query: string): Promise<FilmResponseDto[]> {
    this.logger.log('search');

    try {
      const result = await this.db
        .select(schema.FilmResponseObject)
        .from(schema.films)
        .where(
          sql`to_tsvector('english', ${schema.films.title.name}) @@ to_tsquery('english', ${query})`,
        );
      return result;
    } catch (error) {
      throw this.errorsService.internalServerError(error);
    }
  }

  public async getByid(id: string): Promise<FilmProgressDto> {
    this.logger.log('getByid');

    try {
      const result = await this.db
        .select(schema.FilmProgressObject)
        .from(schema.films)
        .where(eq(schema.films.id, id))
        .leftJoin(schema.progress, eq(schema.progress.filmId, schema.films.id));
      console.log(result[0]);
      return result[0];
    } catch (error) {
      throw this.errorsService.internalServerError(error);
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
      .select(schema.FilmResponseObject)
      .from(schema.films)
      .leftJoin(schema.progress, eq(schema.progress.filmId, schema.films.id));

    if (filmType) query.where(eq(schema.films.type, filmType));

    if (watched === 'rated') {
      query.where(isNotNull(schema.progress.rate));
    } else if (watched) {
      query.where(eq(schema.progress.watched, watched));
    }

    const sortConditions: Record<SortType, SQL<unknown>> = {
      dateAsc: asc(schema.progress.createdAt),
      dateDesc: desc(schema.progress.createdAt),
      rateAsc: asc(schema.progress.rate),
      rateDesc: desc(schema.progress.rate),
      titleAsc: asc(schema.films.title),
      titleDesc: desc(schema.films.title),
      yearAsc: asc(schema.films.year),
      yearDesc: desc(schema.films.year),
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
      throw this.errorsService.internalServerError(error);
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

    const query = this.db.select(schema.FilmResponseObject).from(schema.films);

    if (filmType) query.where(eq(schema.films.type, filmType));

    // toYear >= year >= fromYear
    if (fromYear && toYear)
      query.where(between(schema.films.year, fromYear, toYear));
    // year >= fromYear
    else if (fromYear) query.where(gte(schema.films.year, fromYear));
    // toYear >= year
    else query.where(lte(schema.films.year, toYear));

    if (genres && genres.length !== 0) {
      const genreSql = sql`ARRAY['${genres.join(`', '`)}']::varchar[]`;
      query.where(
        sql`${genreSql} <@ ${schema.films.genres.name} OR ${genreSql} && ${schema.films.genres.name}`,
      );
    }
    query.orderBy(sql`RANDOM()`).limit(limit);

    try {
      const result = await query;
      return result;
    } catch (error) {
      throw this.errorsService.internalServerError(error);
    }
  }

  public async getGenres(filmType: FilmType): Promise<string[]> {
    this.logger.log('getGenres');

    try {
      const result = await this.db
        .select({ genres: schema.films.genres })
        .from(schema.films)
        .where(eq(schema.films.type, filmType));
      return result[0].genres;
    } catch (error) {
      throw this.errorsService.internalServerError(error);
    }
  }

  public async update(
    filmId: string,
    film: FilmUpdateDto,
  ): Promise<FilmResponseDto> {
    this.logger.log('update');
    try {
      const result = await this.db
        .update(schema.films)
        .set({ ...film })
        .where(eq(schema.films.id, filmId))
        .returning(schema.FilmResponseObject);
      return result[0];
    } catch (error) {
      throw this.errorsService.internalServerError(error);
    }
  }

  public async embeddingSearch(
    embedding: number[],
    limit: number,
  ): Promise<FilmResponseDto[]> {
    this.logger.log('embeddingSearch');
    try {
      const result = await this.db
        .select(schema.FilmResponseObject)
        .from(schema.films)
        .orderBy(l2Distance(schema.films.embedding, embedding))
        .limit(limit);
      return result;
    } catch (error) {
      throw this.errorsService.internalServerError(error);
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
        .from(schema.films)
        .where(eq(schema.films.id, filmId));
      const result = await this.db
        .select(schema.FilmResponseObject)
        .from(schema.films)
        .where(not(eq(schema.films.id, filmId)))
        .orderBy(l2Distance(schema.films.embedding, embedding))
        .limit(limit);
      return result;
    } catch (error) {
      throw this.errorsService.internalServerError(error);
    }
  }

  public async delete(filmId: string): Promise<FilmResponseDto> {
    this.logger.log('delete');

    try {
      const result = await this.db
        .delete(schema.films)
        .where(eq(schema.films.id, filmId))
        .returning(schema.FilmResponseObject);
      return result[0];
    } catch (error) {
      throw this.errorsService.internalServerError(error);
    }
  }
}
