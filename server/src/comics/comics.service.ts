import { Inject, Injectable, Logger } from '@nestjs/common';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import {
  ComicCreateDto,
  ComicProgressDto,
  ComicResponseDto,
  ComicUpdateDto,
} from './dto';
import * as schema from 'src/drizzle/schema';
import { PG_CONNECTION } from 'src/drizzle/drizzle.module';
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
import { ComicType } from './types';
import { SortType } from 'src/media';
import { WatchedType } from 'src/progress';
import { l2Distance } from 'pgvector/drizzle-orm';
import { ErrorsService } from 'src/errors/errors.service';

@Injectable()
export class ComicsService {
  private readonly logger = new Logger(ComicsService.name);

  constructor(
    @Inject(PG_CONNECTION)
    private db: PostgresJsDatabase<typeof schema>,
    private errorsService: ErrorsService,
  ) {}

  public async create(comic: ComicCreateDto): Promise<ComicResponseDto> {
    this.logger.log('create');

    try {
      const result = await this.db
        .insert(schema.comics)
        .values(comic)
        .returning(schema.ComicResponseObject);
      return;
    } catch (error) {
      this.errorsService.internalServerError(error);
    }
  }

  public async search(query: string): Promise<ComicResponseDto[]> {
    this.logger.log('search');

    try {
      const result = await this.db
        .select(schema.ComicResponseObject)
        .from(schema.comics)
        .where(
          sql`to_tsvector('english', ${schema.comics.title.name}) @@ to_tsquery('english', ${query})`,
        );
      return result;
    } catch (error) {
      throw this.errorsService.internalServerError(error);
    }
  }

  public async getByid(id: string): Promise<ComicProgressDto> {
    this.logger.log('getByid');

    try {
      const result = await this.db
        .select(schema.ComicProgressObject)
        .from(schema.comics)
        .where(eq(schema.comics.id, id))
        .leftJoin(
          schema.progress,
          eq(schema.progress.comicId, schema.comics.id),
        );
      return result[0];
    } catch (error) {
      throw this.errorsService.internalServerError(error);
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
      .select(schema.ComicResponseObject)
      .from(schema.comics)
      .leftJoin(schema.progress, eq(schema.progress.comicId, schema.comics.id));

    if (comicType) query.where(eq(schema.comics.type, comicType));

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
      titleAsc: asc(schema.comics.title),
      titleDesc: desc(schema.comics.title),
      yearAsc: asc(schema.comics.startYear),
      yearDesc: desc(schema.comics.startYear),
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
    comicType?: ComicType,
    genres?: string[],
    fromYear?: number,
    toYear?: number,
  ): Promise<ComicResponseDto[]> {
    this.logger.log('getRandom');

    const query = this.db
      .select(schema.ComicResponseObject)
      .from(schema.comics);

    if (comicType) query.where(eq(schema.comics.type, comicType));

    // toYear >= year >= fromYear
    if (fromYear && toYear)
      query.where(between(schema.comics.startYear, fromYear, toYear));
    // year >= fromYear
    else if (fromYear) query.where(gte(schema.comics.startYear, fromYear));
    // toYear >= year
    else query.where(lte(schema.comics.startYear, toYear));

    if (genres && genres.length !== 0) {
      const genreSql = sql`ARRAY['${genres.join(`', '`)}']::varchar[]`;
      query.where(
        sql`${genreSql} <@ ${schema.comics.genres.name} OR ${genreSql} && ${schema.comics.genres.name}`,
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

  public async getGenres(comicType: ComicType): Promise<string[]> {
    this.logger.log('getGenres');

    try {
      const result = await this.db
        .select({ genres: schema.comics.genres })
        .from(schema.comics)
        .where(eq(schema.comics.type, comicType));
      return result[0].genres;
    } catch (error) {
      throw this.errorsService.internalServerError(error);
    }
  }

  public async update(
    comicId: string,
    comic: ComicUpdateDto,
  ): Promise<ComicResponseDto> {
    this.logger.log('update');
    try {
      const result = await this.db
        .update(schema.comics)
        .set(comic)
        .where(eq(schema.comics.id, comicId))
        .returning(schema.ComicResponseObject);
      return result[0];
    } catch (error) {
      throw this.errorsService.internalServerError(error);
    }
  }

  public async embeddingSearch(
    embedding: number[],
    limit: number,
  ): Promise<ComicResponseDto[]> {
    this.logger.log('embeddingSearch');
    try {
      const result = await this.db
        .select(schema.ComicResponseObject)
        .from(schema.comics)
        .orderBy(l2Distance(schema.comics.embedding, embedding))
        .limit(limit);
      return result;
    } catch (error) {
      throw this.errorsService.internalServerError(error);
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
        .from(schema.comics)
        .where(eq(schema.comics.id, comicId));
      const result = await this.db
        .select(schema.ComicResponseObject)
        .from(schema.comics)
        .where(not(eq(schema.comics.id, comicId)))
        .orderBy(l2Distance(schema.comics.embedding, embedding))
        .limit(limit);
      return result;
    } catch (error) {
      throw this.errorsService.internalServerError(error);
    }
  }

  public async delete(comicId: string): Promise<ComicResponseDto> {
    this.logger.log('delete');

    try {
      const result = await this.db
        .delete(schema.comics)
        .where(eq(schema.comics.id, comicId))
        .returning(schema.ComicResponseObject);
      return result[0];
    } catch (error) {
      throw this.errorsService.internalServerError(error);
    }
  }
}
