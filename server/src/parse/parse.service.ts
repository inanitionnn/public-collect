import { Inject, Injectable, Logger } from '@nestjs/common';
import { Cache } from 'cache-manager';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import {
  TitleParseDto,
  TitleResponseDto,
  ImagesParseDto,
  ImagesResponseDto,
  WikiParseDto,
  WikiResponseDto,
  SearchParseDto,
  SearchResponseDto,
  FieldsParseDto,
} from './dto';
import {
  GptService,
  ImagesService,
  SearchService,
  WikiService,
} from './services';
import { validation } from 'src/utils/validation';
import { ErrorsService } from 'src/errors/errors.service';

@Injectable()
export class ParseService {
  private readonly logger = new Logger(ParseService.name);

  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private readonly gptService: GptService,
    private readonly imagesService: ImagesService,
    private readonly searchService: SearchService,
    private readonly wikiService: WikiService,
    private readonly errorsService: ErrorsService,
  ) {}

  //#region Images

  public async getImages(dto: ImagesParseDto): Promise<ImagesResponseDto> {
    this.logger.log('getImages');
    const error = await validation(ImagesParseDto, dto);
    if (error) this.errorsService.badRequest(error);
    // Cache
    const CACHE_KEY = `getImages:${dto.mediaType}:${dto.count}:${dto.query}`;
    const cache: ImagesResponseDto = await this.cacheManager.get(CACHE_KEY);
    if (cache) return cache;
    // Query
    const result = await this.imagesService.imageParse(dto);
    // Cache
    await this.cacheManager.set(CACHE_KEY, result);
    return result;
  }

  //#endregion Images

  //#region Gpt

  // Get title and year by query
  public async getTitle(dto: TitleParseDto): Promise<TitleResponseDto> {
    this.logger.log('getTitle');
    const error = await validation(TitleParseDto, dto);
    if (error) this.errorsService.badRequest(error);
    // Cache
    const CACHE_KEY = `getTitle:${dto.mediaType}:${dto.query}`;
    const cache: TitleResponseDto = await this.cacheManager.get(CACHE_KEY);
    if (cache) return cache;
    // Query
    const result = await this.gptService.getTitle(dto);
    // Cache
    await this.cacheManager.set(CACHE_KEY, result);
    return result;
  }

  // Get embedding array by query
  public async getEmbedding(query: string): Promise<number[]> {
    this.logger.log('getEmbedding');

    const result = await this.gptService.getEmbedding(query);
    return result;
  }

  // Fills in empty fields of media by keys and query
  public async fieldsParse(dto: FieldsParseDto): Promise<unknown> {
    this.logger.log('fieldsParse');
    const error = await validation(FieldsParseDto, dto);
    if (error) this.errorsService.badRequest(error);
    const result = await this.gptService.getFields(dto);
    return result;
  }

  //#endregion Gpt

  //#region Wiki

  public async wikiParse(dto: WikiParseDto): Promise<WikiResponseDto> {
    this.logger.log('wikiParse');
    const error = await validation(WikiParseDto, dto);
    if (error) this.errorsService.badRequest(error);

    const CACHE_KEY = `wikiParse:${dto.mediaType}:${dto.link}`;
    const cache: WikiResponseDto = await this.cacheManager.get(CACHE_KEY);
    if (cache) return cache;

    const result = await this.wikiService.wikiParse(dto);
    await this.cacheManager.set(CACHE_KEY, result);
    return result;
  }

  public async wikiSearch(dto: SearchParseDto): Promise<SearchResponseDto[]> {
    this.logger.log('wikiSearch');
    const error = await validation(SearchParseDto, dto);
    if (error) this.errorsService.badRequest(error);

    const CACHE_KEY = `wikiSearch:${dto.query}:${dto.count}`;
    const cache: SearchResponseDto[] = await this.cacheManager.get(CACHE_KEY);
    if (cache) return cache;
    const result = await this.searchService.searchByQuery(dto);
    await this.cacheManager.set(CACHE_KEY, result);
    return result;
  }

  //#endregion Wiki
}
