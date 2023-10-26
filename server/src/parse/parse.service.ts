import { Inject, Injectable, Logger } from '@nestjs/common';
import { GptService } from './services/gpt.service';
import { Cache } from 'cache-manager';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import MyError from 'src/utils/errors';
import { z } from 'zod';
import { GetTitleRequest, GetTitleResponse, GetFieldsRequest } from './dto';
import { getImagesRequest } from './dto/getImages.request';
import { ImagesService } from './services/images.service';

@Injectable()
export class ParseService {
  private readonly logger = new Logger(ParseService.name);
  private readonly error = new MyError();

  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private readonly gptService: GptService,
    private readonly imagesService: ImagesService,
  ) {}

  //#region Images

  public async getImages(dto: getImagesRequest): Promise<Array<string>> {
    this.logger.log('getImages');
    // Zod
    try {
      z.object({
        mediaType: z.enum(['film', 'serie', 'comic', 'book']),
        count: z.number(),
        title: z.string(),
      }).parse(dto);
    } catch (error) {
      this.error.badRequest(error);
    }
    const { count, mediaType, title } = dto;
    // Cache
    const CACHE_KEY = `getImages:${mediaType}:${count}:${title}`;
    const cache: string[] = await this.cacheManager.get(CACHE_KEY);
    if (cache) return cache;
    // Query
    const result = await this.imagesService.imageParse(mediaType, title, count);
    // Cache
    await this.cacheManager.set(CACHE_KEY, result);
    return result;
  }

  //#endregion Images

  //#region Gpt

  // Get title and year by query
  public async getTitle(dto: GetTitleRequest): Promise<GetTitleResponse> {
    this.logger.log('getTitle');
    // Zod
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
    const CACHE_KEY = `getTitle:${mediaType}:${query}`;
    const cache: GetTitleResponse = await this.cacheManager.get(CACHE_KEY);
    if (cache) return cache;
    // Query
    const result = await this.gptService.getTitle(mediaType, query);
    // Cache
    await this.cacheManager.set(CACHE_KEY, result);
    return result;
  }

  // Get embedding array by query
  public async getEmbedding(query: string): Promise<Array<number>> {
    this.logger.log('getEmbedding');
    // Zod
    try {
      z.string().min(1).parse(query);
    } catch (error) {
      throw this.error.badRequest(error);
    }
    // Query
    const result = await this.gptService.getEmbedding(query);
    return result;
  }

  // Fills in empty fields of media by keys and query
  public async getFields(dto: GetFieldsRequest): Promise<any> {
    this.logger.log('getFields');
    // Zod
    try {
      z.object({
        mediaType: z.enum(['film', 'serie', 'comic', 'book']),
        title: z.string().min(1),
        keys: z.array(z.string()).optional(),
      }).parse(dto);
    } catch (error) {
      this.error.badRequest(error);
    }
    const { mediaType, title, keys } = dto;
    // Query
    const result = await this.gptService.getFields(mediaType, title, keys);
    return result;
  }

  //#endregion Gpt

  //#region Wiki

  // public async wiki(dto: WikiParseRequest): Promise<WikiParseResponse> {
  //   this.log?.info("wikiParse");

  //   try {
  //     console.log(dto);
  //     z.object({
  //       mediaType: z.enum(["film", "serie", "comic", "book"]),
  //       link: z.string().url(),
  //     }).parse(dto);
  //   } catch (error) {
  //     throw this.error.BadRequest("wikiParse", error);
  //   }

  //   const { mediaType, link } = dto;

  //   const CACHE_KEY = `wikiParse:${mediaType}:${link}`;
  //   const cache = await this.cache.check(CACHE_KEY);
  //   if (cache) return cache;
  //   const result = await this.parse.wikiParse(mediaType, link);
  //   await this.cache.save(CACHE_KEY, result);
  //   return result;
  // }

  // public async search(
  //   dto: SearchRequest
  // ): Promise<Array<WikiSearchResponse>> {
  //   this.log?.info("wikiSearch");

  //   try {
  //     z.object({
  //       count: z.number(),
  //       query: z.string(),
  //     }).parse(dto);
  //   } catch (error) {
  //     throw this.error.BadRequest("wikiSearch", error);
  //   }

  //   const { query, count } = dto;

  //   const CACHE_KEY = `wikiSearch:${query}:${count}`;
  //   const cache = await this.cache.check(CACHE_KEY);
  //   if (cache) return cache;
  //   const result = await this.search.searchByQuery(query, count);
  //   await this.cache.save(CACHE_KEY, result);
  //   return result;
  // }

  //#endregion Wiki
}
