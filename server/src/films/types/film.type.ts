export const FilmEnum = {
  movie: 'movie',
  anime: 'anime',
  animated: 'animated',
} as const;

export type FilmType = (typeof FilmEnum)[keyof typeof FilmEnum];
