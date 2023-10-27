import { Inject, Injectable, Logger } from '@nestjs/common';
import MyError from 'src/utils/errors';
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
import { l2Distance } from 'pgvector/drizzle-orm';
import { ComicType, comics } from './comic.entity';
import {
  ComicCreateDto,
  ComicProgressObject,
  ComicProgressDto,
  ComicResponseDto,
  ComicResponseObject,
  ComicUpdateDto,
} from './dto';
import { WatchedType, progress } from 'src/progress';

import { SortType } from 'src/media';
import { DrizzleAsyncProvider, DrizzleSchema } from 'src/drizzle';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';

@Injectable()
export class ComicsService {
  private readonly logger = new Logger(ComicsService.name);
  private readonly error = new MyError();

  constructor(
    @Inject(DrizzleAsyncProvider)
    private readonly db: PostgresJsDatabase<typeof DrizzleSchema>,
  ) {}

  public async create(film: ComicCreateDto): Promise<ComicResponseDto> {
    this.logger.log('create');

    try {
      const result = await this.db
        .insert(comics)
        .values(film)
        .returning(ComicResponseObject);
      return result[0];
    } catch (error) {
      this.error.internalServerError(error);
    }
  }

  public async search(query: string): Promise<ComicResponseDto[]> {
    this.logger.log('search');

    try {
      const result = await this.db
        .select(ComicResponseObject)
        .from(comics)
        .where(
          sql`to_tsvector('english', ${comics.title.name}) @@ to_tsquery('english', ${query})`,
        );
      return result;
    } catch (error) {
      throw this.error.internalServerError(error);
    }
  }

  public async getByid(id: string): Promise<ComicProgressDto> {
    this.logger.log('getByid');

    try {
      const result = await this.db
        .select(ComicProgressObject)
        .from(comics)
        .where(eq(comics.id, id))
        .innerJoin(progress, eq(progress.comicId, comics.id));
      return result[0];
    } catch (error) {
      throw this.error.internalServerError(error);
    }
  }

  public async getMany(
    limit: number,
    page?: number,
    comicType?: ComicType,
    sortType?: SortType,
    watched?: WatchedType | 'rated',
  ): Promise<ComicResponseDto[]> {
    this.logger.log('getMany');

    const query = this.db
      .select(ComicResponseObject)
      .from(comics)
      .innerJoin(progress, eq(progress.comicId, comics.id));

    if (comicType) query.where(eq(comics.type, comicType));

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
      titleAsc: asc(comics.title),
      titleDesc: desc(comics.title),
      yearAsc: asc(comics.startYear),
      yearDesc: desc(comics.startYear),
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
    comicType?: ComicType,
    genres?: string[],
    fromYear?: number,
    toYear?: number,
  ): Promise<ComicResponseDto[]> {
    this.logger.log('getRandom');

    const query = this.db.select(ComicResponseObject).from(comics);

    if (comicType) query.where(eq(comics.type, comicType));

    // toYear >= year >= fromYear
    if (fromYear && toYear)
      query.where(between(comics.startYear, fromYear, toYear));
    // year >= fromYear
    else if (fromYear) query.where(gte(comics.startYear, fromYear));
    // toYear >= year
    else query.where(lte(comics.startYear, toYear));

    if (genres && genres.length !== 0) {
      const genreSql = sql`ARRAY['${genres.join(`', '`)}']::varchar[]`;
      query.where(
        sql`${genreSql} <@ ${comics.genres.name} OR ${genreSql} && ${comics.genres.name}`,
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

  public async getGenres(comicType: ComicType): Promise<string[]> {
    this.logger.log('getGenres');

    try {
      const result = await this.db
        .select({ genres: comics.genres })
        .from(comics)
        .where(eq(comics.type, comicType));
      return result[0].genres;
    } catch (error) {
      throw this.error.internalServerError(error);
    }
  }

  public async update(
    comicId: string,
    film: ComicUpdateDto,
  ): Promise<ComicResponseDto> {
    this.logger.log('update');
    try {
      const result = await this.db
        .update(comics)
        .set({ ...film })
        .where(eq(comics.id, comicId))
        .returning(ComicResponseObject);
      return result[0];
    } catch (error) {
      throw this.error.internalServerError(error);
    }
  }

  public async embeddingSearch(
    embedding: number[],
    limit: number,
  ): Promise<ComicResponseDto[]> {
    this.logger.log('embeddingSearch');
    try {
      const result = await this.db
        .select(ComicResponseObject)
        .from(comics)
        .orderBy(l2Distance(comics.embedding, embedding))
        .limit(limit);
      return result;
    } catch (error) {
      throw this.error.internalServerError(error);
    }
  }

  public async getNearest(
    comicId: string,
    limit: number,
  ): Promise<ComicResponseDto[]> {
    this.logger.log('getNearest');
    try {
      const embedding = await this.db
        .select()
        .from(comics)
        .where(eq(comics.id, comicId));
      const result = await this.db
        .select(ComicResponseObject)
        .from(comics)
        .where(not(eq(comics.id, comicId)))
        .orderBy(l2Distance(comics.embedding, embedding))
        .limit(limit);
      return result;
    } catch (error) {
      throw this.error.internalServerError(error);
    }
  }

  public async delete(comicId: string): Promise<ComicResponseDto> {
    this.logger.log('delete');

    try {
      const result = await this.db
        .delete(comics)
        .where(eq(comics.id, comicId))
        .returning(ComicResponseObject);
      return result[0];
    } catch (error) {
      throw this.error.internalServerError(error);
    }
  }
}
