import { Injectable, Logger } from '@nestjs/common';
import MyError from 'src/utils/errors';
import {
  SerieCreateDto,
  SerieProgressDto,
  SerieProgressObject,
  SerieResponseDto,
  SerieResponseObject,
  SerieUpdateDto,
} from './dto';
import { SerieType, series } from './series.entity';
import { l2Distance } from 'pgvector/drizzle-orm';
import db from 'src/utils/db';
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
import { WatchedType, progress } from 'src/progress';
import { SeasonsService } from 'src/seasons';
import { SortType } from 'src/media';

@Injectable()
export class SeriesService {
  private readonly logger = new Logger(SeriesService.name);
  private readonly error = new MyError();

  constructor(private readonly seasonsService: SeasonsService) {}

  public async create(dto: SerieCreateDto): Promise<SerieResponseDto> {
    this.logger.log('create');
    const { seasons: _, ...other } = dto;
    try {
      const result = await db
        .insert(series)
        .values(other)
        .returning(SerieResponseObject);

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
      const result = await db
        .select(SerieResponseObject)
        .from(series)
        .where(
          sql`to_tsvector('english', ${series.title.name}) @@ to_tsquery('english', ${query})`,
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
      const result = await db
        .select(SerieProgressObject)
        .from(series)
        .where(eq(series.id, id))
        .innerJoin(progress, eq(progress.serieId, series.id));
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

    const query = db
      .select(SerieResponseObject)
      .from(series)
      .innerJoin(progress, eq(progress.serieId, series.id));

    if (serieType) query.where(eq(series.type, serieType));

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
      titleAsc: asc(series.title),
      titleDesc: desc(series.title),
      yearAsc: asc(series.startYear),
      yearDesc: desc(series.startYear),
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

    const query = db.select(SerieResponseObject).from(series);

    if (serieType) query.where(eq(series.type, serieType));

    // toYear >= year >= fromYear
    if (fromYear && toYear)
      query.where(between(series.startYear, fromYear, toYear));
    // year >= fromYear
    else if (fromYear) query.where(gte(series.startYear, fromYear));
    // toYear >= year
    else query.where(lte(series.startYear, toYear));

    if (genres && genres.length !== 0) {
      const genreSql = sql`ARRAY['${genres.join(`', '`)}']::varchar[]`;
      query.where(
        sql`${genreSql} <@ ${series.genres.name} OR ${genreSql} && ${series.genres.name}`,
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

  public async update(
    serieId: string,
    dto: SerieUpdateDto,
  ): Promise<SerieResponseDto> {
    this.logger.log('update');

    const { seasons: newSeasons, ...otherDto } = dto;
    const seasons = await this.seasonsService.update(serieId, newSeasons);
    try {
      const result = await db
        .update(series)
        .set(otherDto)
        .where(eq(series.id, serieId))
        .returning(SerieResponseObject);
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
      const result = await db
        .select(SerieResponseObject)
        .from(series)
        .orderBy(l2Distance(series.embedding, embedding))
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
      const embedding = await db
        .select()
        .from(series)
        .where(eq(series.id, serieId));
      const result = await db
        .select(SerieResponseObject)
        .from(series)
        .where(not(eq(series.id, serieId)))
        .orderBy(l2Distance(series.embedding, embedding))
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
      const result = await db
        .delete(series)
        .where(eq(series.id, serieId))
        .returning(SerieResponseObject);
      return { ...result[0], seasons };
    } catch (error) {
      throw this.error.internalServerError(error);
    }
  }
}
