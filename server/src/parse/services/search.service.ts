import { Injectable, Logger } from '@nestjs/common';
import axios from 'axios';
import { load } from 'cheerio';
import { SearchParseDto, SearchResponseDto } from '../dto';
import { ErrorsService } from 'src/errors/errors.service';

@Injectable()
export class SearchService {
  private readonly logger = new Logger(SearchService.name);
  constructor(private errorsService: ErrorsService) {}

  //#region Private

  // Throw error if query is not english
  private isEngTextCheck(input: string) {
    const notEnglishRegex = /[^\u0000-\u007F…–‘’“”]/;
    const isNotEnglish = notEnglishRegex.test(input);
    if (isNotEnglish) {
      this.errorsService.badRequest('Please use English');
    }
  }

  // Takes image link by wiki url
  private async getImage(link: string) {
    try {
      const response = await axios.get(link);
      const body = response.data;
      const $ = load(body);
      const imageTag = $('.infobox-image img');

      if (imageTag.length > 0) {
        const imageUrl = imageTag.attr('src');
        return imageUrl;
      }

      return null;
    } catch (error) {
      return null;
    }
  }

  //#endregion Private

  // Takes results of Wikipedia search results
  public async searchByQuery(
    dto: SearchParseDto,
  ): Promise<SearchResponseDto[]> {
    this.logger.log(`searchByQuery`);
    const { count, query } = dto;
    // this.isEngTextCheck(query);

    const url = `https://en.wikipedia.org/w/index.php?title=Special:Search&limit=20&offset=0&ns0=1&search=${encodeURIComponent(
      query,
    )}`;
    try {
      const response = await axios.get(url);

      if (response.status !== 200) {
        this.errorsService.internalServerError('Parse error');
      }

      const body = await response.data;
      const $ = load(body);
      const $listItems = $('ul.mw-search-results li');

      const results = [];

      for (let i = 0; i < count; i++) {
        const $element = $($listItems[i]);
        const url = $element.find('a').attr('href');

        if (!url) {
          continue;
        }
        const title = $element.find('a').text();
        const description = $element.find('.searchresult').text();
        const link = `https://en.wikipedia.org${url}`;
        const image = await this.getImage(link);

        results.push({
          link,
          image,
          title,
          description,
        });
      }

      if (!results.length) {
        this.errorsService.notFound('Not found wiki pages by this url');
      }

      return results;
    } catch (error) {
      this.errorsService.internalServerError('Parse error');
    }
  }
}
