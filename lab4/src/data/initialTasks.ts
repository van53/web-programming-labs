
import { Task } from "../types/task";

export const INITIAL_TASKS: Task[] = [
  {
    id: "1",
    title: "Налаштування Docker-контейнерів",
    description: "Створити Dockerfile та docker-compose.yml для локального середовища розробки.",
    status: "done",
    priority: "high",
    createdAt: new Date("2026-03-01"),
  },
  {
    id: "2",
    title: "Розробка REST API",
    description: "Реалізувати ендпоінти для авторизації користувачів через JWT.",
    status: "in-progress",
    priority: "high",
    createdAt: new Date("2026-03-05"),
  },
  {
    id: "3",
    title: "Оптимізація SQL запитів",
    description: "Провести аналіз повільних запитів та додати індекси до таблиці orders.",
    status: "todo",
    priority: "medium",
    createdAt: new Date("2026-03-10"),
  },
  {
    id: "4",
    title: "Рефакторинг модулів",
    description: "Винести логіку валідації в окремий сервісний шар.",
    status: "todo",
    priority: "low",
    createdAt: new Date("2026-03-15"),
  },
];