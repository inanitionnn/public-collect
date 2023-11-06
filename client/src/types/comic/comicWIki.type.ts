import { ComicType } from './comic.type';

export type ComicWikiType = {
  type: ComicType;
  title: string;
  startYear?: number;
  endYear?: number;
  country?: string[];
  description?: string;
  author?: string[];
  language?: string[];
  volumes?: number;
  genres?: string[];
  tags?: string[];
  image?: string;
};
