import { LIBRARY_NAME, books } from "./data.js";
import BookCollection from "./utils.js";
import { getOldestBook as findOldest, getAveragePages } from "./utils.js";

console.log("=== Завдання 5: Модулі ===");
console.log("Бібліотека:", LIBRARY_NAME);
console.log("Всього книг у списку:", books.length);

// Робота з функціями (named exports)
console.log("Найстаріша книга (чере з 'as'):", findOldest(books).title);
console.log("Середня кількість сторінок:", getAveragePages(books).toFixed(1));

// Робота з класом (default export)
const myCollection = new BookCollection(books);
console.log("Кількість у колекції (getter):", myCollection.count);

myCollection.addBook({ title: "Кайдашева сім'я", author: "І. Нечуй-Левицький", year: 1878, pages: 300, genre: "novel" });
console.log("Після додавання:", myCollection.count);

console.log("Сортування за роком:", 
  myCollection.getSortedByYear().map(b => `${b.title} (${b.year})`)
);