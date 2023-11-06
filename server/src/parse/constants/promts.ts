export class Promts {
  static readonly getSearchTitlePrompt = `You have to guess the media (film or serie or comic or book etc) and respond only with json filled with information in English. Fields: title string, year number`;

  static readonly StartParsePromt =
    "You're a knowledgeable geek. Your job is to fill in the data about different media perfectly. Reply only json file filled with data in english. If you don't find something write null. If unable to find data return {}. Json file has only the following fields:";

  static readonly FilmPromts = {
    type: 'type enum field can be "anime" "animated" "movie"',
    title: 'title string field',
    year: 'year number field',
    country: 'country array of string field',
    description:
      'description string field as briefly as possible without spoilers and an introduction, only the plot. Your task is to get the reader interested in the plot, not to retell the whole story',
    directedBy: 'directedBy array of string field',
    starring: 'starring array of string field',
    language: 'language array of string field',
    runTime: 'runTime number field is film duration in minutes',
    budget: 'budget string field is films budget in "$* million" format',
    boxOffice:
      'boxOffice string field is money that film collected in the "$* million" format',
    genres: 'genres array of string field',
    tags: 'tags array of string field',
  };

  static readonly SeriesPromts = {
    type: 'type enum field can be "anime" "animated" "tv"',
    title: 'title string field',
    startYear: 'startYear number field',
    endYear: 'endYear number field',
    description:
      'description string field as briefly as possible without spoilers and an introduction, only the plot. Your task is to get the reader interested in the plot, not to retell the whole story',
    country: 'country array of string field',
    starring: 'starring array of string field',
    directedBy: 'directedBy array of strings',
    language: 'language array of string field',
    genres: 'genres array of string field',
    tags: 'tags array of string field',
  };

  static readonly BookPromts = {
    type: 'type enum field can be "fiction" "nonFiction"',
    title: 'title string field',
    author: 'author array of string field',
    country: 'country array of string field',
    year: 'year number field',
    description:
      'description string field as briefly as possible without spoilers and an introduction, only the plot. Your task is to get the reader interested in the plot, not to retell the whole story',
    language: 'language array of string field',
    pages: 'pages number field',
    genres: 'genres array of string field',
    tags: 'tags array of string field',
  };

  static readonly ComicsPromts = {
    comicsType: 'type enum field can be "manga" "comic"',
    title: 'title string field',
    startYear: 'startYear number field',
    endYear: 'endYear number field',
    description:
      'description string field as briefly as possible without spoilers and an introduction, only the plot. Your task is to get the reader interested in the plot, not to retell the whole story',
    country: 'country array of string field',
    author: 'author array of string field',
    language: 'language array of string field',
    volumes: 'volumes number field',
    genres: 'genres array of string field',
    tags: 'tags array of string field',
  };
}
