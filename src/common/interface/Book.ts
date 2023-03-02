export type Book = {
  author: BookAuthor;
  categories: BookCategory[];
  id: string;
  publishDate: string;
  summary: string;
  title: string;
};

export type BookCategory = {
  id: string;
  name: string;
};

export type BookAuthor = {
  name: string;
  avatar: string;
};
