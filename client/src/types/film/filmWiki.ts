import { FilmType } from './film.type';
import { FilmWikiType } from './filmWiki.type';

export class FilmWiki {
  type: FilmType;
  title: string;
  year?: number;
  country?: string;
  description?: string;
  directedBy?: string;
  starring?: string;
  language?: string;
  runTime?: number;
  boxOffice?: string;
  budget?: string;
  genres?: string;
  tags?: string;
  image?: string;

  constructor(film: FilmWikiType) {
    this.title = film.title;
    this.type = film.type;
    this.year = film.year;
    this.country = film.country?.join(', ');
    this.description = film.description;
    this.directedBy = film.directedBy?.join(', ');
    this.starring = film.starring?.join(', ');
    this.language = film.language?.join(', ');
    this.runTime = film.runTime;
    this.boxOffice = film.boxOffice;
    this.budget = film.budget;
    this.genres = film.genres?.join(', ');
    this.tags = film.tags?.join(', ');
    this.image = film.image;
  }
}
