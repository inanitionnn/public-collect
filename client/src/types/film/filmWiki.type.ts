import { FilmType } from './film.type';

export type FilmWikiType = {
  type: FilmType;
  title: string;
  year?: number;
  country?: string[];
  description?: string;
  directedBy?: string[];
  starring?: string[];
  language?: string[];
  runTime?: number;
  boxOffice?: string;
  budget?: string;
  genres?: string[];
  tags?: string[];
  image?: string;
};
