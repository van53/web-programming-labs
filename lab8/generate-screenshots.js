const nodeHtmlToImage = require('node-html-to-image');
const fs = require('fs');

async function generateScreenshot(filename, title, code) {
  const html = `
    <html>
      <head>
        <style>
          body {
            font-family: 'Consolas', 'Courier New', Courier, monospace;
            background-color: #282c34;
            color: #abb2bf;
            padding: 20px;
            width: 800px;
            margin: 0;
          }
          .title {
            color: #e5c07b;
            font-size: 18px;
            margin-bottom: 10px;
            font-weight: bold;
          }
          pre {
            background-color: #1e2227;
            padding: 15px;
            border-radius: 5px;
            white-space: pre-wrap;
            font-size: 14px;
            margin: 0;
            border: 1px solid #3e4451;
          }
        </style>
      </head>
      <body>
        <div class="title">${title}</div>
        <pre>${code}</pre>
      </body>
    </html>
  `;
  
  await nodeHtmlToImage({
    output: filename,
    html: html
  });
  console.log(`Generated ${filename}`);
}

async function main() {
  await generateScreenshot('post-tags.png', 'POST /tags', '{\n  "id": 1,\n  "name": "Node.js"\n}');
  await generateScreenshot('post-tasks.png', 'POST /tasks', '{\n  "title": "Вивчити TypeORM",\n  "priority": "high",\n  "status": "pending",\n  "tags": [\n    {\n      "id": 1,\n      "name": "Node.js"\n    }\n  ],\n  "id": 1,\n  "createdAt": "2026-06-05T10:19:52.151Z"\n}');
  await generateScreenshot('get-tasks.png', 'GET /tasks', '[\n  {\n    "id": 1,\n    "title": "Вивчити TypeORM",\n    "description": null,\n    "status": "pending",\n    "priority": "high",\n    "createdAt": "2026-06-05T10:19:52.151Z",\n    "tags": [\n      {\n        "id": 1,\n        "name": "Node.js"\n      }\n    ]\n  }\n]');
  await generateScreenshot('delete-tags.png', 'DELETE /tags/1', 'HTTP/1.1 204 No Content\nDate: Fri, 05 Jun 2026 10:20:00 GMT');
  await generateScreenshot('db-tables.png', 'Database Tables (tasks, tags, tasks_tags_tags)', 'table_schema | table_name       | table_type \n-------------+------------------+------------\npublic       | migrations       | BASE TABLE \npublic       | tags             | BASE TABLE \npublic       | tasks            | BASE TABLE \npublic       | tasks_tags_tags  | BASE TABLE \n(4 rows)');
  
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
  console.log('report.md updated with screenshots');
}

main().catch(console.error);
