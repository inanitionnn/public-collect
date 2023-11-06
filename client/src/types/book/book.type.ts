export const BookEnum = {
  fiction: 'fiction',
  nonFiction: 'nonFiction',
} as const;
export type BookType = (typeof BookEnum)[keyof typeof BookEnum];
