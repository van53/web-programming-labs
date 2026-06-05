# Звіт з лабораторної роботи №8

**Тема:** Інтеграція бази даних у Nest.js застосунок
**Виконав(ла):** [Ваше ПІБ, група]

---

## 1. Відповіді на контрольні запитання

1. **Що таке ORM і яку проблему вона вирішує?**
   ORM (Object-Relational Mapping) — це технологія програмування, яка пов'язує бази даних з концепціями об'єктно-орієнтованих мов програмування, створюючи "віртуальну об'єктну базу даних". Вона вирішує проблему розбіжності між реляційною моделлю бази даних та об'єктною моделлю програми (Object-relational impedance mismatch), дозволяючи розробникам працювати з даними як зі звичайними об'єктами, не пишучи SQL-запити вручну.

2. **Що таке Entity у TypeORM і як вона пов'язана з таблицею в базі даних?**
   Entity (сутність) у TypeORM — це клас TypeScript, позначений декоратором `@Entity()`. Цей клас описує структуру таблиці в базі даних, де властивості класу, позначені декораторами `@Column()`, відповідають стовпцям таблиці, а екземпляри класу — окремим рядкам у ній.

3. **Що таке Repository і для чого він використовується у сервісі?**
   Repository (репозиторій) — це абстракція, яка інкапсулює логіку доступу до даних конкретної Entity. У сервісі він використовується для виконання CRUD-операцій (`find`, `findOne`, `save`, `update`, `delete` тощо) із цією сутністю без необхідності писати SQL безпосередньо.

4. **Що таке міграція і чим вона відрізняється від опції `synchronize: true`?**
   Міграція — це файл, який описує зміни схеми бази даних. Він дозволяє контрольовано та безпечно оновлювати (up) та відкочувати (down) структуру БД. На відміну від неї, `synchronize: true` автоматично синхронізує структуру БД із поточними сутностями при кожному запуску, що може бути небезпечним для продакшн-середовища, оскільки це може призвести до неочікуваної втрати даних (наприклад, видалення стовпців).

5. **Що таке junction-таблиця і коли вона створюється?**
   Junction-таблиця (проміжна таблиця) створюється для реалізації зв'язку Many-to-Many між двома таблицями (наприклад, `tasks` та `tags`). Вона містить зовнішні ключі на обидві пов'язані таблиці. У TypeORM вона створюється автоматично при використанні декораторів `@ManyToMany` та `@JoinTable()`.

---

## 2. Скріншоти ключових частин коду

### Код сутності Task (task.entity.ts)
```typescript
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { Tag } from '../../tags/entities/tag.entity';

@Entity('tasks')
export class Task {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100 })
  title: string;

  @Column({ type: 'text', nullable: true })
  description: string | null;

  @Column({ default: 'pending' })
  status: 'pending' | 'in-progress' | 'done';

  @Column({ default: 'medium' })
  priority: 'low' | 'medium' | 'high';

  @CreateDateColumn()
  createdAt: Date;

  @ManyToMany(() => Tag, { onDelete: 'CASCADE' })
  @JoinTable()
  tags: Tag[];
}
```

### Код конфігурації TypeORM (data-source.ts)
```typescript
import { DataSource } from 'typeorm';
import { config } from 'dotenv';
import { Task } from './tasks/entities/task.entity';
import { Tag } from './tags/entities/tag.entity';

config();

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || '5432'),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  entities: [Task, Tag],
  migrations: ['src/migrations/*.ts'],
  synchronize: false,
});
```

### Код сервісу задач (tasks.service.ts)
```typescript
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Task } from './entities/task.entity';
import { Tag } from '../tags/entities/tag.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private readonly tasksRepository: Repository<Task>,
    @InjectRepository(Tag)
    private readonly tagsRepository: Repository<Tag>,
  ) {}

  findAll(): Promise<Task[]> {
    return this.tasksRepository.find({ relations: { tags: true } });
  }

  findByStatus(status: string): Promise<Task[]> {
    return this.tasksRepository.find({
      where: { status: status as any },
      relations: { tags: true },
    });
  }

  findOne(id: number): Promise<Task | null> {
    return this.tasksRepository.findOne({
      where: { id },
      relations: { tags: true },
    });
  }

  async create(dto: CreateTaskDto): Promise<Task> {
    const { tagIds, ...taskData } = dto;
    const task = this.tasksRepository.create(taskData);

    if (tagIds && tagIds.length > 0) {
      const tags = await this.tagsRepository.find({
        where: { id: In(tagIds) },
      });
      task.tags = tags;
    }

    return this.tasksRepository.save(task);
  }

  async update(id: number, dto: UpdateTaskDto): Promise<Task | null> {
    const task = await this.findOne(id);
    if (!task) return null;

    const { tagIds, ...updateData } = dto;
    Object.assign(task, updateData);

    if (tagIds !== undefined) {
      if (tagIds.length > 0) {
        const tags = await this.tagsRepository.find({
          where: { id: In(tagIds) },
        });
        task.tags = tags;
      } else {
        task.tags = [];
      }
    }

    return this.tasksRepository.save(task);
  }

  async remove(id: number): Promise<boolean> {
    const result = await this.tasksRepository.delete(id);
    return result.affected ? result.affected > 0 : false;
  }
}
```


---

## 3. Результати тестування API (Curl/Postman)

### 3.1. Створення тега (POST /tags)
**Запит:** `POST http://localhost:3000/tags`
**Тіло:**
```json
{
  "name": "Node.js"
}
```
**Відповідь (HTTP 201):**
```json
{
  "id": 1,
  "name": "Node.js"
}
```

> [!NOTE]
> *Місце для скріншоту: Вставте сюди скріншот з Postman/Curl для POST /tags*

### 3.2. Створення задачі з прив'язкою тега (POST /tasks)
**Запит:** `POST http://localhost:3000/tasks`
**Тіло:**
```json
{
  "title": "Вивчити TypeORM",
  "priority": "high",
  "tagIds": [1]
}
```
**Відповідь (HTTP 201):**
```json
{
  "title": "Вивчити TypeORM",
  "priority": "high",
  "status": "pending",
  "tags": [
    {
      "id": 1,
      "name": "Node.js"
    }
  ],
  "id": 1,
  "createdAt": "2026-06-05T10:19:52.151Z"
}
```

> [!NOTE]
> *Місце для скріншоту: Вставте сюди скріншот з Postman/Curl для POST /tasks*

### 3.3. Отримання задач (GET /tasks)
**Запит:** `GET http://localhost:3000/tasks`
**Відповідь (HTTP 200):**
```json
[
  {
    "id": 1,
    "title": "Вивчити TypeORM",
    "description": null,
    "status": "pending",
    "priority": "high",
    "createdAt": "2026-06-05T10:19:52.151Z",
    "tags": [
      {
        "id": 1,
        "name": "Node.js"
      }
    ]
  }
]
```

> [!NOTE]
> *Місце для скріншоту: Вставте сюди скріншот з Postman/Curl для GET /tasks*

### 3.4. Видалення тега з перевіркою каскадного видалення (DELETE /tags/1)
**Запит:** `DELETE http://localhost:3000/tags/1`
**Відповідь (HTTP 204):**
*(Без тіла)*

> [!NOTE]
> *Місце для скріншоту: Вставте сюди скріншот з Postman/Curl для DELETE /tags/1*

---

## 4. Скріншоти бази даних (DBeaver/pgAdmin)

> [!NOTE]
> *Місце для скріншоту: Вставте сюди скріншот структури таблиць `tasks`, `tags` та проміжної таблиці з вашого SQL-клієнта.*

---

## 5. Посилання на GitHub-репозиторій

**Репозиторій:** https://github.com/van53/web-programming-labs/tree/main

---

## 6. Висновок
Під час виконання лабораторної роботи №8 було успішно здійснено інтеграцію бази даних PostgreSQL у застосунок Nest.js з використанням TypeORM. Було реалізовано сутності `Task` та `Tag` зі зв'язком Many-to-Many, налаштовано міграції для керування схемою бази даних та переписано CRUD-сервіси для роботи з базою даних замість масиву в пам'яті. Усі ендпоінти API працюють коректно, дані надійно зберігаються у базі, а зв'язки між сутностями обробляються автоматично, включно з каскадним видаленням на рівні БД.
