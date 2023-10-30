import { Inject, Injectable, Logger } from '@nestjs/common';
import { SeasonCreateDto, SeasonResponseDto, SeasonUpdateDto } from './dto';
import { and, eq, inArray } from 'drizzle-orm';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import * as schema from 'src/drizzle/schema';
import { PG_CONNECTION } from 'src/drizzle/drizzle.module';
import { ErrorsService } from 'src/errors/errors.service';

@Injectable()
export class SeasonsService {
  private readonly logger = new Logger(SeasonsService.name);

  constructor(
    @Inject(PG_CONNECTION)
    private db: PostgresJsDatabase<typeof schema>,
    private readonly errorsService: ErrorsService,
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
        .insert(schema.seasons)
        .values(insertSeasons)
        .returning(schema.SeasonResponseObject);
      return result;
    } catch (error) {
      this.errorsService.internalServerError(error);
    }
  }

  public async getBySeriesId(seriesId: string): Promise<SeasonResponseDto[]> {
    this.logger.log('get');
    try {
      const result = await this.db
        .select(schema.SeasonResponseObject)
        .from(schema.seasons)
        .where(eq(schema.seasons.seriesId, seriesId));
      return result;
    } catch (error) {
      this.errorsService.internalServerError(error);
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
          .update(schema.seasons)
          .set(season)
          .where(
            and(
              eq(schema.seasons.seriesId, serieId),
              eq(schema.seasons.id, season.id),
            ),
          );
        resultSeasons.push(result[0]);
      }
    } catch (error) {
      this.errorsService.internalServerError(error);
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
        .delete(schema.seasons)
        .where(
          and(
            eq(schema.seasons.seriesId, seriesId),
            inArray(schema.seasons.id, seasonsIds),
          ),
        );

      return result;
    } catch (error) {
      this.errorsService.internalServerError(error);
    }
  }

  public async deleteBySeriesId(
    seriesId: string,
  ): Promise<SeasonResponseDto[]> {
    this.logger.log('update');
    try {
      const result = await this.db
        .delete(schema.seasons)
        .where(eq(schema.seasons.seriesId, seriesId));
      return result;
    } catch (error) {
      this.errorsService.internalServerError(error);
    }
  }
}
