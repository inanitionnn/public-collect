import { Inject, Injectable, Logger } from '@nestjs/common';
import MyError from 'src/utils/errors';
import {
  SerieCreateDto,
  SerieProgressDto,
  SerieResponseDto,
  SerieUpdateDto,
} from './dto';
import { l2Distance } from 'pgvector/drizzle-orm';
import {
  eq,
  sql,
  isNotNull,
  asc,
  desc,
  SQL,
  lte,
  gte,
  between,
  not,
} from 'drizzle-orm';
import { WatchedType } from 'src/progress';
import { SeasonsService } from 'src/seasons';
import { SortType } from 'src/media';
import * as schema from 'src/drizzle/schema';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import { PG_CONNECTION } from 'src/drizzle/drizzle.module';
import { SerieType } from './types';

@Injectable()
export class SeriesService {
  private readonly logger = new Logger(SeriesService.name);
  private readonly error = new MyError();

  constructor(
    @Inject(PG_CONNECTION)
    private db: PostgresJsDatabase<typeof schema>,
    private readonly seasonsService: SeasonsService,
  ) {}

  public async create(dto: SerieCreateDto): Promise<SerieResponseDto> {
    this.logger.log('create');
    const { seasons: _, ...other } = dto;
    try {
      const result = await this.db
        .insert(schema.series)
        .values(other)
        .returning(schema.SerieResponseObject);

      const seasons = await this.seasonsService.create(
        result[0].id,
        dto.seasons,
      );
      return { ...result[0], seasons };
    } catch (error) {
      this.error.internalServerError(error);
    }
  }

  public async search(query: string): Promise<SerieResponseDto[]> {
    this.logger.log('search');
    try {
      const result = await this.db
        .select(schema.SerieResponseObject)
        .from(schema.series)
        .where(
          sql`to_tsvector('english', ${schema.series.title.name}) @@ to_tsquery('english', ${query})`,
        );
      return result;
    } catch (error) {
      throw this.error.internalServerError(error);
    }
  }

  public async getByid(id: string): Promise<SerieProgressDto> {
    this.logger.log('getByid');
    const seasons = await this.seasonsService.getBySeriesId(id);
    try {
      const result = await this.db
        .select(schema.SerieProgressObject)
        .from(schema.series)
        .where(eq(schema.series.id, id))
        .innerJoin(
          schema.progress,
          eq(schema.progress.serieId, schema.series.id),
        );
      return {
        media: { ...result[0].media, seasons },
        progress: result[0].progress,
      };
    } catch (error) {
      throw this.error.internalServerError(error);
    }
  }

  public async getMany(
    limit: number,
    page?: number,
    serieType?: SerieType,
    sortType?: SortType,
    watched?: WatchedType | 'rated',
  ): Promise<SerieResponseDto[]> {
    this.logger.log('getMany');

    const query = this.db
      .select(schema.SerieResponseObject)
      .from(schema.series)
      .innerJoin(
        schema.progress,
        eq(schema.progress.serieId, schema.series.id),
      );

    if (serieType) query.where(eq(schema.series.type, serieType));

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
      titleAsc: asc(schema.series.title),
      titleDesc: desc(schema.series.title),
      yearAsc: asc(schema.series.startYear),
      yearDesc: desc(schema.series.startYear),
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
    serieType?: SerieType,
    genres?: string[],
    fromYear?: number,
    toYear?: number,
  ): Promise<SerieResponseDto[]> {
    this.logger.log('getRandom');

    const query = this.db
      .select(schema.SerieResponseObject)
      .from(schema.series);

    if (serieType) query.where(eq(schema.series.type, serieType));

    // toYear >= year >= fromYear
    if (fromYear && toYear)
      query.where(between(schema.series.startYear, fromYear, toYear));
    // year >= fromYear
    else if (fromYear) query.where(gte(schema.series.startYear, fromYear));
    // toYear >= year
    else query.where(lte(schema.series.startYear, toYear));

    if (genres && genres.length !== 0) {
      const genreSql = sql`ARRAY['${genres.join(`', '`)}']::varchar[]`;
      query.where(
        sql`${genreSql} <@ ${schema.series.genres.name} OR ${genreSql} && ${schema.series.genres.name}`,
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

  public async getGenres(serieType: SerieType): Promise<string[]> {
    this.logger.log('getGenres');

    try {
      const result = await this.db
        .select({ genres: schema.series.genres })
        .from(schema.series)
        .where(eq(schema.series.type, serieType));
      return result[0].genres;
    } catch (error) {
      throw this.error.internalServerError(error);
    }
  }

  public async update(
    serieId: string,
    dto: SerieUpdateDto,
  ): Promise<SerieResponseDto> {
    this.logger.log('update');

    const { seasons: newSeasons, ...otherDto } = dto;
    const seasons = await this.seasonsService.update(serieId, newSeasons);
    try {
      const result = await this.db
        .update(schema.series)
        .set(otherDto)
        .where(eq(schema.series.id, serieId))
        .returning(schema.SerieResponseObject);
      return { ...result[0], seasons };
    } catch (error) {
      throw this.error.internalServerError(error);
    }
  }

  public async embeddingSearch(
    embedding: number[],
    limit: number,
  ): Promise<SerieResponseDto[]> {
    this.logger.log('embeddingSearch');
    try {
      const result = await this.db
        .select(schema.SerieResponseObject)
        .from(schema.series)
        .orderBy(l2Distance(schema.series.embedding, embedding))
        .limit(limit);
      return result;
    } catch (error) {
      throw this.error.internalServerError(error);
    }
  }

  public async getNearest(
    serieId: string,
    limit: number,
  ): Promise<SerieResponseDto[]> {
    this.logger.log('getNearest');
    try {
      const embedding = await this.db
        .select()
        .from(schema.series)
        .where(eq(schema.series.id, serieId));
      const result = await this.db
        .select(schema.SerieResponseObject)
        .from(schema.series)
        .where(not(eq(schema.series.id, serieId)))
        .orderBy(l2Distance(schema.series.embedding, embedding))
        .limit(limit);
      return result;
    } catch (error) {
      throw this.error.internalServerError(error);
    }
  }

  public async delete(serieId: string): Promise<SerieResponseDto> {
    this.logger.log('delete');
    const seasons = await this.seasonsService.deleteBySeriesId(serieId);
    try {
      const result = await this.db
        .delete(schema.series)
        .where(eq(schema.series.id, serieId))
        .returning(schema.SerieResponseObject);
      return { ...result[0], seasons };
    } catch (error) {
      throw this.error.internalServerError(error);
    }
  }
}
