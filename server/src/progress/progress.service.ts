import { Inject, Injectable, Logger } from '@nestjs/common';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import { PG_CONNECTION } from 'src/drizzle/drizzle.module';
import * as schema from 'src/drizzle/schema';
import { ErrorsService } from 'src/errors/errors.service';
import {
  ProgressCreateDto,
  ProgressDeleteDto,
  ProgressResponseDto,
} from './dto';
import { eq } from 'drizzle-orm';

@Injectable()
export class ProgressService {
  private readonly logger = new Logger(ProgressService.name);
  constructor(
    @Inject(PG_CONNECTION)
    private db: PostgresJsDatabase<typeof schema>,
    private errorsService: ErrorsService,
  ) {}

  public async create(dto: ProgressCreateDto): Promise<ProgressResponseDto> {
    this.logger.log('create');
    try {
      const result = await this.db
        .insert(schema.progress)
        .values(dto)
        .returning(schema.ProgressResponseObject);
      return result[0];
    } catch (error) {
      this.errorsService.internalServerError(error);
    }
  }

  public async delete(dto: ProgressDeleteDto): Promise<ProgressResponseDto> {
    this.logger.log('create');
    const query = this.db.delete(schema.progress);
    switch (dto.mediaType) {
      case 'film': {
        query.where(eq(schema.progress.filmId, dto.filmId));
        break;
      }
      case 'serie': {
        query.where(eq(schema.progress.serieId, dto.serieId));
        break;
      }
      case 'comic': {
        query.where(eq(schema.progress.comicId, dto.comicId));
        break;
      }
      case 'book': {
        query.where(eq(schema.progress.bookId, dto.bookId));
        break;
      }
    }
    try {
      const result = await query.returning(schema.ProgressResponseObject);
      return result[0];
    } catch (error) {
      this.errorsService.internalServerError(error);
    }
  }
}
