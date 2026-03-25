/** Named exports */
export const getBooksByGenre = (books, genre) => books.filter(b => b.genre === genre);

export const getAveragePages = (books) => 
  books.length ? books.reduce((sum, b) => sum + b.pages, 0) / books.length : 0;

export const getOldestBook = (books) => 
  [...books].sort((a, b) => a.year - b.year)[0];

/** Default export */
export default class BookCollection {
  constructor(books = []) {
    this.books = [...books];
  }

  getSortedByYear() {
    return [...this.books].sort((a, b) => a.year - b.year);
  }

  addBook(book) {
    this.books.push(book);
  }

  get count() {
    return this.books.length;
  }
}