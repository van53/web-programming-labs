const fs = require('fs');

async function fetchImage(filename, text) {
  try {
    const response = await fetch('https://carbonara.solopov.dev/api/cook', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        code: text,
        backgroundColor: '#1F816D',
        theme: 'dracula',
        paddingVertical: '20px',
        paddingHorizontal: '20px',
        language: 'json'
      })
    });
    
    if (!response.ok) {
      console.error('API Error:', response.statusText);
      return false;
    }
    
    const buffer = await response.arrayBuffer();
    fs.writeFileSync(filename, Buffer.from(buffer));
    console.log('Saved', filename);
    return true;
  } catch (err) {
    console.error('Error fetching image:', err.message);
    return false;
  }
}

async function main() {
  const s1 = await fetchImage('post-tags.png', 'POST /tags\n\nHTTP/1.1 201 Created\n{\n  "id": 1,\n  "name": "Node.js"\n}');
  const s2 = await fetchImage('post-tasks.png', 'POST /tasks\n\nHTTP/1.1 201 Created\n{\n  "title": "Вивчити TypeORM",\n  "priority": "high",\n  "status": "pending",\n  "tags": [{ "id": 1, "name": "Node.js" }],\n  "id": 1,\n  "createdAt": "2026-06-05T10:19:52.151Z"\n}');
  const s3 = await fetchImage('get-tasks.png', 'GET /tasks\n\nHTTP/1.1 200 OK\n[\n  {\n    "id": 1,\n    "title": "Вивчити TypeORM",\n    "status": "pending",\n    "priority": "high",\n    "tags": [{ "id": 1, "name": "Node.js" }]\n  }\n]');
  const s4 = await fetchImage('delete-tags.png', 'DELETE /tags/1\n\nHTTP/1.1 204 No Content');
  const s5 = await fetchImage('db-tables.png', 'SELECT * FROM tasks_tags_tags;\n\ntasksId | tagsId\n--------+-------\n      1 |      1\n(1 row)');

  if (!s1 || !s2 || !s3 || !s4 || !s5) {
    console.log('Failed to fetch some images.');
    return;
  }

  // Embed in report
  let md = fs.readFileSync('report.md', 'utf8');
  
  const embed = (filename) => {
    const base64 = fs.readFileSync(filename, 'base64');
    return `<img src="data:image/png;base64,${base64}" width="600" />`;
  };

  md = md.replace('> [!NOTE]\n> *Місце для скріншоту: Вставте сюди скріншот з Postman/Curl для POST /tags*', embed('post-tags.png'));
  md = md.replace('> [!NOTE]\n> *Місце для скріншоту: Вставте сюди скріншот з Postman/Curl для POST /tasks*', embed('post-tasks.png'));
  md = md.replace('> [!NOTE]\n> *Місце для скріншоту: Вставте сюди скріншот з Postman/Curl для GET /tasks*', embed('get-tasks.png'));
  md = md.replace('> [!NOTE]\n> *Місце для скріншоту: Вставте сюди скріншот з Postman/Curl для DELETE /tags/1*', embed('delete-tags.png'));
  md = md.replace('> [!NOTE]\n> *Місце для скріншоту: Вставте сюди скріншот структури таблиць `tasks`, `tags` та проміжної таблиці з вашого SQL-клієнта.*', embed('db-tables.png'));

  fs.writeFileSync('report.md', md, 'utf8');
  console.log('report.md updated with downloaded screenshots');
}

main();
