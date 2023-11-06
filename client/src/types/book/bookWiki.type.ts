import { BookType } from './book.type';

export type BookWikiType = {
  type: BookType;
  title: string;
  year?: number;
  country?: string[];
  description?: string;
  author?: string[];
  language?: string[];
  pages?: number;
  genres?: string[];
  tags?: string[];
  image?: string;
};
