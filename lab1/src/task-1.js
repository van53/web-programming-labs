/** 1.1. Форматування імені: "Прізвище І. Б." */
function getFullName({ firstName, lastName, middleName = "" }) {
  const firstInit = `${firstName[0]}.`;
  const middleInit = middleName ? ` ${middleName[0]}.` : "";
  return `${lastName} ${firstInit}${middleInit}`;
}

/** 1.2. Об'єднання об'єктів (пізніші перезаписують попередні) */
function mergeObjects(...objects) {
  return Object.assign({}, ...objects);
}

/** 1.3. Об'єднання масивів та видалення дублікатів */
function removeDuplicates(...arrays) {
  return [...new Set([].concat(...arrays))];
}

/** 1.4. Оновлення користувача та вкладеного об'єкта address */
function createUpdatedUser(user, updates) {
  return {
    ...user,
    ...updates,
    address: { 
      ...user.address, 
      ...(updates.address || {}) 
    }
  };
}

console.log("=== Завдання 1 ===");
console.log("1.1:", getFullName({ firstName: "Петро", lastName: "Іванов", middleName: "Сергійович" }));
console.log("1.2:", mergeObjects({ a: 1 }, { b: 2 }, { a: 3, c: 4 }));
console.log("1.3:", removeDuplicates([1, 2, 3], [2, 3, 4], [4, 5]));
const user = { name: "John", age: 25, address: { city: "Kyiv", zip: "01001" } };
console.log("1.4:", createUpdatedUser(user, { age: 26, address: { zip: "02002" } }));