export const ComicEnum = {
  manga: 'manga',
  comic: 'comic',
} as const;
export type ComicType = (typeof ComicEnum)[keyof typeof ComicEnum];
