import { Inject, Injectable, Logger } from '@nestjs/common';
import { GptService } from './services/gpt.service';
import { Cache } from 'cache-manager';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { TitleParseRequest, TitleParseResponse } from './dto';
import MyError from 'src/utils/errors';
import { z } from 'zod';

@Injectable()
export class ParseService {
  private readonly logger = new Logger(ParseService.name);
  private readonly error = new MyError();

  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private readonly gptService: GptService,
  ) {}

  //#region Gpt

  // Get title and year by query
  public async getTitle(dto: TitleParseRequest): Promise<TitleParseResponse> {
    this.logger.log('titleParse');
    try {
      z.object({
        mediaType: z.enum(['film', 'serie', 'comic', 'book']),
        query: z.string().min(1),
      }).parse(dto);
    } catch (error) {
      this.error.badRequest(error);
    }
    const { mediaType, query } = dto;
    // Cache
    const CACHE_KEY = `titleParse:${mediaType}:${query}`;
    const cache = await this.cacheManager.get<TitleParseResponse>(CACHE_KEY);
    if (cache) return cache;
    // Query
    const result = await this.gptService.getTitle(mediaType, query);
    // Cache
    await this.cacheManager.set(CACHE_KEY, result);
    return result;
  }

  // Get embedding array by query
  public async getEmbedding(query: string): Promise<Array<number>> {
    this.logger.log('embedding');

    try {
      z.string().min(1).parse(query);
    } catch (error) {
      throw this.error.badRequest(error);
    }
    const result = await this.gptService.getEmbedding(query);
    return result;
  }

  // // Fills in empty fields of media by keys and query
  // public async getFields(dto: FieldsParseRequest): Promise<any> {
  //   this.logger.log('fieldsParse');
  //   const { mediaType, query, keys } = dto;
  //   const result = await this.gptService.getFields(mediaType, query, keys);
  //   return result;
  // }

  //#endregion Gpt
}
