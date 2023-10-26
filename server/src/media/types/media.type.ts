export const MediaEnum = {
  film: 'film',
  serie: 'serie',
  comic: 'comic',
  book: 'book',
} as const;

export type MediaType = (typeof MediaEnum)[keyof typeof MediaEnum];
