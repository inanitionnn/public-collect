import { SeasonWikiType } from '../season/seasonWiki.type';
import { SerieType } from './serie.type';

export type SerieWikiDto = {
  type: SerieType;
  title: string;
  startYear?: number;
  endYear?: number;
  country?: string[];
  description?: string;
  directedBy?: string[];
  starring?: string[];
  language?: string[];
  seasons?: SeasonWikiType[];
  genres?: string[];
  tags?: string[];
  image?: string;
};
