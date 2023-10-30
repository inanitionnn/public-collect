import { Injectable, Logger } from '@nestjs/common';
import { Keywords } from '../constants';
import { FilmType, FilmWikiDto } from 'src/films';
import { SerieType, SerieWikiDto } from 'src/series';
import { BookType, BookWikiDto } from 'src/books';
import { ComicType, ComicWikiDto } from 'src/comics';
import { SeasonWikiDto } from 'src/seasons';
import { WikiParseDto, WikiResponseDto } from '../dto';
import { ErrorsService } from 'src/errors/errors.service';
const wtf = require('wtf_wikipedia');
wtf.extend(require('wtf-plugin-summary'));
wtf.extend(require('wtf-plugin-classify'));

@Injectable()
export class WikiService {
  private readonly logger = new Logger(WikiService.name);
  constructor(private errorsService: ErrorsService) {}
  //#region Description

  private async getDescription(data: any): Promise<string | null> {
    const plotKeywords = Keywords.PLOT;

    for (const keyword of plotKeywords) {
      const plotSection = data.section(keyword);
      if (!plotSection) {
        continue;
      }
      const paragraphs = plotSection.paragraphs();
      if (paragraphs[0]) {
        return paragraphs[0].text();
      } else if (paragraphs[1]) {
        return paragraphs[1].text();
      }
    }

    const firstParagraph = data.paragraphs()[0].text();
    if (firstParagraph) return firstParagraph;

    return null;
  }

  //#endregion Description

  //#region Genres, Tags and Types

  private extractCategories(data: any) {
    const wikiCategories: string[] = data.categories();
    const filterByKeywords = (array: string[], keywords: string[]) => {
      return keywords.filter((keyword) => {
        const regex = new RegExp(
          `(\\b${keyword}*(es|s?)\\b)|(\\b${keyword}*(?:y|ies)\\b)`,
          'i',
        );
        return array.some((element) => regex.test(element));
      });
    };

    // clear from 'noir' when have 'neo-noir
    const removeDuplicates = (array: string[]): string[] => {
      const duplicates = array.filter((element) => {
        const regex = new RegExp(`.${element}|${element}.`, 'i');
        return array.some((g) => regex.test(g));
      });
      return array.filter((genre) => !duplicates.includes(genre));
    };

    const allGenres = Keywords.GENRES.concat(
      Keywords.SUB_GENRES,
      Keywords.ANIME_GENRES,
      Keywords.BOOK_GENRES,
      Keywords.SERIES_GENRES,
    );
    const allTags = Keywords.TAGS;
    const allTypes = Keywords.TYPES;

    const genres = removeDuplicates(
      filterByKeywords(wikiCategories, allGenres),
    );
    const tags = removeDuplicates(filterByKeywords(wikiCategories, allTags));
    const types = filterByKeywords(wikiCategories, allTypes);

    return { genres, tags, types };
  }

  //#endregion Genres, Tags and Types

  //#region Years

  private getRangeYear(infobox: any, data: any) {
    const regex = /\b\d{4}\b/g;
    const extractYear = (text: string) => {
      const match = text.match(regex);
      return match ? parseInt(match[0]) : null;
    };

    let startYear: number | null = extractYear(data.section()?.text());
    let endYear: number | null = null;

    if (!infobox) return { startYear, endYear };

    const { first, first_aired, last, last_aired, date, startyr, endyr } =
      infobox.json();
    if (first) startYear = extractYear(first.text);
    if (first_aired) startYear = extractYear(first_aired.text);
    if (last) endYear = extractYear(last.text);
    if (last_aired) endYear = extractYear(last_aired.text);
    if (date) {
      const matches = date.text.match(regex);
      startYear = matches ? parseInt(matches[0]) : null;
      endYear = matches && matches.length > 1 ? parseInt(matches[1]) : null;
    }
    if (startyr) startYear = startyr.number;
    if (endyr) endYear = endyr.number;

    return { startYear, endYear };
  }

  //#endregion Years

  //#region Check

  // checks if link routes to english wiki
  private isEngWikiLinkCheck(link: string) {
    const linkRegex = /^(http|https):\/\/en\.wikipedia\.org\/wiki\/[^ "]+$/;
    return linkRegex.test(link);
  }

  // checks if it is a media page
  private checkSummary(data: any): boolean {
    try {
      const summaryData = data.summary().toLowerCase();
      const checkKeywords = [
        'media franchise',
        ...Keywords.BOOK_GENRES,
        ...Keywords.TYPES,
        ...Keywords.GENRES,
        ...Keywords.ANIME_GENRES,
      ];

      return checkKeywords.some((keyword) => summaryData.includes(keyword));
    } catch (err) {
      return false;
    }
  }
  // checks if it is a media page
  private checkClassify(data: any): boolean {
    try {
      const classifyData = data.classify();
      const obj = classifyData?.details;

      const checkTypes = [
        '/Creation/CreativeWork/Film',
        '/Creation/CreativeWork/Book',
        '/Creation/CreativeWork/TVShow',
      ];

      const hasMatchingType = (items: any[]) => {
        return items.some(
          (item) => item?.type && checkTypes.includes(item.type),
        );
      };

      return (
        obj &&
        (hasMatchingType(obj.infobox) ||
          hasMatchingType(obj.template) ||
          hasMatchingType(obj.section) ||
          hasMatchingType(obj.title) ||
          hasMatchingType(obj.description) ||
          hasMatchingType(obj.category))
      );
    } catch (err) {
      return false;
    }
  }
  //#endregion Check

  //#region Type

  private getFilmType(types: any): FilmType {
    if (types.includes('anime')) return 'anime';

    if (types.includes('animated') || types.includes('cartoon')) {
      return 'animated';
    }

    return 'movie';
  }

  private getSeriesType(types: any): SerieType {
    if (types.includes('anime')) return 'anime';

    if (types.includes('animated')) return 'animated';

    return 'tv';
  }

  private getBookType(types: any): BookType {
    if (types.includes('non-fiction')) return 'nonFiction';

    return 'fiction';
  }

  private getComicsType(types: any): ComicType {
    if (['manga', 'anime', 'manhwa'].some((type) => types.includes(type))) {
      return 'manga';
    }
    return 'comic';
  }

  //#endregion Type

  //#region Infobox

  private extractInfobox(infobox: any, data: any) {
    const removeParentheses = (text: string) => {
      return text.replace(/\([^)]*\)/g, '').trim();
    };

    const extractTextArray = (text: string): string[] => {
      const cleanedText = removeParentheses(text);
      const result = cleanedText.includes('\n\n')
        ? cleanedText.split('\n\n')
        : cleanedText.includes('\n')
        ? cleanedText.split('\n')
        : [cleanedText];
      return result.map((element) => element.trim());
    };

    let title: string = data.title();
    let directedBy: string[] = [];
    let author: string[] = [];
    let pages: number | null = null;
    let volumes: number | null = null;
    let runTime: number | null = null;
    let starring: string[] = [];
    let country: string[] = [];
    let language: string[] = [];
    let budget = '';
    let boxOffice = '';

    if (infobox) {
      const {
        name: infoName,
        title: infoTitle,
        author: infoAuthor,
        writer: infoWriter,
        writers: infoWriters,
        issues: infoIssues,
        volumes: infoVolumes,
        pages: infoPages,
        director: infoDirector,
        runtime: infoRunTime,
        starring: infoStarring,
        country: infoCountry,
        language: infoLanguage,
        budget: infoBudget,
        gross: infoGross,
      } = infobox.json();

      if (infoTitle) title = infoTitle.text;
      if (infoName) title = infoName?.text;
      if (infoAuthor) author = extractTextArray(infoAuthor.text);
      if (infoWriter) author = extractTextArray(infoWriter.text);
      if (infoPages) pages = Number(infoPages.text.match(/\d+/g)[0]);
      if (infoIssues) volumes = Number(infoIssues.text.match(/\d+/g)[0]);
      if (infoVolumes) volumes = Number(infoVolumes.text.match(/\d+/g)[0]);
      if (infoWriters) author = extractTextArray(infoWriters.text);
      if (infoDirector) directedBy = extractTextArray(infoDirector.text);
      if (infoStarring) starring = extractTextArray(infoStarring.text);
      if (infoRunTime) runTime = Number(infoRunTime.text.match(/\d+/g)[0]);
      if (infoCountry) country = extractTextArray(infoCountry.text);
      if (infoBudget) {
        budget = extractTextArray(infoBudget.text).join(' ');
      }
      if (infoGross) {
        boxOffice = extractTextArray(infoGross.text).join(' ');
      }
      if (infoLanguage) language = extractTextArray(infoLanguage.text);
    }
    return {
      title: removeParentheses(title),
      author,
      pages,
      volumes,
      directedBy,
      runTime,
      starring,
      country,
      language,
      budget,
      boxOffice,
    };
  }

  //#endregion Infobox

  //#region Seasons

  private async getSeasons(data: any): Promise<SeasonWikiDto[]> {
    const urlEncodeTitle = (title: string) => {
      const encodedTitle = title.replace(/ /g, '_');
      return encodeURIComponent(encodedTitle);
    };

    let newData = data;
    const listRegrex = /^List(s?) of.*episodes$/;
    let title = data
      .title()
      .replace(/\([^)]*\)/g, '')
      .trim();
    if (!listRegrex.test(title)) {
      title = urlEncodeTitle(`List of ${title} episodes`);
      const link = `https://en.wikipedia.org/wiki/${title}`;
      const res = await wtf.fetch(link);
      if (res) {
        newData = res;
      } else return [];
    }
    const seriesSeasons: {
      [key: number]: { episodes: number; title: string };
    } = {};

    if (newData.section('Series overview')) {
      const seasons = newData
        .section('Series overview')
        .templates()
        .map((temp: any) => temp.json())
        .filter((obj: any) => obj.template == 'series overview')[0];
      const episodesRegex = /episodes\d+\b/;
      const titleRegex = /auxa\d+\b/;
      for (const key in seasons) {
        if (episodesRegex.test(key)) {
          const tag = Number(key.slice(8));
          seriesSeasons[tag] = {
            ...seriesSeasons[tag],
            episodes: parseInt(seasons[key]),
          };
        }
        if (titleRegex.test(key)) {
          const tag = Number(key.slice(4));
          seriesSeasons[tag] = {
            ...seriesSeasons[tag],
            title: seasons[key],
          };
        }
      }
    }

    const sections = newData
      .sections()
      .map((section: any) => section.json().title);
    const sectionRegex = /Season (\d+):\s+([^()]+)/;
    for (const section of sections) {
      const match = section.match(sectionRegex);
      if (match) {
        const seasonNumber = parseInt(match[1], 10);
        const seasonName = match[2].trim();
        seriesSeasons[seasonNumber] = {
          ...seriesSeasons[seasonNumber],
          title: seasonName,
        };
      }
    }

    const seasonsArray = [];

    for (const seasonNumber in seriesSeasons) {
      if (seriesSeasons.hasOwnProperty(seasonNumber)) {
        seasonsArray.push({
          number: parseInt(seasonNumber),
          episodes: seriesSeasons[seasonNumber].episodes || null,
          title: seriesSeasons[seasonNumber].title || '',
        });
      }
    }
    return seasonsArray;
  }

  //#endregion

  //#region Parse

  public async wikiParse(dto: WikiParseDto): Promise<WikiResponseDto> {
    this.logger.log('wikiParse');
    const { link, mediaType } = dto;
    this.isEngWikiLinkCheck(link);

    const data: any | null = await wtf.fetch(link);

    if (!data) {
      throw this.errorsService.notFound('Page not found');
    }
    if (!this.checkSummary(data) && !this.checkClassify(data)) {
      throw this.errorsService.badRequest('Incorrect page');
    }

    let image = '';
    if (data.image()) {
      image = data.image().json().url;
    }

    const description = await this.getDescription(data);
    const { genres, tags, types } = this.extractCategories(data);

    const infobox = data.infobox();
    const { startYear, endYear } = this.getRangeYear(infobox, data);
    const {
      boxOffice,
      budget,
      author,
      pages,
      volumes,
      language,
      country,
      runTime,
      directedBy,
      starring,
      title,
    } = this.extractInfobox(infobox, data);

    switch (mediaType) {
      case 'film': {
        const type = this.getFilmType(types);

        const result: FilmWikiDto = {
          type,
          title,
          year: startYear,
          country: type === 'anime' && !country.length ? ['Japan'] : country,
          language:
            type === 'anime' && !language.length ? ['Japanese'] : language,
          description,
          directedBy,
          runTime,
          starring,
          boxOffice,
          budget,
          genres,
          tags,
          image,
        };
        return { media: result };
      }
      case 'serie': {
        const type = this.getSeriesType(types);

        const seasons = await this.getSeasons(data);

        const result: SerieWikiDto = {
          type,
          title,
          startYear,
          endYear,
          country: type === 'anime' && !country.length ? ['Japan'] : country,
          language:
            type === 'anime' && !language.length ? ['Japanese'] : language,
          description,
          directedBy,
          starring,
          genres,
          tags,
          seasons,
          image,
        };
        return { media: result };
      }
      case 'comic': {
        const type = this.getComicsType(types);

        const result: ComicWikiDto = {
          type,
          title,
          endYear,
          startYear,
          author,
          country: type === 'manga' && !country.length ? ['Japan'] : country,
          language:
            type === 'manga' && !language.length ? ['Japanese'] : language,
          description,
          volumes,
          genres,
          tags,
          image,
        };
        return { media: result };
      }
      case 'book': {
        const type = this.getBookType(types);

        const result: BookWikiDto = {
          type,
          title,
          year: startYear,
          author,
          country,
          language,
          description,
          pages,
          genres,
          tags,
          image,
        };
        return { media: result };
      }
    }
  }

  //#endregion Parse
}
