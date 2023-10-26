export const SortEnum = {
  rateDesc: 'rateDesc',
  rateAsc: 'rateAsc',
  yearDesc: 'yearDesc',
  yearAsc: 'yearAsc',
  titleDesc: 'titleDesc',
  titleAsc: 'titleAsc',
  dateAsc: 'dateAsc',
  dateDesc: 'dateDesc',
} as const;

export type SortType = (typeof SortEnum)[keyof typeof SortEnum];
