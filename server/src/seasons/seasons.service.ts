import { Inject, Injectable, Logger } from '@nestjs/common';
import MyError from 'src/utils/errors';
import { seasons } from './seasons.entity';
import {
  SeasonCreateDto,
  SeasonResponseDto,
  SeasonResponseObject,
  SeasonUpdateDto,
} from './dto';
import { and, eq, inArray } from 'drizzle-orm';
import { DrizzleAsyncProvider, DrizzleSchema } from 'src/drizzle';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';

@Injectable()
export class SeasonsService {
  private readonly logger = new Logger(SeasonsService.name);
  private readonly error = new MyError();

  constructor(
    @Inject(DrizzleAsyncProvider)
    private readonly db: PostgresJsDatabase<typeof DrizzleSchema>,
  ) {}

  public async create(
    seriesId: string,
    seasonsDto: SeasonCreateDto[],
  ): Promise<SeasonResponseDto[]> {
    this.logger.log('create');

    const insertSeasons = seasonsDto.map((season) => {
      return { ...season, seriesId };
    });

    try {
      const result = await this.db
        .insert(seasons)
        .values(insertSeasons)
        .returning(SeasonResponseObject);
      return result;
    } catch (error) {
      this.error.internalServerError(error);
    }
  }

  public async getBySeriesId(seriesId: string): Promise<SeasonResponseDto[]> {
    this.logger.log('get');
    try {
      const result = await this.db
        .select(SeasonResponseObject)
        .from(seasons)
        .where(eq(seasons.seriesId, seriesId));
      return result;
    } catch (error) {
      this.error.internalServerError(error);
    }
  }

  public async update(
    serieId: string,
    seasonsDto: SeasonUpdateDto[],
  ): Promise<SeasonResponseDto[]> {
    this.logger.log('update');

    const oldSeasons = await this.getBySeriesId(serieId);
    const seasonsNumber = oldSeasons.map((s) => s.number);
    const deleteSeasonNumbers = seasonsNumber.filter(
      (n) => !seasonsDto.map((s) => s.number).includes(n),
    );
    const deleteSeasonsIds = oldSeasons
      .filter((s) => deleteSeasonNumbers.includes(s.number))
      .map((s) => s.id);
    if (deleteSeasonsIds.length) {
      await this.delete(serieId, deleteSeasonsIds);
    }

    const resultSeasons: SeasonResponseDto[] = [];

    const createSeasons = seasonsDto.filter(
      (s) => !seasonsNumber.includes(s.number),
    );
    if (createSeasons.length) {
      const createdSeasons = await this.create(serieId, createSeasons);
      for (const season of createdSeasons) {
        resultSeasons.push(season);
      }
    }

    const updateSeasons = seasonsDto.filter(
      (s) =>
        seasonsNumber.includes(s.number) &&
        !deleteSeasonNumbers.includes(s.number),
    );
    try {
      for (const season of updateSeasons) {
        const result = await this.db
          .update(seasons)
          .set(season)
          .where(and(eq(seasons.seriesId, serieId), eq(seasons.id, season.id)));
        resultSeasons.push(result[0]);
      }
    } catch (error) {
      this.error.internalServerError(error);
    }
    return resultSeasons.sort((a, b) => a.number - b.number);
  }

  public async delete(
    seriesId: string,
    seasonsIds: string[],
  ): Promise<SeasonResponseDto[]> {
    this.logger.log('delete');

    try {
      const result = await this.db
        .delete(seasons)
        .where(
          and(eq(seasons.seriesId, seriesId), inArray(seasons.id, seasonsIds)),
        );

      return result;
    } catch (error) {
      this.error.internalServerError(error);
    }
  }

  public async deleteBySeriesId(
    seriesId: string,
  ): Promise<SeasonResponseDto[]> {
    this.logger.log('update');
    try {
      const result = await this.db
        .delete(seasons)
        .where(eq(seasons.seriesId, seriesId));
      return result;
    } catch (error) {
      this.error.internalServerError(error);
    }
  }
}
