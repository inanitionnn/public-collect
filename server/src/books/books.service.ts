import { Injectable, Logger } from '@nestjs/common';
import MyError from 'src/utils/errors';
import db from 'src/utils/db';
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
import { BookType, books } from './book.entity';
import {
  BookCreateDto,
  BookProgressObject,
  BookProgressDto,
  BookResponseDto,
  BookResponseObject,
  BookUpdateDto,
} from './dto';
import { WatchedType, progress } from 'src/progress';

import { SortType } from 'src/media';

@Injectable()
export class BooksService {
  private readonly logger = new Logger(BooksService.name);
  private readonly error = new MyError();

  public async create(film: BookCreateDto): Promise<BookResponseDto> {
    this.logger.log('create');

    try {
      const result = await db
        .insert(books)
        .values(film)
        .returning(BookResponseObject);
      return result[0];
    } catch (error) {
      this.error.internalServerError(error);
    }
  }

  public async search(query: string): Promise<BookResponseDto[]> {
    this.logger.log('search');

    try {
      const result = await db
        .select(BookResponseObject)
        .from(books)
        .where(
          sql`to_tsvector('english', ${books.title.name}) @@ to_tsquery('english', ${query})`,
        );
      return result;
    } catch (error) {
      throw this.error.internalServerError(error);
    }
  }

  public async getByid(id: string): Promise<BookProgressDto> {
    this.logger.log('getByid');

    try {
      const result = await db
        .select(BookProgressObject)
        .from(books)
        .where(eq(books.id, id))
        .innerJoin(progress, eq(progress.bookId, books.id));
      return result[0];
    } catch (error) {
      throw this.error.internalServerError(error);
    }
  }

  public async getMany(
    limit: number,
    page?: number,
    bookType?: BookType,
    sortType?: SortType,
    watched?: WatchedType | 'rated',
  ): Promise<BookProgressDto[]> {
    this.logger.log('getMany');

    const query = db
      .select(BookProgressObject)
      .from(books)
      .innerJoin(progress, eq(progress.bookId, books.id));

    if (bookType) query.where(eq(books.type, bookType));

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
      titleAsc: asc(books.title),
      titleDesc: desc(books.title),
      yearAsc: asc(books.year),
      yearDesc: desc(books.year),
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
    bookType?: BookType,
    genres?: string[],
    fromYear?: number,
    toYear?: number,
  ): Promise<BookResponseDto[]> {
    this.logger.log('getRandom');

    const query = db.select(BookResponseObject).from(books);

    if (bookType) query.where(eq(books.type, bookType));

    // toYear >= year >= fromYear
    if (fromYear && toYear) query.where(between(books.year, fromYear, toYear));
    // year >= fromYear
    else if (fromYear) query.where(gte(books.year, fromYear));
    // toYear >= year
    else query.where(lte(books.year, toYear));

    if (genres && genres.length !== 0) {
      const genreSql = sql`ARRAY['${genres.join(`', '`)}']::varchar[]`;
      query.where(
        sql`${genreSql} <@ ${books.genres.name} OR ${genreSql} && ${books.genres.name}`,
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
    bookId: string,
    film: BookUpdateDto,
  ): Promise<BookResponseDto> {
    this.logger.log('update');
    try {
      const result = await db
        .update(books)
        .set({ ...film })
        .where(eq(books.id, bookId))
        .returning(BookResponseObject);
      return result[0];
    } catch (error) {
      throw this.error.internalServerError(error);
    }
  }

  public async embeddingSearch(
    embedding: number[],
    limit: number,
  ): Promise<BookResponseDto[]> {
    this.logger.log('embeddingSearch');
    try {
      const result = await db
        .select(BookResponseObject)
        .from(books)
        .orderBy(l2Distance(books.embedding, embedding))
        .limit(limit);
      return result;
    } catch (error) {
      throw this.error.internalServerError(error);
    }
  }

  public async getNearest(
    bookId: string,
    limit: number,
  ): Promise<BookResponseDto[]> {
    this.logger.log('getNearest');
    try {
      const embedding = await db
        .select()
        .from(books)
        .where(eq(books.id, bookId));
      const result = await db
        .select(BookResponseObject)
        .from(books)
        .where(not(eq(books.id, bookId)))
        .orderBy(l2Distance(books.embedding, embedding))
        .limit(limit);
      return result;
    } catch (error) {
      throw this.error.internalServerError(error);
    }
  }

  public async delete(bookId: string): Promise<BookResponseDto> {
    this.logger.log('delete');

    try {
      const result = await db
        .delete(books)
        .where(eq(books.id, bookId))
        .returning(BookResponseObject);
      return result[0];
    } catch (error) {
      throw this.error.internalServerError(error);
    }
  }
}
