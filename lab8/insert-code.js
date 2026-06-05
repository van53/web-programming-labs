const fs = require('fs');

const taskEntityCode = fs.readFileSync('./src/tasks/entities/task.entity.ts', 'utf8');
const dataSourceCode = fs.readFileSync('./src/data-source.ts', 'utf8');
const tasksServiceCode = fs.readFileSync('./src/tasks/tasks.service.ts', 'utf8');

let md = fs.readFileSync('./report.md', 'utf8');

const codeReplacement = `### Код сутності Task (task.entity.ts)
\`\`\`typescript
${taskEntityCode}
\`\`\`

### Код конфігурації TypeORM (data-source.ts)
\`\`\`typescript
${dataSourceCode}
\`\`\`

### Код сервісу задач (tasks.service.ts)
\`\`\`typescript
${tasksServiceCode}
\`\`\`
`;

md = md.replace('> [!NOTE]\n> *Місце для скріншотів коду: Вставте сюди скріншоти коду `task.entity.ts`, `data-source.ts` та `tasks.service.ts`.*', codeReplacement);

md = md.replace('**Репозиторій:** [Вставте сюди посилання на ваш GitHub]', '**Репозиторій:** https://github.com/van53/web-programming-labs/tree/main');

fs.writeFileSync('./report.md', md, 'utf8');
console.log('report.md updated with code snippets');
