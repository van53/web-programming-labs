const fs = require('fs');

async function testAPI() {
  let md = `# Звіт з лабораторної роботи №8\n\n`;
  md += `## Тестування API\n\n`;

  const fetchOpts = (method, body) => ({
    method,
    headers: { 'Content-Type': 'application/json' },
    body: body ? JSON.stringify(body) : undefined
  });

  const runTest = async (title, url, method, body) => {
    md += `### ${title}\n`;
    md += `**Запит:** \`${method} ${url}\`\n`;
    if (body) md += `**Тіло:**\n\`\`\`json\n${JSON.stringify(body, null, 2)}\n\`\`\`\n`;
    
    try {
      const res = await fetch(url, fetchOpts(method, body));
      const status = res.status;
      let data = null;
      if (status !== 204) {
        data = await res.json();
      }
      
      md += `**Відповідь (HTTP ${status}):**\n`;
      if (data) md += `\`\`\`json\n${JSON.stringify(data, null, 2)}\n\`\`\`\n\n`;
      else md += `*(Без тіла)*\n\n`;
      
      md += `> [!NOTE]\n> *Місце для скріншоту: Вставте сюди скріншот з Postman/Curl для ${title}*\n\n`;
      
    } catch (e) {
      md += `**Помилка:** ${e.message}\n\n`;
    }
  };

  await runTest('1. Створення тега (POST /tags)', 'http://localhost:3000/tags', 'POST', { name: 'Node.js' });
  await runTest('2. Створення задачі з прив\'язкою тега (POST /tasks)', 'http://localhost:3000/tasks', 'POST', { title: 'Вивчити TypeORM', priority: 'high', tagIds: [1] });
  await runTest('3. Отримання задач (GET /tasks)', 'http://localhost:3000/tasks', 'GET');
  await runTest('4. Отримання тегів (GET /tags)', 'http://localhost:3000/tags', 'GET');
  await runTest('5. Видалення тега (DELETE /tags/1)', 'http://localhost:3000/tags/1', 'DELETE');
  await runTest('6. Отримання задач після видалення тега (GET /tasks)', 'http://localhost:3000/tasks', 'GET');

  fs.writeFileSync('report.md', md, 'utf-8');
  console.log('Test completed. report.md generated.');
}

testAPI();
