import { Inject, Injectable, Logger } from '@nestjs/common';
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
import { BookType } from './types';
import {
  BookCreateDto,
  BookProgressDto,
  BookResponseDto,
  BookUpdateDto,
} from './dto';
import { WatchedType } from 'src/progress';
import { SortType } from 'src/media';
import { PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import * as schema from 'src/drizzle/schema';
import { PG_CONNECTION } from 'src/drizzle/drizzle.module';
import { ErrorsService } from 'src/errors/errors.service';

@Injectable()
export class BooksService {
  private readonly logger = new Logger(BooksService.name);
  constructor(
    @Inject(PG_CONNECTION)
    private db: PostgresJsDatabase<typeof schema>,
    private errorsService: ErrorsService,
  ) {}

  public async create(book: BookCreateDto): Promise<BookResponseDto> {
    this.logger.log('create');

    try {
      const result = await this.db
        .insert(schema.books)
        .values(book)
        .returning(schema.BookResponseObject);
      return result[0];
    } catch (error) {
      this.errorsService.internalServerError(error);
    }
  }

  public async search(query: string): Promise<BookResponseDto[]> {
    this.logger.log('search');

    try {
      const result = await this.db
        .select(schema.BookResponseObject)
        .from(schema.books)
        .where(
          sql`to_tsvector('english', ${schema.books.title.name}) @@ to_tsquery('english', ${query})`,
        );
      return result;
    } catch (error) {
      throw this.errorsService.internalServerError(error);
    }
  }

  public async getByid(id: string): Promise<BookProgressDto> {
    this.logger.log('getByid');

    try {
      const result = await this.db
        .select(schema.BookProgressObject)
        .from(schema.books)
        .where(eq(schema.books.id, id))
        .leftJoin(schema.progress, eq(schema.progress.bookId, schema.books.id));
      return result[0];
    } catch (error) {
      throw this.errorsService.internalServerError(error);
    }
  }

  public async getMany(
    limit: number,
    page?: number,
    bookType?: BookType,
    sortType?: SortType,
    watched?: WatchedType | 'rated',
  ): Promise<BookResponseDto[]> {
    this.logger.log('getMany');

    const query = this.db
      .select(schema.BookResponseObject)
      .from(schema.books)
      .leftJoin(schema.progress, eq(schema.progress.bookId, schema.books.id));

    if (bookType) query.where(eq(schema.books.type, bookType));

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
      titleAsc: asc(schema.books.title),
      titleDesc: desc(schema.books.title),
      yearAsc: asc(schema.books.year),
      yearDesc: desc(schema.books.year),
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
    bookType?: BookType,
    genres?: string[],
    fromYear?: number,
    toYear?: number,
  ): Promise<BookResponseDto[]> {
    this.logger.log('getRandom');

    const query = this.db.select(schema.BookResponseObject).from(schema.books);

    if (bookType) query.where(eq(schema.books.type, bookType));

    // toYear >= year >= fromYear
    if (fromYear && toYear)
      query.where(between(schema.books.year, fromYear, toYear));
    // year >= fromYear
    else if (fromYear) query.where(gte(schema.books.year, fromYear));
    // toYear >= year
    else query.where(lte(schema.books.year, toYear));

    if (genres && genres.length !== 0) {
      const genreSql = sql`ARRAY['${genres.join(`', '`)}']::varchar[]`;
      query.where(
        sql`${genreSql} <@ ${schema.books.genres.name} OR ${genreSql} && ${schema.books.genres.name}`,
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

  public async getGenres(bookType: BookType): Promise<string[]> {
    this.logger.log('getGenres');

    try {
      const result = await this.db
        .select({ genres: schema.books.genres })
        .from(schema.books)
        .where(eq(schema.books.type, bookType));
      return result[0].genres;
    } catch (error) {
      throw this.errorsService.internalServerError(error);
    }
  }

  public async update(
    bookId: string,
    book: BookUpdateDto,
  ): Promise<BookResponseDto> {
    this.logger.log('update');
    try {
      const result = await this.db
        .update(schema.books)
        .set(book)
        .where(eq(schema.books.id, bookId))
        .returning(schema.BookResponseObject);
      return result[0];
    } catch (error) {
      throw this.errorsService.internalServerError(error);
    }
  }

  public async embeddingSearch(
    embedding: number[],
    limit: number,
  ): Promise<BookResponseDto[]> {
    this.logger.log('embeddingSearch');
    try {
      const result = await this.db
        .select(schema.BookResponseObject)
        .from(schema.books)
        .orderBy(l2Distance(schema.books.embedding, embedding))
        .limit(limit);
      return result;
    } catch (error) {
      throw this.errorsService.internalServerError(error);
    }
  }

  public async getNearest(
    bookId: string,
    limit: number,
  ): Promise<BookResponseDto[]> {
    this.logger.log('getNearest');
    try {
      const embedding = await this.db
        .select()
        .from(schema.books)
        .where(eq(schema.books.id, bookId));
      const result = await this.db
        .select(schema.BookResponseObject)
        .from(schema.books)
        .where(not(eq(schema.books.id, bookId)))
        .orderBy(l2Distance(schema.books.embedding, embedding))
        .limit(limit);
      return result;
    } catch (error) {
      throw this.errorsService.internalServerError(error);
    }
  }

  public async delete(bookId: string): Promise<BookResponseDto> {
    this.logger.log('delete');

    try {
      const result = await this.db
        .delete(schema.books)
        .where(eq(schema.books.id, bookId))
        .returning(schema.BookResponseObject);
      return result[0];
    } catch (error) {
      throw this.errorsService.internalServerError(error);
    }
  }
}
