import { books } from './schemas/books.schema';
import { comics } from './schemas/comics.schema';
import { films } from './schemas/films.schema';
import { progress } from './schemas/progress.schema';
import { seasons } from './schemas/seasons.schema';
import { series } from './schemas/series.schema';

//#region Progress
export const ProgressResponseObject = {
  watched: progress.watched,
  finishedOn: progress.finishedOn,
  note: progress.note,
  rate: progress.rate,
  createdAt: progress.createdAt,
};

//#endregion Progress

//#region Films
export const FilmResponseObject = {
  id: films.id,
  type: films.type,
  title: films.title,
  year: films.year,
  country: films.country,
  description: films.description,
  directedBy: films.directedBy,
  starring: films.starring,
  language: films.language,
  runTime: films.runTime,
  boxOffice: films.boxOffice,
  budget: films.budget,
  genres: films.genres,
  tags: films.tags,
  image: films.image,
};
export const FilmProgressObject = {
  media: FilmResponseObject,
  progress: ProgressResponseObject,
};
//#endregion Films

//#region Series
export const SerieResponseObject = {
  id: series.id,
  type: series.type,
  title: series.title,
  startYear: series.startYear,
  endYear: series.endYear,
  country: series.country,
  description: series.description,
  directedBy: series.directedBy,
  starring: series.starring,
  language: series.language,
  genres: series.genres,
  tags: series.tags,
  image: series.image,
};

export const SerieProgressObject = {
  media: SerieResponseObject,
  progress: ProgressResponseObject,
};
//#endregion Series

//#region Comics
export const ComicResponseObject = {
  id: comics.id,
  type: comics.type,
  title: comics.title,
  startYear: comics.startYear,
  endYear: comics.endYear,
  country: comics.country,
  description: comics.description,
  author: comics.author,
  language: comics.language,
  volumes: comics.volumes,
  genres: comics.genres,
  tags: comics.tags,
  image: comics.image,
};

export const ComicProgressObject = {
  media: ComicResponseObject,
  progress: ProgressResponseObject,
};
//#endregion Comics

//#region Books
export const BookResponseObject = {
  id: books.id,
  type: books.type,
  title: books.title,
  year: books.year,
  country: books.country,
  description: books.description,
  author: books.author,
  language: books.language,
  pages: books.pages,
  genres: books.genres,
  tags: books.tags,
  image: books.image,
};

export const BookProgressObject = {
  media: BookResponseObject,
  progress: ProgressResponseObject,
};
//#endregion Books

//#region Seasons
export const SeasonResponseObject = {
  id: seasons.id,
  number: seasons.number,
  episodes: seasons.episodes,
  title: seasons.title,
  rate: seasons.rate,
};
//#endregion Seasons

export * from './schemas/books.schema';
export * from './schemas/collections.shema';
export * from './schemas/comics.schema';
export * from './schemas/films.schema';
export * from './schemas/orders.schema';
export * from './schemas/progress.schema';
export * from './schemas/seasons.schema';
export * from './schemas/series.schema';
