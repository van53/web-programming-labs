/** 4.1. Затримка на ms мілісекунд */
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

/** 4.2. Симуляція мережевого запиту */
const simulateFetch = (url) => {
  return new Promise((resolve, reject) => {
    const wait = Math.floor(Math.random() * 301) + 200; // 200-500мс
    setTimeout(() => {
      if (!url.startsWith("https")) {
        return reject(new Error(`Invalid URL: ${url}`));
      }
      // 70% успіх, 30% помилка 500
      Math.random() > 0.3 
        ? resolve({ url, status: 200, data: "OK" }) 
        : reject(new Error("Server error: 500"));
    }, wait);
  });
};

/** 4.3. Повторні спроби запиту при помилці */
async function fetchWithRetry(url, attempts) {
  let lastError;
  for (let i = 1; i <= attempts; i++) {
    try {
      if (i > 1) console.log(`Спроба №${i}...`);
      return await simulateFetch(url);
    } catch (err) {
      lastError = err;
      if (i < attempts) await delay(500);
    }
  }
  throw lastError;
}

/** 4.4. Паралельне завантаження масиву URL */
async function fetchMultiple(urls) {
  const results = await Promise.allSettled(urls.map(url => simulateFetch(url)));
  return {
    successful: results
      .filter(r => r.status === 'fulfilled')
      .map(r => r.value),
    failed: results
      .filter(r => r.status === 'rejected')
      .map(r => r.reason.message)
  };
}

// Демонстрація роботи
async function main() {
  console.log("=== Завдання 4: async/await ===");

  console.time("delay");
  await delay(1000);
  console.timeEnd("delay");

  try {
    const res = await simulateFetch("https://api.example.com");
    console.log("4.2 Успіх:", res);
  } catch (e) {
    console.error("4.2 Помилка:", e.message);
  }

  try {
    const resRetry = await fetchWithRetry("https://api.example.com", 5);
    console.log("4.3 Результат:", resRetry);
  } catch (e) {
    console.error("4.3 Всі спроби невдалі:", e.message);
  }

  const multi = await fetchMultiple([
    "https://api.example.com/posts",
    "http://unsafe-url",
    "https://api.example.com/users",
  ]);
  console.log("4.4 Результати:", multi);
}

main();