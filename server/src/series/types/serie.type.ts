export const SerieEnum = {
  tv: 'tv',
  anime: 'anime',
  animated: 'animated',
} as const;
export type SerieType = (typeof SerieEnum)[keyof typeof SerieEnum];
