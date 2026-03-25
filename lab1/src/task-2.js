import { VARIANT } from "./config.js";

const products = [
  { id: 1, name: "Ноутбук", price: 25000 + VARIANT * 100, category: "electronics", inStock: true },
  { id: 2, name: "Навушники", price: 2500 + VARIANT * 10, category: "electronics", inStock: true },
  { id: 3, name: "Футболка", price: 800 + VARIANT * 5, category: "clothing", inStock: false },
  { id: 4, name: "Книга 'JavaScript'", price: 450 + VARIANT * 3, category: "books", inStock: true },
  { id: 5, name: "Рюкзак", price: 1500 + VARIANT * 8, category: "accessories", inStock: true },
  { id: 6, name: "Клавіатура", price: 3200 + VARIANT * 15, category: "electronics", inStock: false },
  { id: 7, name: "Кросівки", price: 4200 + VARIANT * 20, category: "clothing", inStock: true },
  { id: 8, name: "Книга 'TypeScript'", price: 520 + VARIANT * 4, category: "books", inStock: true },
  { id: 9, name: "Чохол для телефону", price: 350 + VARIANT * 2, category: "accessories", inStock: true },
  { id: 10, name: "Монітор", price: 12000 + VARIANT * 50, category: "electronics", inStock: true },
];

/** 2.1. Назви товарів у наявності */
const getAvailableProducts = (prods) => prods.filter(p => p.inStock).map(p => p.name);

/** 2.2. Фільтрація за категорією та сортування за ціною */
const getProductsByCategory = (prods, cat) => 
  prods.filter(p => p.category === cat).sort((a, b) => a.price - b.price);

/** 2.3. Загальна сума товарів у наявності */
const getTotalPrice = (prods) => 
  prods.filter(p => p.inStock).reduce((sum, p) => sum + p.price, 0);

/** 2.4. Статистика по категоріях */
const getProductsSummary = (prods) => 
  prods.reduce((acc, p) => {
    if (!acc[p.category]) acc[p.category] = { count: 0, totalPrice: 0 };
    acc[p.category].count += 1;
    acc[p.category].totalPrice += p.price;
    return acc;
  }, {});

console.log("=== Завдання 2 ===");
console.log("Варіант:", VARIANT);
console.log("2.1:", getAvailableProducts(products));
console.log("2.2:", getProductsByCategory(products, "electronics"));
console.log("2.3:", getTotalPrice(products));
console.log("2.4:", getProductsSummary(products));